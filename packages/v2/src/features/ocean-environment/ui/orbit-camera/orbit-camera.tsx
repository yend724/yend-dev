import { OrbitControls } from "@react-three/drei";

import {
  ORBIT_MAX_DISTANCE,
  ORBIT_MAX_POLAR_ANGLE,
  ORBIT_MIN_DISTANCE,
  ORBIT_TARGET,
} from "./constants";

export const OrbitCamera: React.FC = () => {
  return (
    <OrbitControls
      makeDefault
      target={ORBIT_TARGET}
      minDistance={ORBIT_MIN_DISTANCE}
      maxDistance={ORBIT_MAX_DISTANCE}
      maxPolarAngle={ORBIT_MAX_POLAR_ANGLE}
    />
  );
};
