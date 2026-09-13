import { FLOOR_HEIGHT } from "../sea-floor/constants";

import {
  AXES_LENGTH,
  GRID_CENTER_COLOR,
  GRID_DIVISIONS,
  GRID_LINE_COLOR,
  GRID_OFFSET,
  GRID_SIZE,
} from "./constants";

export const SceneHelpers: React.FC = () => {
  return (
    <>
      <gridHelper
        args={[GRID_SIZE, GRID_DIVISIONS, GRID_CENTER_COLOR, GRID_LINE_COLOR]}
        position={[0, FLOOR_HEIGHT + GRID_OFFSET, 0]}
      />
      <axesHelper args={[AXES_LENGTH]} />
    </>
  );
};
