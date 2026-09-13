import {
  HEMISPHERE_GROUND_COLOR,
  HEMISPHERE_INTENSITY,
  HEMISPHERE_SKY_COLOR,
} from "./constants";

export const OceanLights: React.FC = () => {
  return (
    <hemisphereLight
      color={HEMISPHERE_SKY_COLOR}
      groundColor={HEMISPHERE_GROUND_COLOR}
      intensity={HEMISPHERE_INTENSITY}
    />
  );
};
