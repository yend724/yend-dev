import type { DirectionalLight, HemisphereLight } from "three";

import { createPaneFolder } from "@/shared/utils/tweakpane";

import {
  DIRECTIONAL_COLOR,
  DIRECTIONAL_INTENSITY,
  DIRECTIONAL_POSITION,
  HEMISPHERE_GROUND_COLOR,
  HEMISPHERE_INTENSITY,
  HEMISPHERE_SKY_COLOR,
} from "./constants";

export const createOceanLightsPane = (
  hemisphere: HemisphereLight,
  directional: DirectionalLight
) => {
  const colors = {
    sky: `#${hemisphere.color.getHexString()}`,
    ground: `#${hemisphere.groundColor.getHexString()}`,
    sun: `#${directional.color.getHexString()}`,
  };
  const pane = createPaneFolder("光", () => {
    colors.sky = HEMISPHERE_SKY_COLOR;
    colors.ground = HEMISPHERE_GROUND_COLOR;
    colors.sun = DIRECTIONAL_COLOR;
    hemisphere.color.set(colors.sky);
    hemisphere.groundColor.set(colors.ground);
    hemisphere.intensity = HEMISPHERE_INTENSITY;
    directional.color.set(colors.sun);
    directional.intensity = DIRECTIONAL_INTENSITY;
    directional.position.set(...DIRECTIONAL_POSITION);
  });
  const hemisphereFolder = pane.folder.addFolder({
    title: "半球光",
    expanded: true,
  });

  hemisphereFolder
    .addBinding(colors, "sky", { label: "空の色" })
    .on("change", ({ value }) => hemisphere.color.set(value));
  hemisphereFolder
    .addBinding(colors, "ground", { label: "地面の色" })
    .on("change", ({ value }) => hemisphere.groundColor.set(value));
  hemisphereFolder.addBinding(hemisphere, "intensity", {
    label: "強さ",
    min: 0,
    max: 6,
    step: 0.05,
  });

  const directionalFolder = pane.folder.addFolder({
    title: "平行光",
    expanded: true,
  });
  directionalFolder
    .addBinding(colors, "sun", { label: "色" })
    .on("change", ({ value }) => directional.color.set(value));
  directionalFolder.addBinding(directional, "intensity", {
    label: "強さ",
    min: 0,
    max: 8,
    step: 0.05,
  });
  directionalFolder.addBinding(directional, "position", {
    label: "位置",
    x: { min: -50, max: 50, step: 1 },
    y: { min: 1, max: 60, step: 1 },
    z: { min: -50, max: 50, step: 1 },
  });

  return pane;
};
