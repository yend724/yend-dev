import { createPaneFolder } from "@/shared/utils/tweakpane";

import { DEFAULT_FLOOR_WAVES, type FloorWaves } from "./constants";

export const createSeaFloorPane = (onChange: (waves: FloorWaves) => void) => {
  const waves = { ...DEFAULT_FLOOR_WAVES };
  const pane = createPaneFolder("SeaFloor", () => {
    Object.assign(waves, DEFAULT_FLOOR_WAVES);
    onChange(waves);
  });
  const { folder } = pane;

  folder.addBinding(waves, "waveLength", {
    label: "波の長さの基準",
    min: 16,
    max: 160,
    step: 1,
  });

  const waveA = folder.addFolder({ title: "波 A（X方向）", expanded: true });
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

  const waveB = folder.addFolder({ title: "波 B（Z方向）", expanded: true });
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

  folder.on("change", () => onChange(waves));

  return pane;
};
