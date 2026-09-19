uniform float uStrength;
uniform float uWobbleAmplitude;
uniform float uWobbleFrequency;
uniform float uWobbleSpeed;
uniform vec2 uVignetteCenter;
uniform float uVignetteInner;
uniform float uVignetteOuter;
uniform float uVignetteDarkness;
uniform vec3 uTint;
uniform float uTintStrength;
// トーンマッピング前に掛ける露出。レンダラの toneMappingExposure の代わり。
uniform float uExposure;

// 画面を横に細かく揺らし、水越しに見ている感じを出す。time は postprocessing が渡す秒数。
void mainUv(inout vec2 uv) {
  uv.x += sin(uv.y * uWobbleFrequency + time * uWobbleSpeed) * uWobbleAmplitude * uStrength;
}

// 周辺を少し暗くし、画面の下ほど青みを足す。トーンマッピング前のリニア色で扱う。
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  float center = 1.0 - smoothstep(uVignetteInner, uVignetteOuter, distance(uv, uVignetteCenter));
  color *= mix(uVignetteDarkness, 1.0, center);
  color += uTint * uTintStrength * pow(1.0 - uv.y, 2.0) * uStrength;
  outputColor = vec4(color * uExposure, inputColor.a);
}
