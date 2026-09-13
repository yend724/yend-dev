import { useEffect, useMemo, useRef } from "react";
import type { Mesh, MeshStandardMaterial } from "three";

import { FLOOR_COLOR, FLOOR_HEIGHT, FLOOR_ROUGHNESS } from "./constants";
import {
  createSeaFloorGeometry,
  updateSeaFloorGeometry,
} from "./sea-floor-geometry";
import {
  createSeaFloorShader,
  seaFloorShaderCacheKey,
} from "./sea-floor-shader";

export const SeaFloor: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const sandShader = useMemo(() => createSeaFloorShader(), []);
  const geometry = useMemo(() => {
    return createSeaFloorGeometry();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let disposePane: (() => void) | undefined;
    if (process.env.NODE_ENV === "development") {
      void import("./sea-floor-pane").then(({ createSeaFloorPane }) => {
        if (cancelled) return;
        const pane = createSeaFloorPane(
          (waves) => {
            updateSeaFloorGeometry(geometry, waves);
          },
          (surface) => {
            sandShader.update(surface);
            if (meshRef.current) meshRef.current.position.y = surface.height;
            if (materialRef.current) {
              materialRef.current.color.set(surface.color);
              materialRef.current.roughness = surface.roughness;
            }
          }
        );
        disposePane = pane.dispose;
      });
    }

    return () => {
      cancelled = true;
      disposePane?.();
      geometry.dispose();
    };
  }, [geometry, sandShader]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, FLOOR_HEIGHT, 0]}>
      <meshStandardMaterial
        ref={materialRef}
        color={FLOOR_COLOR}
        roughness={FLOOR_ROUGHNESS}
        onBeforeCompile={sandShader.onBeforeCompile}
        customProgramCacheKey={seaFloorShaderCacheKey}
      />
    </mesh>
  );
};
