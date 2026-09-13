import { createPaneFolder } from "@/shared/utils/tweakpane";

import {
  DEFAULT_FLOOR_WAVES,
  DEFAULT_FLOOR_SURFACE,
  type FloorWaves,
  type FloorSurface,
} from "./constants";

export const createSeaFloorPane = (
  onChange: (waves: FloorWaves) => void,
  onSurfaceChange: (surface: FloorSurface) => void
) => {
  const surface = structuredClone(DEFAULT_FLOOR_SURFACE);
  const waves = { ...DEFAULT_FLOOR_WAVES };
  const pane = createPaneFolder("SeaFloor", () => {
    Object.assign(waves, DEFAULT_FLOOR_WAVES);
    Object.assign(surface, structuredClone(DEFAULT_FLOOR_SURFACE));
    onChange(waves);
    onSurfaceChange(surface);
  });
  const { folder } = pane;
  const terrain = folder.addFolder({ title: "地形", expanded: true });

  terrain.addBinding(waves, "waveLength", {
    label: "波の長さの基準",
    min: 16,
    max: 160,
    step: 1,
  });

  const waveA = terrain.addFolder({ title: "波 A（X方向）", expanded: true });
  waveA.addBinding(waves, "waveAAmplitude", {
    label: "高さ",
    min: 0,
    max: 3,
    step: 0.01,
  });
  waveA.addBinding(waves, "waveAXFrequency", {
    label: "Xの係数（3）",
    min: 0,
    max: 8,
    step: 0.1,
  });

  const waveB = terrain.addFolder({ title: "波 B（Z方向）", expanded: true });
  waveB.addBinding(waves, "waveBAmplitude", {
    label: "高さ",
    min: 0,
    max: 3,
    step: 0.01,
  });
  waveB.addBinding(waves, "waveBZFrequency", {
    label: "Zの係数（4）",
    min: 0,
    max: 8,
    step: 0.1,
  });

  // 色や粒感の変更で地形を再計算しないよう、イベントを分ける。
  terrain.on("change", () => onChange(waves));
  const appearance = folder.addFolder({ title: "砂の質感", expanded: true });
  appearance.addBinding(surface, "color", { label: "砂色" });
  const controls = [
    ["height", "海底の高さ", -10, 5, 0.1],
    ["roughness", "粗さ", 0, 1, 0.01],
    ["noiseScale", "模様の全体倍率", 0.1, 5, 0.01],
    ["duneHeight", "うねりの強さ", 0, 5, 0.01],
    ["duneScale", "うねりの細かさ", 0.005, 0.5, 0.005],
    ["duneFrequency", "うねりの密度", 0, 30, 0.1],
    ["grainHeight", "粒の強さ", 0, 0.1, 0.001],
    ["grainScale", "粒の細かさ", 1, 30, 0.1],
  ] as const;
  for (const [key, label, min, max, step] of controls) {
    appearance.addBinding(surface, key, { label, min, max, step });
  }
  appearance.on("change", () => onSurfaceChange(surface));

  return pane;
};
