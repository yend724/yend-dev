import * as THREE from "three";

export const oceanHalfExtent = 64;
export const oceanPeriod = oceanHalfExtent * 2;
/** Translation only: heading, velocity and camera-relative framing survive the seam. */
export const oceanWrapOffset = (position: THREE.Vector3) => {
  const wrap = (v: number) =>
    -Math.floor((v + oceanHalfExtent) / oceanPeriod) * oceanPeriod;
  return new THREE.Vector3(wrap(position.x), 0, wrap(position.z));
};
export const oceanEdgeVeil = (position: THREE.Vector3) => {
  return THREE.MathUtils.smoothstep(
    Math.max(Math.abs(position.x), Math.abs(position.z)),
    38,
    58
  );
};
