import {
  Bloom,
  createEffectComponent,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import type { BloomEffect, ToneMappingEffect } from "postprocessing";
import { useEffect, useRef } from "react";

import {
  DEFAULT_BLOOM,
  DEFAULT_TONE_MAPPING,
  MULTISAMPLING,
  type BloomSettings,
  type ToneMappingSettings,
} from "./constants";
import { WaterEffect } from "./water-effect";

const Water = createEffectComponent<typeof WaterEffect, object>(WaterEffect);

const applyBloom = (bloom: BloomEffect, settings: BloomSettings) => {
  bloom.intensity = settings.intensity;
  bloom.luminanceMaterial.threshold = settings.luminanceThreshold;
  bloom.luminanceMaterial.smoothing = settings.luminanceSmoothing;
  bloom.mipmapBlurPass.radius = settings.radius;
};

/**
 * 画面全体の後処理。光のにじみ → 水の揺らぎ → 明るさの圧縮の順に 1 パスで掛ける。
 * シーンはリニアの HalfFloat バッファへ描かれるので、明るさの圧縮と露出はここで行う。
 */
export const OceanEffects: React.FC = () => {
  const bloomRef = useRef<BloomEffect>(null);
  const waterRef = useRef<WaterEffect>(null);
  const toneMappingRef = useRef<ToneMappingEffect>(null);

  useEffect(() => {
    const applyToneMapping = (settings: ToneMappingSettings) => {
      if (waterRef.current) waterRef.current.exposure = settings.exposure;
      if (toneMappingRef.current) toneMappingRef.current.mode = settings.mode;
    };

    let disposePane: (() => void) | undefined;
    let cancelled = false;
    if (process.env.NODE_ENV === "development") {
      void import("./ocean-effects-pane").then(({ createOceanEffectsPane }) => {
        if (cancelled) return;
        const pane = createOceanEffectsPane({
          onBloomChange: (settings) => {
            if (bloomRef.current) applyBloom(bloomRef.current, settings);
          },
          onWaterChange: (settings) => {
            waterRef.current?.applySettings(settings);
          },
          onToneMappingChange: applyToneMapping,
        });
        disposePane = pane.dispose;
      });
    }

    return () => {
      cancelled = true;
      disposePane?.();
    };
  }, []);

  return (
    <EffectComposer multisampling={MULTISAMPLING}>
      <Bloom
        ref={bloomRef}
        mipmapBlur
        intensity={DEFAULT_BLOOM.intensity}
        luminanceThreshold={DEFAULT_BLOOM.luminanceThreshold}
        luminanceSmoothing={DEFAULT_BLOOM.luminanceSmoothing}
        radius={DEFAULT_BLOOM.radius}
      />
      <Water ref={waterRef} />
      <ToneMapping ref={toneMappingRef} mode={DEFAULT_TONE_MAPPING.mode} />
    </EffectComposer>
  );
};
