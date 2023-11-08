export const calculatePointsForScoreDifference = (
  contestantScore: number,
  opposingTeamAvgScore: number
) => {
  const scoreDifference = opposingTeamAvgScore - contestantScore;
  let points = 0;

  if (scoreDifference >= 0 && contestantScore >= 1500) {
    if (opposingTeamAvgScore > 8999) {
      points = (scoreDifference / 400) * 0.5;
    } else if (opposingTeamAvgScore > 5999) {
      points = (scoreDifference / 200) * 0.5;
    } else {
      points = (scoreDifference / 100) * 0.5;
    }
  }

  return +points.toFixed(1);
};
