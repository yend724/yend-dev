import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import fontData from "three/examples/fonts/helvetiker_bold.typeface.json";

import { works, playgrounds } from "@/features/ocean/data";

import avatarDetails from "./avatar-details.json";
import { applyWaterFog } from "./fog";
import {
  makeRock,
  makeSand,
  makeSkin,
  makeSkinDepth,
  makeLightColumn,
} from "./shaders";
export type Target = {
  id: string;
  kind: "profile" | "works" | "playground";
  position: THREE.Vector3;
  anchor: THREE.Vector3;
  object: THREE.Object3D;
  label: string;
  /** Labelled from afar so each area keeps one visible landmark. */
  landmark?: boolean;
  reaction?: THREE.ShaderMaterial;
};
export type World = {
  environment: THREE.Group;
  targets: Target[];
  colliders: THREE.Object3D[];
  animated: {
    object: THREE.Object3D;
    baseY: number;
    seed: number;
    type: string;
  }[];
  skin: THREE.MeshPhysicalMaterial;
  porpoise: THREE.Group;
  rock: THREE.MeshStandardMaterial;
  lights: THREE.PointLight[];
};
type ArcLayout = {
  center: [number, number];
  /** Direction (radians) of the arc's open side, i.e. where visitors arrive from. */
  opening: number;
  /** Angle (radians) the items occupy, centred opposite the opening. */
  span: number;
  /** Target distance between neighbouring items. */
  spacing: number;
  minRadius: number;
};
/** Works fan out east of the arrival point (see navigation.ts destinations.works). */
const WORKS_ARC: ArcLayout = {
  center: [21, 0],
  opening: Math.PI,
  span: (Math.PI * 280) / 180,
  spacing: 6,
  minRadius: 5,
};
/** Spread `count` points along an arc; the radius grows so neighbours keep `spacing`. */
export const arcPositions = (
  count: number,
  layout: ArcLayout
): [number, number][] => {
  if (count <= 0) return [];
  if (count === 1) return [layout.center];
  const step = layout.span / (count - 1);
  const radius = Math.max(
    layout.minRadius,
    layout.spacing / (2 * Math.sin(step / 2))
  );
  const start = layout.opening + Math.PI - layout.span / 2;
  return Array.from({ length: count }, (_, i) => {
    const angle = start + step * i;
    return [
      layout.center[0] + Math.cos(angle) * radius,
      layout.center[1] + Math.sin(angle) * radius,
    ];
  });
};
/** Playground pieces sit on a shallow bow in front of the arrival point. */
export const playgroundPositions = (count: number): [number, number][] => {
  const middle = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => [
    9.5 + (i - middle) * 7.5,
    22 - (i - middle) ** 2 * 0.8,
  ]);
};
export const seeded = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const floorHeight = (x: number, z: number) => {
  return (
    -0.5 +
    Math.sin(((x * Math.PI) / 64) * 3) * 0.35 +
    Math.sin(((z * 4 + x * 2) * Math.PI) / 64) * 0.28
  );
};
export const rockGeometry = (seed: number) => {
  const r = seeded(seed),
    n = 7,
    levels = 5,
    verts: number[] = [],
    idx: number[] = [];
  const radii = Array.from({ length: n }, () => 0.82 + r() * 0.32);
  for (let j = 0; j < levels; j++)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const taper = j === 4 ? 0.53 : j === 3 ? 0.78 : j === 0 ? 1.04 : 1;
      const rr = radii[i] * taper * (0.92 + r() * 0.16);
      verts.push(
        Math.cos(a) * rr + 0.11 * j,
        (j / (levels - 1)) * (1 + (j === 4 ? (r() - 0.5) * 0.17 : 0)),
        Math.sin(a) * rr - 0.055 * j
      );
    }
  for (let j = 0; j < levels - 1; j++)
    for (let i = 0; i < n; i++) {
      const a = j * n + i,
        b = j * n + ((i + 1) % n),
        c = a + n,
        d = b + n;
      idx.push(a, c, b, b, c, d);
    }
  for (let i = 1; i < n - 1; i++) {
    idx.push(0, i, i + 1);
    idx.push((levels - 1) * n, (levels - 1) * n + i + 1, (levels - 1) * n + i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};
const tube = (points: THREE.Vector3[], radius: number, sides = 5) => {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    Math.max(4, points.length * 3),
    radius,
    sides,
    false
  );
};
const coralGeometry = (seed: number) => {
  const r = seeded(seed),
    geos: THREE.BufferGeometry[] = [];
  const branch = (
    start: THREE.Vector3,
    dir: THREE.Vector3,
    len: number,
    rad: number,
    depth: number
  ) => {
    const end = start.clone().addScaledVector(dir, len);
    const mid = start
      .clone()
      .lerp(end, 0.5)
      .add(new THREE.Vector3((r() - 0.5) * 0.14, 0, (r() - 0.5) * 0.14));
    geos.push(tube([start, mid, end], rad));
    if (depth > 0)
      for (let i = 0; i < 2; i++) {
        const d = dir
          .clone()
          .add(new THREE.Vector3((r() - 0.5) * 1.8, 0.25, (r() - 0.5) * 1.8))
          .normalize();
        branch(end, d, len * (0.55 + r() * 0.15), rad * 0.62, depth - 1);
      }
  };
  branch(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.65, 0.075, 3);
  const g = mergeGeometries(geos);
  geos.forEach((x) => x.dispose());
  return g;
};
const kelpGeometry = (seed: number) => {
  const r = seeded(seed),
    geos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) {
    const h = 1.1 + r() * 2.1,
      a = r() * Math.PI * 2;
    const v: number[] = [],
      idx: number[] = [];
    for (let j = 0; j <= 12; j++) {
      const t = j / 12,
        width = Math.sin(Math.PI * t) * (0.13 + r() * 0.07);
      const x = Math.sin(t * 3 + a) * t * 0.4,
        z = Math.cos(t * 2 + a) * t * 0.3;
      for (const s of [-1, 1])
        v.push(x + s * width * Math.cos(a), h * t, z + s * width * Math.sin(a));
      if (j < 12) {
        const b = j * 2;
        idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    geos.push(g);
  }
  return mergeGeometries(geos);
};
export const createWorld = async (scene: THREE.Scene): Promise<World> => {
  const environment = new THREE.Group();
  scene.add(environment);
  const targets: Target[] = [],
    colliders: THREE.Object3D[] = [],
    animated: World["animated"] = [],
    lights: THREE.PointLight[] = [];
  const rock = makeRock(),
    sand = makeSand(),
    skin = makeSkin() as THREE.MeshPhysicalMaterial;
  const r = seeded(2709);
  const rockGeos = Array.from({ length: 8 }, (_, i) =>
    rockGeometry(102 + i * 93)
  );
  const stone = (
    x: number,
    z: number,
    w: number,
    h: number,
    d: number,
    rotation = r() * 6.28,
    y?: number
  ) => {
    const m = new THREE.Mesh(rockGeos[Math.floor(r() * 8)], rock);
    m.name = "reef-rock";
    m.position.set(x, y ?? floorHeight(x, z), z);
    m.scale.set(w, h, d);
    m.rotation.y = rotation;
    m.castShadow = true;
    m.receiveShadow = true;
    environment.add(m);
    if (h > 0.3) colliders.push(m);
    return m;
  };
  const terrain = new THREE.PlaneGeometry(360, 360, 144, 144);
  terrain.rotateX(-Math.PI / 2);
  const pos = terrain.attributes.position;
  for (let i = 0; i < pos.count; i++)
    pos.setY(i, floorHeight(pos.getX(i), pos.getZ(i)));
  terrain.computeVertexNormals();
  const floor = new THREE.Mesh(terrain, sand);
  floor.receiveShadow = true;
  environment.add(floor);
  const decoGeos = [
    coralGeometry(18),
    coralGeometry(55),
    coralGeometry(109),
    kelpGeometry(41),
    kelpGeometry(71),
  ];
  const decoMats = [
    new THREE.MeshStandardMaterial({ color: 0xd99483, roughness: 0.82 }),
    new THREE.MeshStandardMaterial({ color: 0xcdb882, roughness: 0.83 }),
    new THREE.MeshStandardMaterial({ color: 0x97b9a6, roughness: 0.72 }),
    new THREE.MeshStandardMaterial({
      color: 0x547d60,
      roughness: 0.8,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x78936d,
      roughness: 0.78,
      side: THREE.DoubleSide,
    }),
  ];
  const vegetation = (x: number, z: number, density: number) => {
    for (let k = 0; k < density; k++) {
      const i = Math.floor(r() * 5);
      const m = new THREE.Mesh(decoGeos[i], decoMats[i]);
      m.name = "reef-plant";
      m.position.set(
        x + (r() - 0.5) * 4,
        floorHeight(x, z),
        z + (r() - 0.5) * 4
      );
      const s = 0.4 + r() * 0.9;
      m.scale.setScalar(s);
      m.rotation.y = r() * 6.28;
      environment.add(m);
    }
  };
  const pedestal = (x: number, z: number, small = false) => {
    const h = small ? 0.75 : 1.35;
    stone(x, z, 1.25, h, 1.22, 0);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      stone(
        x + Math.cos(a) * 1.2,
        z + Math.sin(a) * 1.2,
        0.4,
        0.45 + r() * 0.6,
        0.45
      );
    }
    vegetation(x + 1.6, z + 0.8, 3);
    return floorHeight(x, z) + h;
  };
  const pillar = (x: number, z: number, index: number) => {
    const y = pedestal(x, z),
      group = new THREE.Group();
    group.position.set(x, y, z);
    environment.add(group);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd0c4a1,
      metalness: 0.45,
      roughness: 0.3,
      emissive: 0x735527,
      emissiveIntensity: 0.2,
    });
    const h = 5.6,
      w = 0.59;
    const crystal = new THREE.CylinderGeometry(w, w, h, 5, 1, true);
    const shader = makeLightColumn();
    const core = new THREE.Mesh(crystal, shader);
    core.position.y = h / 2 + 0.2;
    group.add(core);
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.22, h - 0.5, 5),
      new THREE.MeshStandardMaterial({
        color: 0xffedbe,
        emissive: 0xffe3a0,
        emissiveIntensity: 1.7,
        roughness: 0.38,
      })
    );
    inner.name = "column-core";
    inner.position.y = h / 2 + 0.2;
    group.add(inner);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(Math.sin(a) * w, 0.1, Math.cos(a) * w),
        new THREE.Vector3(Math.sin(a) * w, h, Math.cos(a) * w),
        new THREE.Vector3(0, h + 0.95, 0),
      ];
      group.add(new THREE.Mesh(tube(pts, 0.033, 5), frameMat));
    }
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(w, 0.96, 5),
      new THREE.MeshPhysicalMaterial({
        color: 0xffe8af,
        transparent: true,
        opacity: 0.38,
        roughness: 0.18,
        metalness: 0.15,
        side: THREE.DoubleSide,
      })
    );
    crown.position.y = h + 0.47;
    group.add(crown);
    const light = new THREE.PointLight(0xffd394, 28, 12, 2);
    light.position.set(x, y + 2.7, z);
    environment.add(light);
    lights.push(light);
    targets.push({
      id: works[index].id,
      kind: "works",
      position: new THREE.Vector3(x, y + 2, z),
      anchor: new THREE.Vector3(x, y + h + 1.5, z),
      object: group,
      label: works[index].title,
      landmark: index === 0,
      reaction: shader,
    });
    return group;
  };

  // One light column per work; the arc grows with the number of works.
  arcPositions(works.length, WORKS_ARC).forEach(([x, z], index) =>
    pillar(x, z, index)
  );
  // Consume the original seed sequence; perimeter rocks are discarded before batching.
  for (let i = 0; i < 65; i++) {
    const a = (i / 65) * Math.PI * 2;
    const rad = 33 + r() * 6;
    const x = Math.cos(a) * rad,
      z = Math.sin(a) * rad;
    const h = 5 + r() * 10;
    stone(x, z, 2 + r() * 3, h, 2 + r() * 3).userData.perimeter = true;
    if (i % 2 === 0) vegetation(x * 0.89, z * 0.89, 6);
  }
  for (let i = 0; i < 86; i++) {
    const a = r() * Math.PI * 2;
    const rad = 23 + r() * 10;
    const x = Math.cos(a) * rad,
      z = Math.sin(a) * rad;
    stone(
      x,
      z,
      0.45 + r() * 1.6,
      0.5 + r() * 3,
      0.6 + r() * 1.7
    ).userData.perimeter = true;
    if (i % 3 === 0) vegetation(x, z, 4);
  }
  // Landmark: true extruded font contours, broad beveled faces with real chipped vertices.
  const font = new FontLoader().parse(fontData);
  const textGeo = new TextGeometry("YEND.DEV", {
    font,
    size: 3.15,
    depth: 1.05,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelSegments: 2,
  });
  textGeo.computeBoundingBox();
  const width = textGeo.boundingBox!.max.x;
  textGeo.translate(-width / 2, 0, 0);
  const tp = textGeo.attributes.position;
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i),
      y = tp.getY(i),
      z = tp.getZ(i);
    const n =
      Math.sin(x * 16.7 + y * 27.3 + z * 9.1) * Math.sin(x * 11.2 - y * 13.9);
    tp.setXYZ(i, x + n * 0.023, y + n * 0.028, z + n * 0.04);
  }
  textGeo.computeVertexNormals();
  const textMat = rock.clone();
  textMat.color.setRGB(2.55, 2.24, 1.7);
  textMat.onBeforeCompile = rock.onBeforeCompile;
  textMat.customProgramCacheKey = () => "yend-landmark-rock";
  const title = new THREE.Mesh(textGeo, textMat);
  title.position.set(-1, 1.2, -12);
  title.castShadow = true;
  title.receiveShadow = true;
  environment.add(title);
  colliders.push(title);
  for (let i = 0; i < 15; i++) {
    const x = -14 + i * 1.8;
    stone(x, -12.5, 1.4, 0.9 + r() * 0.5, 1.7, 0);
    if (i % 3 === 0) vegetation(x, -14.5, 5);
  }
  // Profile alcove: worn stepped circular portal, concentric carved rings and lanterns.
  const portal = new THREE.Group();
  portal.position.set(-19, 0, -8);
  portal.rotation.y = 0.32;
  environment.add(portal);
  const portalMat = new THREE.MeshStandardMaterial({
    color: 0xaaa98c,
    roughness: 0.88,
    metalness: 0.08,
  });
  const disk = new THREE.Mesh(
    new THREE.CylinderGeometry(2.45, 2.5, 0.6, 36),
    portalMat
  );
  disk.rotation.x = Math.PI / 2;
  disk.position.set(0, 3.5, 0);
  portal.add(disk);
  colliders.push(disk);
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.45 + i * 0.53, 0.045 + i * 0.018, 6, 48),
      rock
    );
    ring.position.set(0, 3.5, 0.33);
    portal.add(ring);
  }
  for (let i = 0; i < 11; i++) {
    const a = (i / 10) * Math.PI;
    const m = new THREE.Mesh(rockGeos[i % 8], rock);
    m.position.set(Math.cos(a) * 3.03, 3.5 + Math.sin(a) * 3.03, 0);
    m.scale.set(0.68, 0.85, 0.8);
    m.rotation.z = a - Math.PI / 2;
    portal.add(m);
    colliders.push(m);
  }
  for (const side of [-1, 1]) {
    const p = new THREE.Mesh(rockGeos[2], rock);
    p.position.set(side * 3.02, 0, 0);
    p.scale.set(0.72, 3.7, 0.85);
    portal.add(p);
    colliders.push(p);
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.21, 0.7, 6),
      new THREE.MeshStandardMaterial({
        color: 0xffe9ae,
        emissive: 0xffcb72,
        emissiveIntensity: 2,
      })
    );
    lamp.position.set(side * 2.75, 3.5, 0.85);
    portal.add(lamp);
    const light = new THREE.PointLight(0xffd08a, 9, 8);
    light.position.copy(lamp.position);
    portal.add(light);
  }
  for (let i = 0; i < 4; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(5 + i * 0.4, 0.3, 1),
      portalMat
    );
    step.position.set(0, 0.8 - i * 0.27, 1.1 + i * 0.85);
    portal.add(step);
    step.receiveShadow = true;
  }
  for (let i = 0; i < 12; i++)
    stone(
      -24 + r() * 10,
      -12 - r() * 4,
      1 + r() * 1.8,
      2 + r() * 5,
      1 + r() * 2
    );
  vegetation(-23, -5, 10);
  vegetation(-15, -9, 10);
  targets.push({
    id: "profile",
    kind: "profile",
    position: new THREE.Vector3(-19, 3, -6),
    anchor: new THREE.Vector3(-19, 7.9, -8),
    object: portal,
    label: "Profile",
  });
  // Playground, each sculpture is one project; the three designs repeat beyond that.
  const playgroundSpots = playgroundPositions(playgrounds.length);
  for (let i = 0; i < playgrounds.length; i++) {
    const [x, z] = playgroundSpots[i],
      y = pedestal(x, z, true);
    const design = i % 3;
    const group = new THREE.Group();
    group.position.set(x, y + 1.7, z);
    environment.add(group);
    const gold = new THREE.MeshStandardMaterial({
      color: 0xd9cc9d,
      roughness: 0.25,
      metalness: 0.6,
      emissive: 0x7a5722,
      emissiveIntensity: 0.25,
    });
    if (design === 0) {
      for (let k = 0; k < 3; k++) {
        const g = new THREE.BoxGeometry(0.95, 0.95, 0.95, 2, 2, 2);
        const cube = new THREE.Mesh(g, k === 1 ? gold : portalMat);
        cube.position.set((k - 1) * 0.9, (k % 2) * 0.9, Math.sin(k * 2) * 0.45);
        cube.rotation.set(0.17 + k * 0.14, 0.25 + k * 0.6, 0.15);
        group.add(cube);
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(g),
          new THREE.LineBasicMaterial({
            color: 0xf4dba2,
            transparent: true,
            opacity: 0.6,
          })
        );
        cube.add(edge);
      }
    }
    if (design === 1) {
      const pts = [];
      for (let k = 0; k <= 120; k++) {
        const a = (k / 120) * Math.PI * 5;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * 0.9,
            (k / 120) * 3.6 - 1.2,
            Math.sin(a) * 0.9
          )
        );
      }
      group.add(new THREE.Mesh(tube(pts, 0.12, 8), gold));
      const thin = pts.map((p) => p.clone().add(new THREE.Vector3(0, 0.18, 0)));
      group.add(
        new THREE.Mesh(
          tube(thin, 0.027, 5),
          new THREE.MeshBasicMaterial({ color: 0xffe8b2 })
        )
      );
    }
    if (design === 2) {
      for (let k = 0; k < 4; k++) {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.42 + k * 0.12, 24, 16),
          new THREE.MeshPhysicalMaterial({
            color: [0xc5eeee, 0x9ed9e0, 0xe6becd, 0xbbe2d5][k],
            metalness: 0.2,
            roughness: 0.09,
            transparent: true,
            opacity: 0.44,
            iridescence: 1,
            iridescenceIOR: 1.4,
            clearcoat: 1,
          })
        );
        bubble.position.set(
          Math.sin(k * 2) * 1.05,
          Math.cos(k * 2) * 0.75,
          Math.sin(k * 3) * 0.5
        );
        group.add(bubble);
      }
    }
    animated.push({
      object: group,
      baseY: group.position.y,
      seed: i,
      type: "play",
    });
    targets.push({
      id: playgrounds[i].id,
      kind: "playground",
      position: new THREE.Vector3(x, y + 2, z),
      anchor: new THREE.Vector3(x, y + 5.1, z),
      object: group,
      label: playgrounds[i].title,
      landmark: i === Math.floor(playgrounds.length / 2),
    });
  }
  // A broken arch at the back and small scattered masonry provide depth from every angle.
  for (let k = 0; k < 9; k++) {
    const a = (k / 8) * Math.PI;
    stone(8 + Math.cos(a) * 4, -25, 0.8, 1.6, 1, 0, 3.8 + Math.sin(a) * 4);
  }
  stone(4, -25, 0.9, 4.2, 1);
  stone(12, -25, 0.9, 4.2, 1);
  for (let i = 0; i < 26; i++) {
    const x = (r() - 0.5) * 49,
      z = (r() - 0.5) * 48;
    if (Math.abs(x) < 10 && z < 10 && z > -8) continue;
    stone(x, z, 0.2 + r() * 0.5, 0.2 + r() * 0.5, 0.2 + r() * 0.6);
  }

  // Suspended dust; no opaque background image.
  const dustGeo = new THREE.BufferGeometry(),
    dust = [];
  for (let i = 0; i < 520; i++)
    dust.push((r() - 0.5) * 90, r() * 23, (r() - 0.5) * 90);
  dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `uniform float uTime;varying float vFade;void main(){vec3 p=position;p.y+=sin(uTime*.2+position.x)*.2;p.x+=sin(uTime*.14+position.z)*.14;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(30./-mv.z,1.,3.);vFade=clamp(1.-(-mv.z)/70.,0.,1.);}`,
    fragmentShader: `varying float vFade;void main(){float a=1.-smoothstep(.1,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(.73,.89,.88,a*.32*vFade);}`,
  });
  const particles = new THREE.Points(dustGeo, dustMat);
  particles.name = "dust";
  environment.add(particles);
  // No ceiling or rectangular light sheets: the upper water fades into haze.
  const porpoise = new THREE.Group();
  porpoise.name = "sunameri";
  scene.add(porpoise);
  const gltf = await new GLTFLoader().loadAsync(
    "/models/sunameri.glb?v=smooth-fins-1"
  );
  gltf.scene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.material = skin;
      o.customDepthMaterial = makeSkinDepth();
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  porpoise.add(gltf.scene);
  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: 0x041832,
    roughness: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  for (const detail of avatarDetails.eyes) {
    const normal = new THREE.Vector3(...detail.normal),
      eye = new THREE.Mesh(new THREE.SphereGeometry(0.094, 24, 16), eyeMat);
    eye.position.fromArray(detail.position);
    eye.scale.set(1, 1, 0.48);
    eye.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    porpoise.add(eye);
    const gleam = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xf2fcff })
    );
    gleam.position
      .copy(eye.position)
      .addScaledVector(normal, 0.043)
      .add(new THREE.Vector3(0, 0.027, 0.014));
    porpoise.add(gleam);
  }
  const mouthPoints = avatarDetails.mouth.map(
    (point) => new THREE.Vector3(...point)
  );
  porpoise.add(
    new THREE.Mesh(
      tube(mouthPoints, 0.016, 6),
      new THREE.MeshStandardMaterial({ color: 0x102b48, roughness: 0.52 })
    )
  );
  // Remove the enclosing block-like rocks from both rendering and collision.
  for (const object of [...environment.children])
    if (object.userData.perimeter) {
      environment.remove(object);
      const index = colliders.indexOf(object);
      if (index !== -1) colliders.splice(index, 1);
    }
  // Batch repeated static geometry; keep the original exact meshes as collision proxies.
  const batches = new Map<string, THREE.Mesh[]>();
  for (const o of [...environment.children])
    if (
      o instanceof THREE.Mesh &&
      (o.name === "reef-rock" || o.name === "reef-plant")
    ) {
      const key = o.geometry.uuid + ":" + (o.material as THREE.Material).uuid;
      const list = batches.get(key) || [];
      list.push(o);
      batches.set(key, list);
    }
  for (const list of batches.values()) {
    const batch = new THREE.InstancedMesh(
      list[0].geometry,
      list[0].material,
      list.length
    );
    batch.name = list[0].name + "-instances";
    batch.castShadow = list[0].castShadow;
    batch.receiveShadow = true;
    list.forEach((m, i) => {
      m.updateMatrixWorld(true);
      batch.setMatrixAt(i, m.matrix);
      environment.remove(m);
    });
    batch.instanceMatrix.needsUpdate = true;
    batch.computeBoundingSphere();
    environment.add(batch);
  }
  scene.traverse((object) => {
    if (
      object instanceof THREE.Mesh ||
      object instanceof THREE.Points ||
      object instanceof THREE.LineSegments
    ) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      let avatar = false;
      for (
        let parent: THREE.Object3D | null = object;
        parent;
        parent = parent.parent
      ) {
        if (parent === porpoise) avatar = true;
      }
      materials.forEach((material) => applyWaterFog(material, !avatar));
    }
  });
  return {
    environment,
    targets,
    colliders,
    animated,
    skin,
    porpoise,
    rock,
    lights,
  };
};
