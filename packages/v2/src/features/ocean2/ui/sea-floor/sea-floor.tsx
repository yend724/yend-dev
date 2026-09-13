import { useEffect, useMemo } from "react";

import { FLOOR_COLOR, FLOOR_HEIGHT, FLOOR_ROUGHNESS } from "./constants";
import {
  createSeaFloorGeometry,
  updateSeaFloorGeometry,
} from "./sea-floor-geometry";

export const SeaFloor: React.FC = () => {
  const geometry = useMemo(() => {
    return createSeaFloorGeometry();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let disposePane: (() => void) | undefined;
    if (process.env.NODE_ENV === "development") {
      void import("./sea-floor-pane").then(({ createSeaFloorPane }) => {
        if (cancelled) return;
        const pane = createSeaFloorPane((waves) => {
          updateSeaFloorGeometry(geometry, waves);
        });
        disposePane = pane.dispose;
      });
    }

    return () => {
      cancelled = true;
      disposePane?.();
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh geometry={geometry} position={[0, FLOOR_HEIGHT, 0]}>
      <meshStandardMaterial color={FLOOR_COLOR} roughness={FLOOR_ROUGHNESS} />
    </mesh>
  );
};
