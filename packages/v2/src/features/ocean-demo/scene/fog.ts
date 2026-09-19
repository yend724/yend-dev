import * as THREE from "three";

export const fogColor = 0x287c8c;
export const fogUniforms = {
  uLoopVeil: { value: 0 },
  uWaterDensity: { value: 0.045 },
  uWaterColor: { value: new THREE.Color(fogColor) },
};
const vertexHeader = "varying vec3 vWaterWorld;\n";
const worldPosition = (position: string) =>
  `vec4 waterPosition=vec4(${position},1.);\n#ifdef USE_INSTANCING\nwaterPosition=instanceMatrix*waterPosition;\n#endif\nvWaterWorld=(modelMatrix*waterPosition).xyz;\n`;
const fragmentHeader = `varying vec3 vWaterWorld;
uniform float uWaterDensity;
uniform float uLoopVeil;
uniform float uLoopAffected;
uniform vec3 uWaterColor;
float waterFogAmount(){
 float distanceToCamera=distance(cameraPosition,vWaterWorld);
 float depth=max(0.,distanceToCamera-18.);
 float distanceFog=1.-exp(-depth*depth*uWaterDensity*uWaterDensity);
 float farFade=smoothstep(40.,56.,distanceToCamera)*clamp(uWaterDensity/.045,0.,1.);
 distanceFog=mix(distanceFog,1.,farFade);
 float upperFog=smoothstep(12.,24.,vWaterWorld.y)*smoothstep(2.,12.,distanceToCamera)*clamp(uWaterDensity/.045,0.,1.);
 return 1.-(1.-distanceFog)*(1.-upperFog)*(1.-uLoopVeil*uLoopAffected);
}
`;

/** Shared radial and upper-water haze, including transparent light and particles. */
export const applyWaterFog = (
  material: THREE.Material,
  loopAffected = true
) => {
  if (material.userData.waterFog) return;
  material.userData.waterFog = true;
  if (material instanceof THREE.ShaderMaterial) {
    Object.assign(material.uniforms, fogUniforms, {
      uLoopAffected: { value: loopAffected ? 1 : 0 },
    });
    material.vertexShader =
      vertexHeader +
      material.vertexShader.replace(
        /void\s+main\s*\(\s*\)\s*\{/,
        (m) => m + worldPosition("position")
      );
    const f = material.fragmentShader,
      index = f.lastIndexOf("}");
    // Additive/transparent particles fade out instead of adding fog-colored light.
    material.fragmentShader =
      fragmentHeader +
      f.slice(0, index) +
      "\ngl_FragColor.a*=1.-waterFogAmount();\n" +
      f.slice(index);
  } else {
    const previous = material.onBeforeCompile,
      previousKey = material.customProgramCacheKey();
    material.onBeforeCompile = (shader, renderer) => {
      previous.call(material, shader, renderer);
      Object.assign(shader.uniforms, fogUniforms, {
        uLoopAffected: { value: loopAffected ? 1 : 0 },
      });
      shader.vertexShader =
        vertexHeader +
        shader.vertexShader.replace(
          "#include <project_vertex>",
          worldPosition("transformed") + "#include <project_vertex>"
        );
      shader.fragmentShader =
        fragmentHeader +
        shader.fragmentShader.replace(
          "#include <fog_fragment>",
          "gl_FragColor.rgb=mix(gl_FragColor.rgb,uWaterColor,waterFogAmount());"
        );
    };
    material.customProgramCacheKey = () =>
      previousKey + "-water-haze-v2-" + loopAffected;
  }
  material.needsUpdate = true;
};
