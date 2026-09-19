import * as THREE from "three";
export type Tuning = {
  roughness: number;
  reflection: number;
  transmission: number;
  emission: number;
  bloom: number;
  fog: number;
  caustics: number;
  swimming: boolean;
  underwater: boolean;
};
export const defaultTuning: Tuning = {
  roughness: 0.34,
  reflection: 0.4,
  transmission: 0.35,
  emission: 1,
  bloom: 0.28,
  fog: 0.045,
  caustics: 0.55,
  swimming: true,
  underwater: true,
};
export const oceanUniforms = {
  uTime: { value: 0 },
  uCaustics: { value: 0.55 },
  uReflection: { value: 0.4 },
  uTransmission: { value: 0.35 },
  uSwim: { value: 0.4 },
  uEmission: { value: 1 },
  uGoldPosition: { value: new THREE.Vector3(17, 3, -5) },
};
const noiseGLSL = `
float hash31(vec3 p){ p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z); }
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float caustic(vec3 p){vec2 q=p.xz*.67; q+=vec2(sin(q.y*.77+uTime*.17),cos(q.x*.7-uTime*.13))*.48;float a=abs(sin(q.x+q.y*.4+uTime*.13)*sin(q.y-q.x*.31-uTime*.11));return pow(1.-a,20.);}
`;
const common = `uniform float uTime,uCaustics,uReflection,uTransmission;uniform vec3 uGoldPosition;varying vec3 vOceanWorld;varying vec3 vOceanLocal;${noiseGLSL}`;
// Continuous vertical bend. Fin rotation is weighted from the blended attachment.
// Keep the upper tail reach while extending the downstroke with a slower beat.
// Jacobian columns are finite differences; the inverse transpose updates normals.
const deform = `uniform float uTime,uSwim;
vec3 swimDeform(vec3 p){
 float tail=(1.-smoothstep(-2.95,.65,p.z));float phase=uTime*2.4+p.z*1.15;
 p.y+=(sin(phase)*.42-.15)*tail*tail*uSwim;
 float fin=smoothstep(.52,1.48,abs(p.x))*(1.-smoothstep(.7,1.3,abs(p.z+.20)));
 float a=sin(uTime*2.3+.5)*.21*fin*uSwim;
 float dy=p.y+.28;float dx=abs(p.x)-.52;
 p.y+=sin(a)*dx+(cos(a)-1.)*dy;
 p.x+=sign(p.x)*((cos(a)-1.)*dx-sin(a)*dy);
 return p;
}
mat3 swimJacobian(vec3 p){float e=.002;vec3 a=(swimDeform(p+vec3(e,0,0))-swimDeform(p-vec3(e,0,0)))/(2.*e);vec3 b=(swimDeform(p+vec3(0,e,0))-swimDeform(p-vec3(0,e,0)))/(2.*e);vec3 c=(swimDeform(p+vec3(0,0,e))-swimDeform(p-vec3(0,0,e)))/(2.*e);return mat3(a,b,c);}
`;
const patch = (
  material: THREE.MeshStandardMaterial,
  kind: "rock" | "skin" | "sand"
) => {
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, oceanUniforms);
    s.vertexShader = s.vertexShader.replace(
      "#include <common>",
      `#include <common>\nvarying vec3 vOceanWorld;varying vec3 vOceanLocal;${kind === "skin" ? deform : ""}`
    );
    if (kind === "skin") {
      s.vertexShader = s.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>\nmat3 J=swimJacobian(position); objectNormal=normalize(mat3(cross(J[1],J[2]),cross(J[2],J[0]),cross(J[0],J[1]))*objectNormal);`
      );
      s.vertexShader = s.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed=swimDeform(position);"
      );
    }
    s.vertexShader = s.vertexShader.replace(
      "#include <project_vertex>",
      `vOceanLocal=position;vec4 oceanPos=vec4(transformed,1.);\n#ifdef USE_INSTANCING\noceanPos=instanceMatrix*oceanPos;\n#endif\nvOceanWorld=(modelMatrix*oceanPos).xyz;\n#include <project_vertex>`
    );
    s.fragmentShader = s.fragmentShader.replace(
      "#include <common>",
      `#include <common>\n${common}`
    );
    const color =
      kind === "skin"
        ? `
 float belly=smoothstep(-.64,.20,vOceanLocal.y);
 vec3 skin=mix(vec3(.67,.79,.85),vec3(.92,.96,.98),belly);
 skin=mix(skin,vec3(1.,.98,.94),smoothstep(.10,.78,vOceanLocal.y));
 diffuseColor.rgb*=skin;
 `
        : kind === "rock"
          ? `
 float coarse=noise3(vOceanWorld*.65);float fine=noise3(vOceanWorld*7.5);float strata=sin(vOceanWorld.y*7.+coarse*7.);
 vec3 stone=mix(vec3(.14,.26,.32),vec3(.37,.49,.49),coarse);
 stone*=.82+.20*fine+.08*strata;
 diffuseColor.rgb*=stone;
 `
          : `float sand=noise3(vOceanWorld*1.4);diffuseColor.rgb*=mix(vec3(.41,.59,.56),vec3(.76,.78,.63),sand);`;
    s.fragmentShader = s.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>\n${color}`
    );
    s.fragmentShader = s.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+${kind === "skin" ? ".02" : ".18"}*(noise3(vOceanWorld*3.)-.5),.12,.98);`
    );
    s.fragmentShader = s.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>\nfloat ca=caustic(vOceanWorld)*uCaustics;totalEmissiveRadiance+=diffuseColor.rgb*ca*.28;`
    );
    s.fragmentShader = s.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
 vec3 goldDir=uGoldPosition-vOceanWorld;float goldAtt=1./(1.+dot(goldDir,goldDir)*.05);vec3 goldView=(viewMatrix*vec4(normalize(goldDir),0.)).xyz;
 outgoingLight+=vec3(1.,.65,.22)*goldAtt*max(0.,dot(normal,goldView))*.36;
 float fres=pow(1.-max(dot(normal,geometryViewDir),0.),4.);
 outgoingLight+=vec3(.35,.65,.72)*fres*uReflection*.17;
 ${kind === "skin" ? `float finEdge=smoothstep(.82,1.40,abs(vOceanLocal.x));vec3 sunView=normalize((viewMatrix*vec4(normalize(vec3(-15.,30.,14.)),0.)).xyz);float backlight=pow(max(dot(-geometryViewDir,sunView),0.),3.);outgoingLight+=vec3(.60,.83,.87)*finEdge*backlight*uTransmission;` : ""}
 #include <opaque_fragment>`
    );
  };
  material.customProgramCacheKey = () => `yend-${kind}-v3`;
  return material;
};
export const makeRock = () =>
  patch(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.83,
      metalness: 0.06,
      flatShading: true,
    }),
    "rock"
  );
export const makeSand = () =>
  patch(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94 }),
    "sand"
  );
export const makeSkin = () =>
  patch(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.28,
    }),
    "skin"
  );
export const makeLightColumn = () => {
  return new THREE.ShaderMaterial({
    uniforms: { ...oceanUniforms, uNear: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;varying vec3 vPos;void main(){vUv=uv;vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uTime,uEmission,uNear;varying vec2 vUv;varying vec3 vPos;void main(){float bands=.70+.18*sin(vPos.y*2.3+uTime*.48)+.12*sin(vPos.y*5.-uTime*.3);float center=pow(max(0.,1.-abs(vUv.x-.5)*2.),2.);float ends=smoothstep(0.,.10,vUv.y)*(1.-smoothstep(.86,1.,vUv.y));vec3 col=mix(vec3(1.,.64,.21),vec3(1.,.93,.72),center);gl_FragColor=vec4(col*(1.15+center*.55)*uEmission,ends*bands*(.27+center*.24+uNear*.07));}`,
  });
};
export const waterPost = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uStrength: { value: 1 },
  },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform sampler2D tDiffuse;uniform float uTime,uStrength;varying vec2 vUv;void main(){vec2 uv=vUv;uv.x+=sin(uv.y*9.+uTime*.22)*.00045*uStrength;vec3 c=texture2D(tDiffuse,uv).rgb;float vig=smoothstep(.8,.17,distance(uv,vec2(.5,.53)));c*=mix(.82,1.,vig);c+=vec3(.015,.033,.039)*pow(1.-uv.y,2.)*uStrength;gl_FragColor=vec4(c,1.);}`,
};
// Shadow deformation is shared with the beauty pass to avoid a rigid swimming shadow.
export const makeSkinDepth = () => {
  const material = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
  });
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, oceanUniforms);
    s.vertexShader = s.vertexShader
      .replace("#include <common>", `#include <common>\n${deform}`)
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed=swimDeform(position);"
      );
  };
  material.customProgramCacheKey = () => "yend-skin-depth-v1";
  return material;
};
