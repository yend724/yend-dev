varying vec3 vSandWorld;

// 海底のワールド座標をフラグメントシェーダーへ渡す。
void updateSeaFloorWorldPosition(vec3 position) {
  vSandWorld = (modelMatrix * vec4(position, 1.0)).xyz;
}
