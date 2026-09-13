import styles from "./ocean-stage-fallback.module.css";

export const OceanStageFallback: React.FC = () => {
  return (
    <p className={styles.message} role="alert">
      海を描画できませんでした。WebGL 2に対応したブラウザで再度お試しください。
    </p>
  );
};
