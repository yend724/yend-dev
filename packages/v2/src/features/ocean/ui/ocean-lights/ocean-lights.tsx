import { useEffect, useRef } from "react";
import type { DirectionalLight, HemisphereLight } from "three";

import {
  DIRECTIONAL_COLOR,
  DIRECTIONAL_INTENSITY,
  DIRECTIONAL_POSITION,
  HEMISPHERE_GROUND_COLOR,
  HEMISPHERE_INTENSITY,
  HEMISPHERE_SKY_COLOR,
} from "./constants";

export const OceanLights: React.FC = () => {
  const hemisphereRef = useRef<HemisphereLight>(null);
  const directionalRef = useRef<DirectionalLight>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let cancelled = false;
    let disposePane: (() => void) | undefined;
    void import("./ocean-lights-pane").then(({ createOceanLightsPane }) => {
      if (cancelled || !hemisphereRef.current || !directionalRef.current)
        return;
      const pane = createOceanLightsPane(
        hemisphereRef.current,
        directionalRef.current
      );
      disposePane = pane.dispose;
    });

    return () => {
      cancelled = true;
      disposePane?.();
    };
  }, []);

  return (
    <>
      <hemisphereLight
        ref={hemisphereRef}
        color={HEMISPHERE_SKY_COLOR}
        groundColor={HEMISPHERE_GROUND_COLOR}
        intensity={HEMISPHERE_INTENSITY}
      />
      <directionalLight
        ref={directionalRef}
        color={DIRECTIONAL_COLOR}
        intensity={DIRECTIONAL_INTENSITY}
        position={DIRECTIONAL_POSITION}
      />
    </>
  );
};
