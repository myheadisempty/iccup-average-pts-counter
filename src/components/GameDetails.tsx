import { addPoints, resetPoints } from "@/store/slices/totalPointsSlice";
import { RootState } from "@/store/store";
import { calculateItemBuildPoints } from "@/utils/functions/calculateItemBuildPoints";
import { calculatePointsForKDAScore } from "@/utils/functions/calculatePointsForKDAScore";
import { calculatePointsForOpposingTeamAverage } from "@/utils/functions/calculatePointsForOpposingTeamAverage";
import { calculatePointsForScoreDifference } from "@/utils/functions/calculatePointsForScoreDifference";
import { calculatePointsForTeamDifference } from "@/utils/functions/calculatePointsForTeamDifference";
import { checkGameCompletion } from "@/utils/functions/checkGameCompletion";
import { getGameInfo } from "@/utils/getGameInfo";
import { GameData } from "@/utils/types";
import { Button, Descriptions, DescriptionsProps, Timeline } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type GameDetailsProps = {
  url: string;
  nick: string;
  updateInputVisible: (state: boolean) => void;
};

const GameDetails: FC<GameDetailsProps> = ({
  url,
  nick,
  updateInputVisible,
}) => {
  const [gameData, setGameData] = useState<GameData>();
  const [pointsData, setPointsData] = useState({
    scoreDifferencePoints: 0,
    opposingTeamAveragePoints: 0,
    teamDifferencePoints: 0,
    gameCompletionPoints: 0,
    gameDurationPoints: 0,
    feedingPlayersPoints: 0,
    gameVictoryPoints: 0,
    itemBuildPoints: 0,
    KDAScorePoints: 0,
  });

  const points = useSelector((state: RootState) => state.totalPoints.points);
  const dispatch = useDispatch();

  const contestantInfo: DescriptionsProps["items"] = [
    {
      label: "Pts",
      children: gameData?.contestant.pts,
      className: "shadow-sm",
    },
    {
      label: "Items",
      children: (
        <>
          {gameData?.contestant.items.map((item, index) => {
            return (
              <p key={index}>
                {item.name} ({item.price})
              </p>
            );
          })}
        </>
      ),
      className: "shadow-sm",
    },
    {
      label: "Won the game?",
      children: gameData?.contestant.isVictory ? "Yes" : "No",
      className: "shadow-sm",
    },
    {
      label: "Average K/D/A",
      children: gameData?.contestant.avgKDA,
      className: "shadow-sm",
    },
  ];

  const teamsInfo: DescriptionsProps["items"] = [
    {
      label: "Contestant's team average pts",
      children: gameData?.teams.contestantTeamAvgPts,
      className: "shadow-sm",
    },
    {
      label: "Opposing team average pts",
      children: gameData?.teams.opposingTeamAvgPts,
      className: "shadow-sm",
    },
    {
      label: "Feeders",
      children: (
        <>
          {gameData?.teams.feeders.map((feeder, index) => {
            return (
              <div key={index}>
                <p>Nick: {feeder.nick}</p>
                <p>
                  K/D: {feeder.kills}/{feeder.deaths}
                </p>
              </div>
            );
          })}
        </>
      ),
      className: "shadow-sm",
    },
    {
      label: "Leavers",
      children: (
        <>
          {gameData?.teams.leavers.map((leaver, index) => {
            return (
              <div key={index}>
                <p>Nick: {leaver.nick}</p>
                <p>
                  K/D/A: {leaver.kills}/{leaver.deaths}/{leaver.assists}
                </p>
              </div>
            );
          })}
        </>
      ),
      className: "shadow-sm",
    },
  ];

  const calculateTotalPoints = useCallback(() => {
    if (gameData) {
      const { contestant, teams, gameMinDuration } = gameData;
      const updatedPointsData = {
        scoreDifferencePoints: calculatePointsForScoreDifference(
          contestant.pts,
          teams.opposingTeamAvgPts
        ),
        opposingTeamAveragePoints: calculatePointsForOpposingTeamAverage(
          teams.opposingTeamAvgPts
        ),
        teamDifferencePoints: calculatePointsForTeamDifference(
          teams.contestantTeamAvgPts,
          teams.opposingTeamAvgPts
        ),
        gameCompletionPoints: checkGameCompletion(teams.leavers),
        gameDurationPoints: gameMinDuration > 35 ? 1 : 0,
        feedingPlayersPoints: teams.feeders.length * -0.5,
        gameVictoryPoints: contestant.isVictory ? 0.5 : 0,
        itemBuildPoints: calculateItemBuildPoints(contestant.items),
        KDAScorePoints: calculatePointsForKDAScore(contestant.avgKDA),
      };
      setPointsData(updatedPointsData);
    }
  }, [gameData]);

  const totalPoints = useMemo(() => {
    if (gameData) {
      const pointsValues = Object.values(pointsData);
      return pointsValues.reduce((acc, val) => acc + val, 0);
    }
    return 0;
  }, [gameData, pointsData]);

  useEffect(() => {
    getGameInfo(url, nick).then((data) => {
      setGameData(data as GameData);
    });
  }, []);

  useEffect(() => {
    calculateTotalPoints();
    dispatch(addPoints(totalPoints));
  }, [gameData, totalPoints]);

  const handleClick = () => {
    dispatch(resetPoints());
    updateInputVisible(true);
  };

  return (
    <>
      {gameData && (
        <div className="flex">
          <div className="w-3/4 mr-10">
            <Descriptions
              title="Game details"
              bordered
              items={[
                {
                  label: "Game length",
                  children: gameData.gameMinDuration + " " + "minutes",
                  className: "shadow-sm",
                },
              ]}
            />
            <Descriptions
              title="Contestant info"
              column={1}
              bordered
              items={contestantInfo}
            />
            <Descriptions
              title="Info about teams"
              column={1}
              bordered
              items={teamsInfo}
            />
          </div>
          <div className="w-1/4">
            <div className="sticky top-4">
              <Timeline
                items={[
                  {
                    children: `+${pointsData.scoreDifferencePoints} points`,
                  },
                  {
                    children: `+${pointsData.opposingTeamAveragePoints} points`,
                  },
                  {
                    children: `+${pointsData.teamDifferencePoints} points`,
                  },
                  {
                    children: `+${pointsData.gameCompletionPoints} points`,
                  },
                  {
                    children: `+${pointsData.gameDurationPoints} points`,
                  },
                  {
                    children: `${
                      pointsData.feedingPlayersPoints > 0 ? "+" : ""
                    }${pointsData.feedingPlayersPoints} points`,
                  },
                  {
                    children: `+${pointsData.gameVictoryPoints} points`,
                  },
                  {
                    children: `+${pointsData.KDAScorePoints} points`,
                  },
                  {
                    children: `+${pointsData.itemBuildPoints} points`,
                  },
                  {
                    children: `Points per game: ${totalPoints}`,
                  },
                  {
                    children: `Total points: ${points}`,
                    className: "p-0",
                  },
                ]}
              />
              <Button onClick={handleClick}>Go back</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameDetails;
