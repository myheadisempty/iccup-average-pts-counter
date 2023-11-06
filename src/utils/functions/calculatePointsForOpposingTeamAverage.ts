export const calculatePointsForOpposingTeamAverage = (
  opposingTeamAvgScore: number
) => {
  let points = 0;

  if (opposingTeamAvgScore >= 2000 && opposingTeamAvgScore <= 3499) {
    points = 1;
  } else if (opposingTeamAvgScore >= 3500 && opposingTeamAvgScore <= 5999) {
    points = 2;
  } else if (opposingTeamAvgScore >= 6000 && opposingTeamAvgScore <= 9999) {
    points = 3;
  } else if (opposingTeamAvgScore >= 10000 && opposingTeamAvgScore <= 15000) {
    points = 4;
  } else if (opposingTeamAvgScore > 15000) {
    points = 5;
  }

  return points;
};
