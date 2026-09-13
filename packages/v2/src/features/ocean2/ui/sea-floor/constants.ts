export const FLOOR_SIZE = 360;
export const FLOOR_SEGMENTS = 144;
export const FLOOR_HEIGHT = -0.5;
export const FLOOR_COLOR = "#cdbf9c";
export const FLOOR_ROUGHNESS = 0.94;

/** Base wave length of the floor undulation in world units. */
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
