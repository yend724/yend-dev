import type { MeshStandardMaterial } from "three";

import { DEFAULT_FLOOR_SURFACE, type FloorSurface } from "./constants";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

export const createSeaFloorShader = () => {
  const defaults = DEFAULT_FLOOR_SURFACE;
  const uniforms = {
    uSandNoiseScale: { value: defaults.noiseScale },
    uSandDuneHeight: { value: defaults.duneHeight },
    uSandDuneScale: { value: defaults.duneScale },
    uSandDuneFrequency: { value: defaults.duneFrequency },
    uSandGrainHeight: { value: defaults.grainHeight },
    uSandGrainScale: { value: defaults.grainScale },
  };
  const update = (surface: FloorSurface) => {
    uniforms.uSandNoiseScale.value = surface.noiseScale;
    uniforms.uSandDuneHeight.value = surface.duneHeight;
    uniforms.uSandDuneScale.value = surface.duneScale;
    uniforms.uSandDuneFrequency.value = surface.duneFrequency;
    uniforms.uSandGrainHeight.value = surface.grainHeight;
    uniforms.uSandGrainScale.value = surface.grainScale;
  };
  const onBeforeCompile: MeshStandardMaterial["onBeforeCompile"] = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${vertexShader}`)
      .replace(
        "#include <project_vertex>",
        "updateSeaFloorWorldPosition(transformed);\n#include <project_vertex>"
      );

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${fragmentShader}`)
      .replace(
        "#include <normal_fragment_maps>",
        "#include <normal_fragment_maps>\nnormal = applySeaFloorNormal(-vViewPosition, normal);"
      );
  };

  return { onBeforeCompile, update };
};

export const seaFloorShaderCacheKey = () =>
  `ocean2-sea-floor-bump-v2:${vertexShader}:${fragmentShader}`;
