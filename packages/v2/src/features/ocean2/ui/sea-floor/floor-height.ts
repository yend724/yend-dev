import { DEFAULT_FLOOR_WAVES, type FloorWaves } from "./constants";

/** Undulation of the sea floor at (x, z), relative to FLOOR_HEIGHT. */
export const floorHeight = (
  x: number,
  z: number,
  waves: FloorWaves = DEFAULT_FLOOR_WAVES
): number => {
  const k = Math.PI / waves.waveLength;
  const waveA = Math.sin(x * k * waves.waveAXFrequency) * waves.waveAAmplitude;
  const waveB = Math.sin(z * k * waves.waveBZFrequency) * waves.waveBAmplitude;
  return waveA + waveB;
};
