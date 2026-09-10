import { readFileSync, writeFileSync } from "node:fs";

// Run once against the original sculpt: node scripts/smooth-sunameri.mjs input.glb output.glb
// A weighted Taubin pass smooths fin edges without globally shrinking the animal.
const [input, output] = process.argv.slice(2);
if (!input || !output || input === output) {
  throw new Error("Supply separate input.glb and output.glb paths.");
}
const data = readFileSync(input);
const jsonLength = data.readUInt32LE(12);
const gltf = JSON.parse(data.subarray(20, 20 + jsonLength).toString());
if (gltf.asset.generator?.includes("fin smoothing")) {
  throw new Error(
    "Use the original sculpt to avoid smoothing an already processed model."
  );
}
let binary = Buffer.from(data.subarray(28 + jsonLength));
const primitive = gltf.meshes[0].primitives[0];
const accessor = (index, components, Type) => {
  const entry = gltf.accessors[index];
  const view = gltf.bufferViews[entry.bufferView];
  if (view.byteStride || entry.sparse)
    throw new Error("Expected packed mesh data.");
  return new Type(
    binary.buffer,
    binary.byteOffset + (view.byteOffset ?? 0) + (entry.byteOffset ?? 0),
    entry.count * components
  );
};
let positions = accessor(primitive.attributes.POSITION, 3, Float32Array);
let normals = accessor(primitive.attributes.NORMAL, 3, Float32Array);
let indices = accessor(primitive.indices, 1, Uint32Array);
const adjacency = (count, triangles) => {
  const result = Array.from({ length: count }, () => new Set());
  for (let i = 0; i < triangles.length; i += 3) {
    const [a, b, c] = triangles.subarray(i, i + 3);
    result[a].add(b).add(c);
    result[b].add(a).add(c);
    result[c].add(a).add(b);
  }
  return result;
};
// The implicit sculpt contains two tiny disconnected slivers along the fin edge.
// Keep the connected animal and remove those floating fragments before smoothing.
const connected = adjacency(positions.length / 3, indices);
const seen = new Set();
let main = [];
for (let i = 0; i < connected.length; i++) {
  if (seen.has(i)) continue;
  const stack = [i],
    component = [];
  seen.add(i);
  while (stack.length) {
    const vertex = stack.pop();
    component.push(vertex);
    for (const neighbor of connected[vertex])
      if (!seen.has(neighbor)) {
        seen.add(neighbor);
        stack.push(neighbor);
      }
  }
  if (component.length > main.length) main = component;
}
main.sort((a, b) => a - b);
if (main.length < connected.length * 0.99)
  throw new Error("Unexpected disconnected model");
const remap = new Map(main.map((old, index) => [old, index]));
positions = Float32Array.from(
  main.flatMap((i) => Array.from(positions.subarray(i * 3, i * 3 + 3)))
);
normals = Float32Array.from(
  main.flatMap((i) => Array.from(normals.subarray(i * 3, i * 3 + 3)))
);
const keptIndices = [];
for (let i = 0; i < indices.length; i += 3) {
  if (remap.has(indices[i]))
    keptIndices.push(
      ...Array.from(indices.subarray(i, i + 3), (id) => remap.get(id))
    );
}
indices = Uint32Array.from(keptIndices);
const original = Float32Array.from(positions);
const count = positions.length / 3;
const neighbors = adjacency(count, indices);
const smoothstep = (a, b, value) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const weights = Float64Array.from({ length: count }, (_, i) => {
  const x = Math.abs(original[i * 3]),
    z = original[i * 3 + 2];
  const pectoral =
    smoothstep(0.62, 0.88, x) * (1 - smoothstep(0.85, 1.35, Math.abs(z + 0.2)));
  const tail = 1 - smoothstep(-2.4, -1.9, z);
  return Math.max(pectoral, tail);
});
let current = Float64Array.from(positions);
for (let iteration = 0; iteration < 240; iteration++) {
  for (const factor of [0.5, -0.4]) {
    const next = Float64Array.from(current);
    for (let i = 0; i < count; i++) {
      if (!weights[i] || !neighbors[i].size) continue;
      for (let axis = 0; axis < 3; axis++) {
        let average = 0;
        for (const neighbor of neighbors[i])
          average += current[neighbor * 3 + axis];
        const offset = i * 3 + axis;
        next[offset] +=
          factor * weights[i] * (average / neighbors[i].size - current[offset]);
      }
    }
    current = next;
  }
}
positions.set(current);
const generatedNormals = new Float64Array(normals.length);
for (let i = 0; i < indices.length; i += 3) {
  const ids = indices.subarray(i, i + 3),
    [a, b, c] = ids;
  const ab = [0, 1, 2].map(
    (axis) => positions[b * 3 + axis] - positions[a * 3 + axis]
  );
  const ac = [0, 1, 2].map(
    (axis) => positions[c * 3 + axis] - positions[a * 3 + axis]
  );
  const normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  for (const id of ids)
    for (let axis = 0; axis < 3; axis++)
      generatedNormals[id * 3 + axis] += normal[axis];
}
let moved = 0,
  maxDisplacement = 0;
for (let i = 0; i < count; i++) {
  const offset = i * 3;
  if (!weights[i]) continue;
  const length = Math.hypot(...generatedNormals.subarray(offset, offset + 3));
  if (!length) throw new Error(`Degenerate vertex ${i}`);
  const blended = [0, 1, 2].map(
    (axis) =>
      normals[offset + axis] * (1 - weights[i]) +
      (generatedNormals[offset + axis] / length) * weights[i]
  );
  const norm = Math.hypot(...blended);
  for (let axis = 0; axis < 3; axis++)
    normals[offset + axis] = blended[axis] / norm;
  moved++;
  maxDisplacement = Math.max(
    maxDisplacement,
    Math.hypot(
      ...[0, 1, 2].map(
        (axis) => positions[offset + axis] - original[offset + axis]
      )
    )
  );
}
const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
positionAccessor.min = [Infinity, Infinity, Infinity];
positionAccessor.max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positions.length; i++) {
  if (!Number.isFinite(positions[i]) || !Number.isFinite(normals[i]))
    throw new Error("Non-finite geometry");
  positionAccessor.min[i % 3] = Math.min(
    positionAccessor.min[i % 3],
    positions[i]
  );
  positionAccessor.max[i % 3] = Math.max(
    positionAccessor.max[i % 3],
    positions[i]
  );
}
binary = Buffer.concat([
  Buffer.from(positions.buffer),
  Buffer.from(normals.buffer),
  Buffer.from(indices.buffer),
]);
gltf.buffers[0].byteLength = binary.length;
let byteOffset = 0;
for (const [index, values, components] of [
  [primitive.attributes.POSITION, positions, 3],
  [primitive.attributes.NORMAL, normals, 3],
  [primitive.indices, indices, 1],
]) {
  const entry = gltf.accessors[index],
    view = gltf.bufferViews[entry.bufferView];
  entry.count = values.length / components;
  entry.byteOffset = 0;
  view.byteOffset = byteOffset;
  view.byteLength = values.byteLength;
  byteOffset += values.byteLength;
}
gltf.asset.generator =
  "YEND.DEV custom implicit surface sculpt; fin smoothing v1";
const json = Buffer.from(JSON.stringify(gltf));
const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(padded);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + padded.length + binary.length, 8);
header.writeUInt32LE(padded.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(binary.length, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);
writeFileSync(output, Buffer.concat([header, padded, binaryHeader, binary]));
console.log(
  JSON.stringify({
    vertices: count,
    smoothedVertices: moved,
    maxDisplacement,
    triangles: indices.length / 3,
  })
);
