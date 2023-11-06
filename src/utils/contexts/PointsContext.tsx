import { createContext } from "react";

type PointsContextType = {
  points: number;
  addPoints: (points: number) => void;
  updatePoints: (points: number) => void;
};

export const PointsContext = createContext<PointsContextType>({
  addPoints: () => {},
  updatePoints: () => {},
  points: 0,
});
