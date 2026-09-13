varying vec3 vSandWorld;
uniform float uSandNoiseScale;
uniform float uSandDuneHeight;
uniform float uSandGrainHeight;
uniform float uSandDuneScale;
uniform float uSandDuneFrequency;
uniform float uSandGrainScale;

// 座標から 0〜1 の擬似乱数を作る。同じ座標なら同じ値を返す。
float sandHash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

// 格子点のハッシュから勾配を選び、その頂点からの相対位置との内積を返す。
float sandGradient(vec3 cell, vec3 offset) {
  float h = floor(sandHash(cell) * 16.0);
  float u = h < 8.0 ? offset.x : offset.y;
  float v = h < 4.0 ? offset.y : ((h == 12.0 || h == 14.0) ? offset.x : offset.z);
  return (mod(h, 2.0) < 1.0 ? u : -u)
    + (mod(floor(h / 2.0), 2.0) < 1.0 ? v : -v);
}

// 8頂点の勾配による寄与を補間する3Dパーリンノイズ。
float sandNoise(vec3 p) {
  vec3 cell = floor(p);
  vec3 offset = fract(p);
  // 境界で1階・2階微分が0になる5次補間。
  vec3 weight = offset * offset * offset * (offset * (offset * 6.0 - 15.0) + 10.0);

  float lower = mix(
    mix(sandGradient(cell, offset), sandGradient(cell + vec3(1, 0, 0), offset - vec3(1, 0, 0)), weight.x),
    mix(sandGradient(cell + vec3(0, 1, 0), offset - vec3(0, 1, 0)), sandGradient(cell + vec3(1, 1, 0), offset - vec3(1, 1, 0)), weight.x),
    weight.y
  );
  float upper = mix(
    mix(sandGradient(cell + vec3(0, 0, 1), offset - vec3(0, 0, 1)), sandGradient(cell + vec3(1, 0, 1), offset - vec3(1, 0, 1)), weight.x),
    mix(sandGradient(cell + vec3(0, 1, 1), offset - vec3(0, 1, 1)), sandGradient(cell + vec3(1, 1, 1), offset - vec3(1, 1, 1)), weight.x),
    weight.y
  );
  // 0を中心とするノイズを、色の補間に使う0〜1へ変換。
  return clamp(mix(lower, upper, weight.z) * 0.5 + 0.5, 0.0, 1.0);
}

// 画素より細かいノイズを弱め、遠景での粒のちらつきを抑える。
float sandFilteredNoise(vec3 p, float footprint) {
  float visibility = 1.0 - smoothstep(0.25, 0.75, footprint);
  return (sandNoise(p) * 2.0 - 1.0) * visibility;
}

float sandFbm(vec3 p, float footprint) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * sandFilteredNoise(p, footprint);
    p = p * 2.0 + vec3(17.1, 9.2, 13.7);
    footprint *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Moanaの記事を参考に、低周波fBMのうねりと高周波の砂粒を合成する。
// https://wallisc.github.io/rendering/2020/12/08/Making-Of-Moana-the-shadertoy.html
float sandHeight(vec3 p) {
  float footprint = max(length(dFdx(p)), length(dFdy(p)));
  float dune = sin(uSandDuneFrequency * sandFbm(p * uSandDuneScale + vec3(10.0), footprint * uSandDuneScale));
  float grain = 0.5 * sandFilteredNoise(p * uSandGrainScale, footprint * uSandGrainScale)
    + 0.25 * sandFilteredNoise(p * uSandGrainScale * 2.0 + vec3(17.1), footprint * uSandGrainScale * 2.0);
  // うねり全体を距離で消さず、fBMの細かい成分だけを徐々に弱める。
  return uSandDuneHeight * dune + uSandGrainHeight * grain;
}

// 高さの画面微分を表面上の勾配に変換し、既存の地形の法線に加える。
// 位置と法線をともにビュー空間で扱うので、カメラが動いても光の向きが一致する。
vec3 applySeaFloorNormal(vec3 viewPosition, vec3 surfaceNormal) {
  float height = sandHeight(vSandWorld * uSandNoiseScale);
  vec3 dpdx = dFdx(viewPosition);
  vec3 dpdy = dFdy(viewPosition);
  vec3 r1 = cross(dpdy, surfaceNormal);
  vec3 r2 = cross(surfaceNormal, dpdx);
  float determinant = dot(dpdx, r1);
  vec3 gradient = dFdx(height) * r1 + dFdy(height) * r2;
  vec3 bumpedNormal = abs(determinant) * surfaceNormal - sign(determinant) * gradient;
  if (dot(bumpedNormal, bumpedNormal) == 0.0) return surfaceNormal;
  return normalize(bumpedNormal);
}
