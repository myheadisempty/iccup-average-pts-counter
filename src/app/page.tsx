"use client";

import { PointsContext } from "@/utils/contexts/PointsContext";
import { calculateItemBuildPoints } from "@/utils/functions/calculateItemBuildPoints";
import { calculatePointsForKDAScore } from "@/utils/functions/calculatePointsForKDAScore";
import { calculatePointsForOpposingTeamAverage } from "@/utils/functions/calculatePointsForOpposingTeamAverage";
import { calculatePointsForScoreDifference } from "@/utils/functions/calculatePointsForScoreDifference";
import { calculatePointsForTeamDifference } from "@/utils/functions/calculatePointsForTeamDifference";
import { checkGameCompletion } from "@/utils/functions/checkGameCompletion";
import { getGameInfo } from "@/utils/getGameInfo";
import { GameData } from "@/utils/types";
import { Input, Button, Descriptions, DescriptionsProps, Timeline } from "antd";
import { useState, useContext, useEffect } from "react";

const Home = () => {
  const { points, addPoints, updatePoints } = useContext(PointsContext);

  const [gameData, setGameData] = useState<GameData>();
  const [url, setUrl] = useState("");
  const [nick, setNick] = useState("");
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
  const [inputVisible, setInputVisible] = useState(true);

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

  const calculateTotalPoints = () => {
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

      const totalPoints = Object.values(updatedPointsData).reduce(
        (acc, val) => acc + val,
        0
      );
      addPoints(totalPoints);
    }
  };

  useEffect(() => {
    calculateTotalPoints();
  }, [gameData]);

  const handleFirstButtonClick = () => {
    getGameInfo(url, nick).then((data) => {
      setGameData(data as GameData);
      setInputVisible(false);
    });
  };

  const handleSecondButtonClick = () => {
    setInputVisible(true);
    updatePoints(0);
  };

  return (
    <div className="m-2">
      {inputVisible && (
        <div className="space-y-4">
          <div>
            <label htmlFor="url">Enter URL</label>
            <div className="shadow-sm sm:max-w-md mb-2">
              <Input
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <label htmlFor="nick">Enter contestant nick:</label>
            <div className="shadow-sm sm:max-w-md">
              <Input
                name="nick"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleFirstButtonClick}>Get info</Button>
        </div>
      )}
      {!inputVisible && gameData && (
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
                    children: `Total points: ${points.toFixed(1)}`,
                    className: "p-0",
                  },
                ]}
              />
              <Button onClick={handleSecondButtonClick} type="default">
                Go back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
