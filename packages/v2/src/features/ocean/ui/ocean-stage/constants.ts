import type { WebGLRendererParameters } from "three";

export const CAMERA_FOV = 44;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_POSITION: [number, number, number] = [0, 4.2, 12];
export const CAMERA_PARAMS = {
  fov: CAMERA_FOV,
  near: CAMERA_NEAR,
  far: CAMERA_FAR,
  position: CAMERA_POSITION,
};

export const CANVAS_BACKGROUND_COLOR = "#287c8c";

export const MIN_PIXEL_RATIO = 1;
export const MAX_PIXEL_RATIO = 2;
export const PIXEL_RATIO_RANGE: [number, number] = [
  MIN_PIXEL_RATIO,
  MAX_PIXEL_RATIO,
];

export const RENDERER_PARAMS = {
  // アンチエイリアスは OceanEffects の MSAA で掛ける。
  antialias: false,
  powerPreference: "high-performance",
} satisfies WebGLRendererParameters;
