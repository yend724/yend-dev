import styles from "./ocean-environment-fallback.module.css";

export const OceanEnvironmentFallback: React.FC = () => {
  return (
    <p className={styles.message} role="alert">
      海を描画できませんでした。WebGL 2に対応したブラウザで再度お試しください。
    </p>
  );
};
