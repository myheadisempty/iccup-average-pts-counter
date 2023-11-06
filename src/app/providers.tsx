"use client";

import { PointsContext } from "@/utils/contexts/PointsContext";
import { FC, PropsWithChildren, useState } from "react";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [points, setPoints] = useState(0);

  const addPoints = (points: number) => {
    setPoints((prevPoints) => prevPoints + points);
  };

  return (
    <PointsContext.Provider
      value={{ points, addPoints, updatePoints: setPoints }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export default Providers;
