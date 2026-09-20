"use client";

import { Canvas } from "@react-three/fiber";

import { OceanEnvironmentFallback } from "../ocean-environment-fallback";
import { OceanLights } from "../ocean-lights";
import { OrbitCamera } from "../orbit-camera";
import { SceneHelpers } from "../scene-helpers";
import { SeaFloor } from "../sea-floor";

import {
  CAMERA_PARAMS,
  PIXEL_RATIO_RANGE,
  RENDERER_PARAMS,
  CANVAS_BACKGROUND_COLOR,
} from "./constants";
import styles from "./ocean-environment.module.css";

export const OceanEnvironment: React.FC = () => {
  return (
    <div className={styles.environment}>
      <Canvas
        camera={CAMERA_PARAMS}
        gl={RENDERER_PARAMS}
        dpr={PIXEL_RATIO_RANGE}
        fallback={<OceanEnvironmentFallback />}
      >
        <color attach="background" args={[CANVAS_BACKGROUND_COLOR]} />
        <OrbitCamera />
        <OceanLights />
        <SeaFloor />
        <SceneHelpers />
      </Canvas>
    </div>
  );
};
