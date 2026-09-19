import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { fogUniforms } from "./fog";
import { createWorld } from "./geometry";
import { oceanUniforms } from "./shaders";

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  meshes: number;
  triangles: number;
};

export const startObjectCatalog = async (
  host: HTMLElement,
  signal: AbortSignal
) => {
  const source = new THREE.Scene();
  const stage = new THREE.Scene();
  stage.background = new THREE.Color(0x102e38);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 20;
  const light = new THREE.DirectionalLight(0xffefd4, 3.4);
  light.position.set(4, 7, 6);
  stage.add(light, new THREE.HemisphereLight(0xc3edf1, 0x386474, 2.5));
  const rim = new THREE.DirectionalLight(0x86d7f4, 2);
  rim.position.set(-4, 2, -4);
  stage.add(rim);
  const objects = new Map<string, THREE.Group>();
  let active: THREE.Group | undefined;
  let animated = false;
  let disposed = false;
  let raf = 0;
  let time = 0;
  let previous = 0;
  const resize = new ResizeObserver(() => {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    resize.disconnect();
    controls.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    const collect = (object: THREE.Object3D) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.LineSegments ||
        object instanceof THREE.Points
      ) {
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          materials.add(material);
          for (const value of Object.values(material))
            if (value instanceof THREE.Texture) textures.add(value);
        }
        if (object instanceof THREE.Mesh && object.customDepthMaterial)
          materials.add(object.customDepthMaterial);
      }
    };
    source.traverse(collect);
    objects.forEach((object) => object.traverse(collect));
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
  const reset = () => {
    controls.target.set(0, 0, 0);
    camera.position.set(6, 3.5, 7);
    controls.update();
  };
  const select = (id: string) => {
    if (active) stage.remove(active);
    active = objects.get(id);
    if (active) stage.add(active);
    reset();
  };
  try {
    const world = await createWorld(source);
    signal.throwIfAborted();
    fogUniforms.uWaterDensity.value = 0;
    fogUniforms.uLoopVeil.value = 0;
    oceanUniforms.uTime.value = 0;
    oceanUniforms.uSwim.value = 0;
    oceanUniforms.uGoldPosition.value.set(2, 4, 2);
    // Every work uses the same light column geometry and materials; list it once.
    const lightColumn = world.targets.find((target) => target.kind === "works");
    const entries: {
      id: string;
      name: string;
      category: string;
      object: THREE.Object3D;
    }[] = [
      {
        id: "sunameri",
        name: "スナメリ",
        category: "生き物",
        object: world.porpoise,
      },
      ...(lightColumn
        ? [
            {
              id: "light-column",
              name: "光柱",
              category: "光柱",
              object: lightColumn.object,
            },
          ]
        : []),
      ...world.targets
        .filter((target) => target.kind !== "works")
        .map((target) => ({
          id: `${target.kind}-${target.id}`,
          name: target.label,
          category: target.kind === "playground" ? "彫刻" : "ランドマーク",
          object: target.object,
        })),
    ];
    let rocks = 0,
      plants = 0;
    world.environment.traverse((object) => {
      if (!(object instanceof THREE.InstancedMesh)) return;
      const isRock = object.name === "reef-rock-instances";
      const isPlant = object.name === "reef-plant-instances";
      if (!isRock && !isPlant) return;
      const index = isRock ? ++rocks : ++plants;
      entries.push({
        id: `${isRock ? "rock" : "plant"}-${index}`,
        name: `${isRock ? "岩" : "サンゴ・海藻"} ${String(index).padStart(2, "0")}`,
        category: isRock ? "岩" : "植物",
        object: new THREE.Mesh(object.geometry, object.material),
      });
    });
    const items: CatalogItem[] = [];
    renderer.setPixelRatio(1);
    renderer.setSize(360, 240);
    camera.aspect = 1.5;
    camera.updateProjectionMatrix();
    for (const entry of entries) {
      signal.throwIfAborted();
      const object = entry.object.clone(true);
      object.position.set(0, 0, 0);
      object.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(object);
      object.position.sub(bounds.getCenter(new THREE.Vector3()));
      const size = bounds.getSize(new THREE.Vector3());
      const group = new THREE.Group();
      group.add(object);
      group.scale.setScalar(4 / Math.max(size.x, size.y, size.z, 0.01));
      objects.set(entry.id, group);
      const motion = world.animated.find(
        (item) => item.object === entry.object
      );
      if (motion) group.userData.motionSeed = motion.seed;
      select(entry.id);
      let meshes = 0,
        triangles = 0;
      object.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          meshes++;
          triangles +=
            (node.geometry.index?.count ??
              node.geometry.attributes.position.count) / 3;
        }
      });
      renderer.render(stage, camera);
      items.push({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        thumbnail: renderer.domElement.toDataURL("image/png"),
        meshes,
        triangles: Math.round(triangles),
      });
      // Let the loading UI paint between thumbnails; use one WebGL context for the catalog.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );
    }
    signal.throwIfAborted();
    select(items[0].id);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "3Dプレビュー。ドラッグで回転、ホイールまたはピンチで拡大縮小"
    );
    resize.observe(host);
    const frame = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (document.hidden) return;
      if (animated) time += dt;
      oceanUniforms.uTime.value = time;
      oceanUniforms.uSwim.value = animated ? 0.7 : 0;
      if (active && typeof active.userData.motionSeed === "number") {
        const seed = active.userData.motionSeed;
        active.position.y = animated
          ? Math.sin(time * 0.6 + seed) * 0.08 * active.scale.y
          : 0;
        active.rotation.y = animated ? Math.sin(time * 0.18 + seed) * 0.18 : 0;
      }
      controls.update();
      renderer.render(stage, camera);
    };
    raf = requestAnimationFrame(frame);
    return {
      items,
      select,
      reset,
      dispose,
      setAnimated: (value: boolean) => {
        animated = value;
      },
      setWireframe: (value: boolean) => {
        objects.forEach((object) =>
          object.traverse((node) => {
            if (!(node instanceof THREE.Mesh)) return;
            for (const material of Array.isArray(node.material)
              ? node.material
              : [node.material]) {
              if ("wireframe" in material) material.wireframe = value;
            }
          })
        );
      },
      setView: (view: "front" | "side" | "top") => {
        camera.position.set(
          ...((view === "front"
            ? [0, 0, 9]
            : view === "side"
              ? [9, 0, 0]
              : [0, 9, 0.001]) as [number, number, number])
        );
        controls.target.set(0, 0, 0);
        controls.update();
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
};
export type ObjectCatalog = Awaited<ReturnType<typeof startObjectCatalog>>;
