import * as THREE from "three";

import {
  DEFAULT_FLOOR_WAVES,
  FLOOR_SEGMENTS,
  FLOOR_SIZE,
  type FloorWaves,
} from "./constants";
import { floorHeight } from "./floor-height";

/** Horizontal plane whose vertices are displaced by floorHeight. */
export const createSeaFloorGeometry = (): THREE.PlaneGeometry => {
  const geometry = new THREE.PlaneGeometry(
    FLOOR_SIZE,
    FLOOR_SIZE,
    FLOOR_SEGMENTS,
    FLOOR_SEGMENTS
  );
  geometry.rotateX(-Math.PI / 2);
  updateSeaFloorGeometry(geometry, DEFAULT_FLOOR_WAVES);
  return geometry;
};

/** Reuse the plane while changing its height and lighting normals. */
export const updateSeaFloorGeometry = (
  geometry: THREE.PlaneGeometry,
  waves: FloorWaves
): void => {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    position.setY(i, floorHeight(position.getX(i), position.getZ(i), waves));
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
};
