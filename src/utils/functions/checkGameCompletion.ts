import { Leaver } from "../types";

export const checkGameCompletion = (leavers: Leaver[]) => {
  let points = 0;

  if (leavers.length > 0) {
    const isNotBadLeaver = leavers.some((leaver) => {
      return leaver.kills + leaver.deaths + leaver.assists >= 10;
    });

    if (isNotBadLeaver) {
      points = 1;
    }
  }

  if (leavers.length === 0) {
    points = 1;
  }

  return points;
};
