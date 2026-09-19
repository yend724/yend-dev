import { ToneMappingMode } from "postprocessing";

import { createPaneFolder } from "@/shared/utils/tweakpane";

import {
  DEFAULT_BLOOM,
  DEFAULT_TONE_MAPPING,
  DEFAULT_WATER_EFFECT,
  type BloomSettings,
  type ToneMappingSettings,
  type WaterEffectSettings,
} from "./constants";

type Handlers = {
  onBloomChange: (bloom: BloomSettings) => void;
  onWaterChange: (water: WaterEffectSettings) => void;
  onToneMappingChange: (toneMapping: ToneMappingSettings) => void;
};

export const createOceanEffectsPane = (handlers: Handlers) => {
  const bloom = { ...DEFAULT_BLOOM };
  const water = { ...DEFAULT_WATER_EFFECT };
  const toneMapping = { ...DEFAULT_TONE_MAPPING };
  const notifyAll = () => {
    handlers.onBloomChange(bloom);
    handlers.onWaterChange(water);
    handlers.onToneMappingChange(toneMapping);
  };
  const pane = createPaneFolder("効果", () => {
    Object.assign(bloom, DEFAULT_BLOOM);
    Object.assign(water, DEFAULT_WATER_EFFECT);
    Object.assign(toneMapping, DEFAULT_TONE_MAPPING);
    notifyAll();
  });
  const { folder } = pane;

  const bloomFolder = folder.addFolder({ title: "光のにじみ", expanded: true });
  const bloomControls = [
    ["intensity", "強さ", 0, 3, 0.01],
    ["luminanceThreshold", "輝度のしきい値", 0, 2, 0.01],
    ["luminanceSmoothing", "しきい値のなめらかさ", 0, 1, 0.01],
    ["radius", "広がり", 0, 1, 0.01],
  ] as const;
  for (const [key, label, min, max, step] of bloomControls) {
    bloomFolder.addBinding(bloom, key, { label, min, max, step });
  }
  bloomFolder.on("change", () => handlers.onBloomChange(bloom));

  const waterFolder = folder.addFolder({ title: "水の揺らぎ", expanded: true });
  const waterControls = [
    ["strength", "全体の強さ", 0, 1, 0.01],
    ["wobbleAmplitude", "揺らぎの幅", 0, 0.005, 0.00005],
    ["wobbleFrequency", "揺らぎの細かさ", 0, 40, 0.5],
    ["wobbleSpeed", "揺らぎの速さ", 0, 2, 0.01],
    ["vignetteCenterY", "ビネットの中心（縦）", 0, 1, 0.01],
    ["vignetteInner", "ビネットの内側", 0, 1, 0.01],
    ["vignetteOuter", "ビネットの外側", 0, 1.5, 0.01],
    ["vignetteDarkness", "画面端の明るさ", 0, 1, 0.01],
    ["tintStrength", "青みの強さ", 0, 4, 0.05],
  ] as const;
  for (const [key, label, min, max, step] of waterControls) {
    waterFolder.addBinding(water, key, { label, min, max, step });
  }
  waterFolder.addBinding(water, "tint", { label: "青みの色" });
  waterFolder.on("change", () => handlers.onWaterChange(water));

  const toneFolder = folder.addFolder({
    title: "明るさの圧縮",
    expanded: true,
  });
  toneFolder.addBinding(toneMapping, "mode", {
    label: "方式",
    options: {
      "ACES フィルミック": ToneMappingMode.ACES_FILMIC,
      AgX: ToneMappingMode.AGX,
      ニュートラル: ToneMappingMode.NEUTRAL,
      ラインハルト: ToneMappingMode.REINHARD,
      リニア: ToneMappingMode.LINEAR,
    },
  });
  toneFolder.addBinding(toneMapping, "exposure", {
    label: "露出",
    min: 0.2,
    max: 3,
    step: 0.01,
  });
  toneFolder.on("change", () => handlers.onToneMappingChange(toneMapping));

  return pane;
};
