import { Pane } from "tweakpane";

import { DEFAULT_FLOOR_WAVES, type FloorWaves } from "./constants";

export const createSeaFloorPane = (onChange: (waves: FloorWaves) => void) => {
  const waves = { ...DEFAULT_FLOOR_WAVES };
  const pane = new Pane({ title: "Ocean" });
  const folder = pane.addFolder({ title: "SeaFloor" });

  folder.addBinding(waves, "waveLength", {
    label: "波の長さの基準",
    min: 16,
    max: 160,
    step: 1,
  });

  const waveA = folder.addFolder({ title: "波 A（X方向）" });
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

  const waveB = folder.addFolder({ title: "波 B（Z方向）" });
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

  pane.on("change", () => onChange(waves));
  folder.addButton({ title: "初期値に戻す" }).on("click", () => {
    Object.assign(waves, DEFAULT_FLOOR_WAVES);
    pane.refresh();
    onChange(waves);
  });

  return pane;
};
