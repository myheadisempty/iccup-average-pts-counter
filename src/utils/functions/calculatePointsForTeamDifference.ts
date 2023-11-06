export const calculatePointsForTeamDifference = (
  contestantTeamAvgScore: number,
  opposingTeamAvgScore: number
) => {
  const scoreDifference = opposingTeamAvgScore - contestantTeamAvgScore;
  let points = 0;

  if (scoreDifference >= 0 && contestantTeamAvgScore >= 2000) {
    if (opposingTeamAvgScore > 8999) {
      points = scoreDifference / 600;
    } else if (opposingTeamAvgScore > 5999) {
      points = scoreDifference / 300;
    } else {
      points = scoreDifference / 150;
    }
  }

  return +points.toFixed(1);
};
