import { ToneMappingMode } from "postprocessing";

/** WebGL2 の MSAA サンプル数。レンダラの antialias の代わり。 */
export const MULTISAMPLING = 4;

export const DEFAULT_BLOOM = {
  intensity: 0.6,
  /** リニアの輝度がこの値を超えた画素だけ光らせる。1 以上なら HDR の発光体だけ。 */
  luminanceThreshold: 1,
  luminanceSmoothing: 0.03,
  /** mipmap blur の広がり。 */
  radius: 0.65,
};
export type BloomSettings = typeof DEFAULT_BLOOM;

export const DEFAULT_WATER_EFFECT = {
  /** 全体の強さ。0 で水越しの効果を切る。 */
  strength: 1,
  wobbleAmplitude: 0.00045,
  wobbleFrequency: 9,
  wobbleSpeed: 0.22,
  vignetteCenterY: 0.53,
  vignetteInner: 0.17,
  vignetteOuter: 0.8,
  /** 画面端の明るさ（1 で暗くしない）。 */
  vignetteDarkness: 0.82,
  /** 画面の下ほど足す青み。 */
  tint: "#213338",
  tintStrength: 1,
};
export type WaterEffectSettings = typeof DEFAULT_WATER_EFFECT;

export const DEFAULT_TONE_MAPPING = {
  mode: ToneMappingMode.ACES_FILMIC,
  exposure: 1.19,
};
export type ToneMappingSettings = typeof DEFAULT_TONE_MAPPING;
