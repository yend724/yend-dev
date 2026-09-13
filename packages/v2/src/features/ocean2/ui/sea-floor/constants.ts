export const FLOOR_SIZE = 360;
export const FLOOR_SEGMENTS = 144;
export const FLOOR_HEIGHT = 0;
export const FLOOR_COLOR = "#c9d8e5";
export const FLOOR_ROUGHNESS = 0.94;

export const FLOOR_SAND_NOISE_SCALE = 1.4;
// 高さはワールド単位。大きな地形とは別に、法線だけに加える凹凸。
export const FLOOR_SAND_DUNE_HEIGHT = 0.4;
export const FLOOR_SAND_GRAIN_HEIGHT = 0.004;

/** 海底の起伏の間隔を決める基準値（ワールド単位）。 */
export const FLOOR_WAVE_LENGTH = 64;
export const FLOOR_WAVE_A_AMPLITUDE = 0.35;
export const FLOOR_WAVE_B_AMPLITUDE = 0.28;

export const DEFAULT_FLOOR_WAVES = {
  waveLength: FLOOR_WAVE_LENGTH,
  waveAAmplitude: FLOOR_WAVE_A_AMPLITUDE,
  waveBAmplitude: FLOOR_WAVE_B_AMPLITUDE,
  waveAXFrequency: 3,
  waveBZFrequency: 4,
};

export type FloorWaves = typeof DEFAULT_FLOOR_WAVES;

export const DEFAULT_FLOOR_SURFACE = {
  height: FLOOR_HEIGHT,
  color: FLOOR_COLOR,
  roughness: FLOOR_ROUGHNESS,
  noiseScale: FLOOR_SAND_NOISE_SCALE,
  duneHeight: FLOOR_SAND_DUNE_HEIGHT,
  duneScale: 0.075,
  duneFrequency: 10,
  grainHeight: FLOOR_SAND_GRAIN_HEIGHT,
  grainScale: 8,
};
export type FloorSurface = typeof DEFAULT_FLOOR_SURFACE;
