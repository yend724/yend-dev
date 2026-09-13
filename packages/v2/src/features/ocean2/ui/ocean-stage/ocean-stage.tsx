"use client";

import { Canvas } from "@react-three/fiber";
import styles from "./ocean-stage.module.css";

import {
  CAMERA_PARAMS,
  PIXEL_RATIO_RANGE,
  RENDERER_PARAMS,
  CANVAS_BACKGROUND_COLOR,
} from "./constants";

import { OrbitCamera } from "../orbit-camera";
import { SceneHelpers } from "../scene-helpers";
import { OceanLights } from "../ocean-lights";
import { OceanStageFallback } from "../ocean-stage-fallback";
import { SeaFloor } from "../sea-floor";

export const OceanStage: React.FC = () => {
  return (
    <div className={styles.stage}>
      <Canvas
        camera={CAMERA_PARAMS}
        gl={RENDERER_PARAMS}
        dpr={PIXEL_RATIO_RANGE}
        fallback={<OceanStageFallback />}
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
