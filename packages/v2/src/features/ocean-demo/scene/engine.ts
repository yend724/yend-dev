import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { areas } from "@/features/ocean-demo/data";

import { fogColor, fogUniforms } from "./fog";
import { createWorld, floorHeight, Target } from "./geometry";
import { oceanWrapOffset, oceanEdgeVeil } from "./loop";
import { destinations, navigationBounds, planRoute } from "./navigation";
import { defaultTuning, oceanUniforms, waterPost, Tuning } from "./shaders";
/** Manual swimming, world units per second at 1×; the UI multiplier goes up to 2×. */
const SWIM_SPEED = 7.5;
/** Auto-travel between areas is a little quicker than manual swimming. */
const TRAVEL_SPEED = 9;
export type SceneStats = {
  fps: number;
  draws: number;
  triangles: number;
  dpr: number;
  width: number;
  height: number;
  position: number[];
  heading: number;
  area: string;
  near: string | null;
  quality: string;
};
export type EngineOptions = {
  onReady: () => void;
  onError: (message: string) => void;
  onSelect: (id: string) => void;
  onStats: (stats: SceneStats) => void;
  onLabels: (
    labels: {
      id: string;
      x: number;
      y: number;
      visible: boolean;
      near: boolean;
      label: string;
      kind: string;
    }[]
  ) => void;
};
export const startOcean = async (host: HTMLElement, options: EngineOptions) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(fogColor);
  scene.fog = new THREE.FogExp2(fogColor, defaultTuning.fog);
  fogUniforms.uWaterDensity.value = defaultTuning.fog;
  const camera = new THREE.PerspectiveCamera(
    44,
    host.clientWidth / host.clientHeight,
    0.15,
    150
  );
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(host.clientWidth, host.clientHeight);
  let dpr = Math.min(devicePixelRatio, host.clientWidth < 700 ? 1.3 : 1.65);
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.19;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.info.autoReset = false;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "スナメリで探索する3Dの海。WASDで移動、ドラッグで視点を操作。"
  );
  const hemi = new THREE.HemisphereLight(0xc3edf1, 0x386474, 2.25);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d1, 3.4);
  sun.position.set(-15, 30, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -42;
  sun.shadow.camera.right = 42;
  sun.shadow.camera.top = 42;
  sun.shadow.camera.bottom = -42;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 95;
  sun.shadow.normalBias = 0.07;
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 3;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x86d7f4, 1.1);
  rim.position.set(8, 15, -20);
  scene.add(rim);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(host.clientWidth, host.clientHeight),
    0.28,
    0.65,
    1.18
  );
  composer.addPass(bloom);
  const post = new ShaderPass(waterPost);
  composer.addPass(post);
  composer.addPass(new OutputPass());
  renderer.debug.onShaderError = (gl, program, vs, fs) => {
    options.onError("描画シェーダーを読み込めませんでした。");
    console.error(
      "YEND GLSL",
      gl.getProgramInfoLog(program),
      gl.getShaderInfoLog(vs),
      gl.getShaderInfoLog(fs)
    );
  };
  const world = await createWorld(scene);
  const player = world.porpoise;
  player.position.set(0, 4.2, 9);
  player.rotation.y = -1.15;
  let paused = false,
    disposed = false,
    last = performance.now(),
    time = 0,
    raf = 0,
    frames = 0,
    measureStart = last,
    lastStats = 0,
    avgFPS = 60,
    slowWindows = 0,
    quality = "Auto",
    swimming = true,
    underwater = true;
  let yaw = 0.12,
    targetYaw = yaw,
    pitch = 0.44,
    targetPitch = pitch,
    distance = 26,
    targetDistance = distance,
    view = "follow";
  let speedMultiplier = 1;
  let nearest: Target | undefined;
  let navArea: string | null = null;
  let route: THREE.Vector3[] = [];
  let arrivalLook: THREE.Vector3 | null = null;
  world.environment.updateMatrixWorld(true);
  const travelBounds = navigationBounds(world.colliders);
  const cancelTravel = () => {
    route = [];
    arrivalLook = null;
    navArea = null;
  };
  const keys = new Set<string>();
  const pad = { x: 0, y: 0, vertical: 0 };
  const velocity = new THREE.Vector3(),
    lookAt = new THREE.Vector3(),
    desiredLook = new THREE.Vector3(),
    desiredCamera = new THREE.Vector3(),
    camDir = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(),
    collisionCaster = new THREE.Raycaster();
  let pointer: {
    id: number;
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    drag: boolean;
  } | null = null;
  lookAt.copy(player.position).add(new THREE.Vector3(0, 0, -5));
  camera.position.copy(player.position).add(new THREE.Vector3(4, 12, 24));
  camera.lookAt(lookAt);
  const stopInput = () => {
    keys.clear();
    pad.x = pad.y = pad.vertical = 0;
    velocity.set(0, 0, 0);
    pointer = null;
  };
  const keydown = (e: KeyboardEvent) => {
    if (
      paused ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName) ||
      (e.target as HTMLElement)?.closest('[role="dialog"]')
    )
      return;
    if (e.code === "Escape") {
      cancelTravel();
      stopInput();
      return;
    }
    if (e.code === "KeyE" || e.code === "Enter") {
      if (nearest && (e.code === "KeyE" || e.target === document.body)) {
        e.preventDefault();
        options.onSelect(nearest.id);
      }
      return;
    }
    if (
      (e.target as HTMLElement)?.closest(
        "button,a,[role=slider],[role=tab],[role=switch]"
      ) &&
      !["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyR"].includes(e.code)
    )
      return;
    if (
      [
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "ShiftLeft",
        "ShiftRight",
        "KeyQ",
        "KeyR",
      ].includes(e.code)
    ) {
      e.preventDefault();
      keys.add(e.code);
      cancelTravel();
    }
  };
  const keyup = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };
  const blur = () => {
    stopInput();
    cancelTravel();
  };
  const visibility = () => {
    if (document.hidden) stopInput();
    last = performance.now();
  };
  const down = (e: PointerEvent) => {
    if (paused) return;
    pointer = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      drag: false,
    };
    renderer.domElement.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!pointer || pointer.id !== e.pointerId || paused) return;
    const dx = e.clientX - pointer.lastX,
      dy = e.clientY - pointer.lastY;
    if (Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) > 6)
      pointer.drag = true;
    if (pointer.drag) {
      targetYaw -= dx * 0.005;
      targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.004, 0.1, 1.19);
    }
    pointer.lastX = e.clientX;
    pointer.lastY = e.clientY;
  };
  const up = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const click = !pointer.drag;
    pointer = null;
    if (!click || paused) return;
    const rect = host.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1
      ),
      camera
    );
    const available = world.targets.filter(
      (t) => t.position.distanceTo(player.position) < 8
    );
    const hits = raycaster.intersectObjects(
      available.map((t) => t.object),
      true
    );
    if (hits.length) {
      let item: THREE.Object3D | null = hits[0].object;
      while (item) {
        const t = available.find((t) => t.object === item);
        if (t) {
          options.onSelect(t.id);
          break;
        }
        item = item.parent;
      }
    }
  };
  const wheel = (e: WheelEvent) => {
    if (paused) return;
    e.preventDefault();
    targetDistance = THREE.MathUtils.clamp(
      targetDistance + e.deltaY * 0.018,
      12,
      45
    );
  };
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", blur);
  canvas.addEventListener("wheel", wheel, { passive: false });
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", blur);
  document.addEventListener("visibilitychange", visibility);
  const resize = new ResizeObserver(() => {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  });
  resize.observe(host);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(animate);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    time += dt;
    frames++;
    if (!paused) {
      const x =
        (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) -
        (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0) +
        pad.x;
      const z =
        (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) -
        (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) -
        pad.y;
      const y =
        (keys.has("Space") || keys.has("KeyR") ? 1 : 0) -
        (keys.has("ShiftLeft") || keys.has("ShiftRight") || keys.has("KeyQ")
          ? 1
          : 0) +
        pad.vertical;
      const input = new THREE.Vector3(x, 0, -z);
      if (input.length() > 1) input.normalize();
      input.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      input.y = y * 0.75;
      let moving = input.lengthSq() > 0.001;
      if (input.length() > 1) input.normalize();
      input.multiplyScalar(SWIM_SPEED * speedMultiplier);
      if (route.length) {
        while (route.length > 1 && player.position.distanceTo(route[0]) < 0.12)
          route.shift();
        const remaining = route[0].clone().sub(player.position),
          length = remaining.length();
        if (route.length === 1 && length < 0.025) {
          player.position.copy(route[0]);
          route = [];
          velocity.set(0, 0, 0);
          input.set(0, 0, 0);
          moving = false;
        } else {
          input
            .copy(remaining)
            .normalize()
            .multiplyScalar(
              Math.min(TRAVEL_SPEED * speedMultiplier, length * 2.6)
            );
          moving = true;
        }
      }
      velocity.lerp(input, 1 - Math.exp(-dt * 4));
      const next = player.position.clone().addScaledVector(velocity, dt);
      next.y = THREE.MathUtils.clamp(
        next.y,
        floorHeight(next.x, next.z) + 1.25,
        19
      );
      const delta = next.clone().sub(player.position);
      if (delta.length() > 0.001) {
        collisionCaster.set(player.position, delta.clone().normalize());
        collisionCaster.far = delta.length() + 0.9;
        const hit = collisionCaster.intersectObjects(
          underwater ? world.colliders : [],
          false
        );
        if (hit.length) {
          next.copy(player.position);
          velocity.multiplyScalar(0.1);
          if (route.length) {
            route = planRoute(
              player.position,
              route[route.length - 1],
              travelBounds
            );
          }
        }
      }
      {
        const offset = oceanWrapOffset(next);
        if (offset.lengthSq()) {
          next.add(offset);
          camera.position.add(offset);
          lookAt.add(offset);
          desiredLook.add(offset);
          desiredCamera.add(offset);
        }
      }
      player.position.copy(next);
      if (moving || arrivalLook) {
        const facing = moving
          ? input
          : arrivalLook!.clone().sub(player.position);
        const heading = Math.atan2(facing.x, facing.z);
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            -Math.atan2(
              facing.y,
              Math.max(0.1, Math.hypot(facing.x, facing.z))
            ) * 0.5,
            heading,
            0,
            "YXZ"
          )
        );
        player.quaternion.slerp(q, 1 - Math.exp(-dt * 3));
      }
      oceanUniforms.uSwim.value = swimming
        ? reduced
          ? 0.2
          : 0.32 + Math.min(1, velocity.length() / 4) * 0.72
        : 0;
    } else oceanUniforms.uSwim.value = swimming ? 0.2 : 0;
    fogUniforms.uLoopVeil.value = oceanEdgeVeil(player.position);
    oceanUniforms.uTime.value = time;
    post.uniforms.uTime.value = time;
    const dust = world.environment.getObjectByName("dust") as THREE.Points;
    if (dust)
      (dust.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    nearest = world.targets
      .filter((t) => t.position.distanceTo(player.position) < 8)
      .sort(
        (a, b) =>
          a.position.distanceTo(player.position) -
          b.position.distanceTo(player.position)
      )[0];
    for (const t of world.targets) {
      if (t.reaction)
        t.reaction.uniforms.uNear.value = THREE.MathUtils.lerp(
          t.reaction.uniforms.uNear.value,
          t === nearest ? 1 : 0,
          dt * 3
        );
    }
    for (const a of world.animated) {
      const t = world.targets.find((t) => t.object === a.object),
        near = t === nearest;
      a.object.position.y =
        a.baseY +
        Math.sin(time * 0.6 + a.seed) * (reduced ? 0.02 : near ? 0.19 : 0.08);
      a.object.rotation.y =
        Math.sin(time * 0.18 + a.seed) * 0.18 +
        (near ? Math.sin(time * 0.5) * 0.06 : 0);
    }
    const nearGold = world.targets
      .filter((t) => t.kind === "works")
      .sort(
        (a, b) =>
          a.position.distanceToSquared(player.position) -
          b.position.distanceToSquared(player.position)
      )[0];
    if (nearGold) oceanUniforms.uGoldPosition.value.copy(nearGold.position);
    yaw = THREE.MathUtils.lerp(yaw, targetYaw, 1 - Math.exp(-dt * 7));
    pitch = THREE.MathUtils.lerp(pitch, targetPitch, 1 - Math.exp(-dt * 7));
    distance = THREE.MathUtils.lerp(
      distance,
      nearest && view === "follow"
        ? Math.min(20, targetDistance)
        : targetDistance,
      1 - Math.exp(-dt * 3)
    );
    desiredLook.copy(player.position);
    desiredLook.add(
      new THREE.Vector3(-Math.sin(yaw) * 3, 0, -Math.cos(yaw) * 3)
    );
    if (
      view === "overview" &&
      Math.max(Math.abs(player.position.x), Math.abs(player.position.z)) < 30
    )
      desiredLook.set(0, 1, 0);
    if (view === "follow") {
      const aim = desiredLook.clone().sub(player.position);
      collisionCaster.set(player.position, aim.clone().normalize());
      collisionCaster.far = aim.length();
      const aimHits = collisionCaster.intersectObjects(
        underwater ? world.colliders : [],
        false
      );
      if (aimHits.length)
        desiredLook
          .copy(player.position)
          .addScaledVector(
            aim.normalize(),
            Math.max(0, aimHits[0].distance - 0.7)
          );
    }
    if (!paused) {
      lookAt.lerp(desiredLook, 1 - Math.exp(-dt * 3));
      camDir.set(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        Math.cos(yaw) * Math.cos(pitch)
      );
      desiredCamera.copy(lookAt).addScaledVector(camDir, distance);
      collisionCaster.set(lookAt, camDir);
      collisionCaster.far = distance;
      const hits = collisionCaster.intersectObjects(
        underwater ? world.colliders : [],
        false
      );
      if (hits.length)
        desiredCamera
          .copy(lookAt)
          .addScaledVector(camDir, Math.max(2, hits[0].distance - 1.0));
      desiredCamera.y = THREE.MathUtils.clamp(
        desiredCamera.y,
        floorHeight(desiredCamera.x, desiredCamera.z) + 1.1,
        23.2
      );
      camera.position.lerp(desiredCamera, 1 - Math.exp(-dt * 5));
      const actualDir = camera.position.clone().sub(lookAt);
      const actualDistance = actualDir.length();
      actualDir.normalize();
      collisionCaster.set(lookAt, actualDir);
      collisionCaster.far = actualDistance + 0.65;
      const actualHits = collisionCaster.intersectObjects(
        underwater ? world.colliders : [],
        false
      );
      if (actualHits.length && actualHits[0].distance < actualDistance + 0.65)
        camera.position
          .copy(lookAt)
          .addScaledVector(
            actualDir,
            Math.max(1.5, actualHits[0].distance - 0.75)
          );
      camera.lookAt(lookAt);
    }
    const fovTarget = view === "overview" ? 58 : 44;
    if (Math.abs(camera.fov - fovTarget) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        fovTarget,
        1 - Math.exp(-dt * 3)
      );
      camera.updateProjectionMatrix();
    }
    renderer.info.reset();
    composer.render();
    if (now - measureStart > 2000) {
      avgFPS = Math.round((frames * 1000) / (now - measureStart));
      frames = 0;
      measureStart = now;
      if (avgFPS < 38) slowWindows++;
      else slowWindows = 0;
      if (slowWindows >= 2 && dpr > 0.85) {
        dpr = Math.max(0.8, dpr * 0.8);
        renderer.setPixelRatio(dpr);
        composer.setPixelRatio(dpr);
        bloom.enabled = dpr > 0.9;
        quality = dpr > 0.9 ? "Balanced" : "Light";
        if (dpr <= 0.9) renderer.shadowMap.enabled = false;
        slowWindows = 0;
      }
    }
    if (now - lastStats > 120) {
      lastStats = now;
      const area =
        navArea ||
        areas.reduce((a, b) =>
          new THREE.Vector3(...a.position).distanceToSquared(player.position) <
          new THREE.Vector3(...b.position).distanceToSquared(player.position)
            ? a
            : b
        ).id;
      options.onStats({
        fps: avgFPS,
        draws: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        dpr,
        width: host.clientWidth,
        height: host.clientHeight,
        position: player.position.toArray(),
        heading: yaw,
        area,
        near: nearest?.id ?? null,
        quality,
      });
    }
    // Project labels every rendered frame so they stay attached to the scene.
    options.onLabels(
      (underwater ? world.targets : []).map((t) => {
        const p = t.anchor.clone().project(camera);
        const dist = t.position.distanceTo(player.position);
        return {
          id: t.id,
          x: (p.x * 0.5 + 0.5) * host.clientWidth,
          y: (-0.5 * p.y + 0.5) * host.clientHeight,
          visible:
            (dist < 8 || camera.position.distanceTo(t.anchor) < 32) &&
            p.z < 1 &&
            p.z > -1 &&
            Math.abs(p.x) < 0.92 &&
            Math.abs(p.y) < 0.75 &&
            (dist < 8 || t.kind === "profile" || t.landmark === true),
          near: dist < 8,
          label: t.label,
          kind: t.kind,
        };
      })
    );
  };
  renderer.compile(scene, camera);
  options.onReady();
  raf = requestAnimationFrame(animate);
  return {
    setSpeed(multiplier: number) {
      if (Number.isFinite(multiplier))
        speedMultiplier = THREE.MathUtils.clamp(multiplier, 1, 2);
    },
    setPaused(value: boolean) {
      paused = value;
      stopInput();
      if (value) cancelTravel();
    },
    setPad(x: number, y: number) {
      if (!paused) {
        pad.x = x;
        pad.y = y;
        if (Math.hypot(x, y) > 0.05) cancelTravel();
      }
    },
    setVertical(v: number) {
      if (!paused) {
        pad.vertical = v;
        if (v) cancelTravel();
      }
    },
    selectNear() {
      if (nearest && !paused) options.onSelect(nearest.id);
    },
    travelToArea(id: string) {
      const destination = destinations[id];
      if (!destination || paused) return;
      stopInput();
      view = "follow";
      navArea = id;
      const end = new THREE.Vector3(...destination.position);
      route = planRoute(player.position, end, travelBounds);
      arrivalLook = new THREE.Vector3(...destination.look);
      const facing = arrivalLook.clone().sub(end);
      const desired = Math.atan2(-facing.x, -facing.z);
      targetYaw =
        yaw + Math.atan2(Math.sin(desired - yaw), Math.cos(desired - yaw));
      targetPitch = 0.43;
      targetDistance = id === "home" ? 26 : 19;
    },
    setView(v: string) {
      view = v;
      if (v === "overview") {
        targetDistance = 48;
        targetPitch = 0.72;
        targetYaw = 0.13;
      } else if (v === "follow") {
        targetDistance = 26;
        targetPitch = 0.44;
      }
    },
    tune(t: Tuning) {
      swimming = t.swimming;
      underwater = t.underwater;
      oceanUniforms.uCaustics.value = underwater ? t.caustics : 0;
      oceanUniforms.uReflection.value = t.reflection;
      oceanUniforms.uTransmission.value = t.transmission;
      oceanUniforms.uEmission.value = t.emission;
      world.environment.traverse((o) => {
        if (o instanceof THREE.Mesh && o.name === "column-core")
          (o.material as THREE.MeshStandardMaterial).emissiveIntensity =
            1.7 * t.emission;
      });
      world.lights.forEach((l) => (l.intensity = 28 * t.emission));
      world.skin.roughness = t.roughness;
      world.skin.clearcoat = t.reflection;
      world.skin.clearcoatRoughness = Math.max(0.1, t.roughness * 0.8);
      bloom.strength = t.bloom;
      bloom.enabled = t.bloom > 0;
      fogUniforms.uWaterDensity.value = underwater ? t.fog : 0;
      scene.fog = underwater ? new THREE.FogExp2(fogColor, t.fog) : null;
      scene.background = new THREE.Color(underwater ? fogColor : 0x08253e);
      world.environment.visible = underwater;
      post.uniforms.uStrength.value = underwater ? 1 : 0;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", blur);
      canvas.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      scene.traverse((o) => {
        if (
          o instanceof THREE.Mesh ||
          o instanceof THREE.Points ||
          o instanceof THREE.LineSegments
        ) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      composer.dispose();
      bloom.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
};
export type OceanEngine = Awaited<ReturnType<typeof startOcean>>;
