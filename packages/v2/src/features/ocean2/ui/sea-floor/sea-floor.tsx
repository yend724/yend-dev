import { useEffect, useMemo } from "react";

import { FLOOR_COLOR, FLOOR_HEIGHT, FLOOR_ROUGHNESS } from "./constants";
import {
  createSeaFloorGeometry,
  updateSeaFloorGeometry,
} from "./sea-floor-geometry";
import { createSeaFloorPane } from "./sea-floor-pane";

export const SeaFloor: React.FC = () => {
  const geometry = useMemo(() => {
    return createSeaFloorGeometry();
  }, []);

  useEffect(() => {
    const pane = createSeaFloorPane((waves) => {
      updateSeaFloorGeometry(geometry, waves);
    });
    return () => {
      pane.dispose();
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh geometry={geometry} position={[0, FLOOR_HEIGHT, 0]}>
      <meshStandardMaterial color={FLOOR_COLOR} roughness={FLOOR_ROUGHNESS} />
    </mesh>
  );
};
