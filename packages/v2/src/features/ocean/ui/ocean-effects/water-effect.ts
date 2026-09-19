import { BlendFunction, Effect } from "postprocessing";
import { Color, Uniform, Vector2 } from "three";

import {
  DEFAULT_TONE_MAPPING,
  DEFAULT_WATER_EFFECT,
  type WaterEffectSettings,
} from "./constants";
import fragmentShader from "./shaders/water-effect.glsl";

/** 水の揺らぎ。画面の横揺れ、周辺の暗さ、下方の青み、露出。 */
export class WaterEffect extends Effect {
  constructor() {
    const defaults = DEFAULT_WATER_EFFECT;
    super("OceanWaterEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uStrength", new Uniform(defaults.strength)],
        ["uWobbleAmplitude", new Uniform(defaults.wobbleAmplitude)],
        ["uWobbleFrequency", new Uniform(defaults.wobbleFrequency)],
        ["uWobbleSpeed", new Uniform(defaults.wobbleSpeed)],
        [
          "uVignetteCenter",
          new Uniform(new Vector2(0.5, defaults.vignetteCenterY)),
        ],
        ["uVignetteInner", new Uniform(defaults.vignetteInner)],
        ["uVignetteOuter", new Uniform(defaults.vignetteOuter)],
        ["uVignetteDarkness", new Uniform(defaults.vignetteDarkness)],
        ["uTint", new Uniform(new Color(defaults.tint))],
        ["uTintStrength", new Uniform(defaults.tintStrength)],
        ["uExposure", new Uniform(DEFAULT_TONE_MAPPING.exposure)],
      ]),
    });
  }

  /** 設定をまとめて uniforms へ反映する。 */
  applySettings(settings: WaterEffectSettings): void {
    const set = (name: string, value: number) => {
      this.uniforms.get(name)!.value = value;
    };
    set("uStrength", settings.strength);
    set("uWobbleAmplitude", settings.wobbleAmplitude);
    set("uWobbleFrequency", settings.wobbleFrequency);
    set("uWobbleSpeed", settings.wobbleSpeed);
    set("uVignetteInner", settings.vignetteInner);
    set("uVignetteOuter", settings.vignetteOuter);
    set("uVignetteDarkness", settings.vignetteDarkness);
    set("uTintStrength", settings.tintStrength);
    (this.uniforms.get("uVignetteCenter")!.value as Vector2).y =
      settings.vignetteCenterY;
    (this.uniforms.get("uTint")!.value as Color).set(settings.tint);
  }

  /** 明るさの圧縮の前に掛ける露出。 */
  get exposure(): number {
    return this.uniforms.get("uExposure")!.value as number;
  }

  set exposure(value: number) {
    this.uniforms.get("uExposure")!.value = value;
  }
}
