import * as THREE from "three";

// Safe arrival positions face the landmark and leave room to select nearby work.
export const destinations: Record<
  string,
  { position: [number, number, number]; look: [number, number, number] }
> = {
  home: { position: [0, 4.2, 8], look: [-1, 3, -12] },
  profile: { position: [-18, 4, -3], look: [-19, 3.5, -8] },
  works: { position: [13, 4, -1], look: [16, 4, -6] },
  playground: { position: [8, 4, 18], look: [10, 3, 23] },
};

export const navigationBounds = (colliders: THREE.Object3D[]) => {
  return colliders.map((o) =>
    new THREE.Box3().setFromObject(o).expandByScalar(0.95)
  );
};
export const clearSegment = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  boxes: THREE.Box3[]
) => {
  const d = b.clone().sub(a),
    length = d.length();
  if (length < 1e-6) return true;
  const ray = new THREE.Ray(a, d.divideScalar(length)),
    hit = new THREE.Vector3();
  return !boxes.some(
    (box) =>
      box.containsPoint(a) ||
      box.containsPoint(b) ||
      (ray.intersectBox(box, hit) !== null && hit.distanceTo(a) < length)
  );
};

/** A bounded 3D A* search permits travel around or above rock, with no fixed tour. */
export const planRoute = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  allBoxes: THREE.Box3[]
): THREE.Vector3[] => {
  // A manually positioned avatar can be inside a conservative bounds padding.
  // Ignore only that starting padding; exact mesh collision remains active in engine.
  const boxes = allBoxes.filter((b) => !b.containsPoint(start));
  if (clearSegment(start, end, boxes)) return [end.clone()];
  const step = 2,
    key = (p: THREE.Vector3) =>
      `${Math.round((p.x - start.x) / step)},${Math.round((p.y - start.y) / step)},${Math.round((p.z - start.z) / step)}`;
  type Node = { p: THREE.Vector3; g: number; f: number; parent?: Node };
  const heap: Node[] = [];
  const push = (n: Node) => {
    heap.push(n);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent].f <= n.f) break;
      heap[i] = heap[parent];
      i = parent;
    }
    heap[i] = n;
  };
  const pop = () => {
    const first = heap[0],
      last = heap.pop()!;
    if (heap.length) {
      let i = 0;
      while (i * 2 + 1 < heap.length) {
        let c = i * 2 + 1;
        if (c + 1 < heap.length && heap[c + 1].f < heap[c].f) c++;
        if (heap[c].f >= last.f) break;
        heap[i] = heap[c];
        i = c;
      }
      heap[i] = last;
    }
    return first;
  };
  const best = new Map<string, number>();
  push({ p: start.clone(), g: 0, f: start.distanceTo(end) });
  best.set(key(start), 0);
  const offsets: THREE.Vector3[] = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++)
        if (x || y || z)
          offsets.push(new THREE.Vector3(x, y, z).multiplyScalar(step));
  for (let iterations = 0; heap.length && iterations < 16000; iterations++) {
    const current = pop();
    if (current.g > (best.get(key(current.p)) ?? Infinity)) continue;
    if (clearSegment(current.p, end, boxes)) {
      const reverse = [end.clone()];
      let n: Node | undefined = current;
      while (n) {
        reverse.push(n.p);
        n = n.parent;
      }
      const route = reverse.reverse();
      const simplified: THREE.Vector3[] = [];
      let i = 0;
      while (i < route.length - 1) {
        let j = route.length - 1;
        while (j > i + 1 && !clearSegment(route[i], route[j], boxes)) j--;
        simplified.push(route[j]);
        i = j;
      }
      return simplified;
    }
    for (const offset of offsets) {
      const p = current.p.clone().add(offset);
      if (
        Math.max(Math.abs(p.x), Math.abs(p.z)) > 65 ||
        p.y < 1.8 ||
        p.y > 18.5
      )
        continue;
      const g = current.g + offset.length(),
        k = key(p);
      if (g >= (best.get(k) ?? Infinity) || !clearSegment(current.p, p, boxes))
        continue;
      best.set(k, g);
      push({ p, g, f: g + p.distanceTo(end), parent: current });
    }
  }
  return [];
};
