import { load } from "cheerio";
import itemsData from "../../dotaItems.json";
import { Feeder, Item, Leaver } from "./types";

export const getGameInfo = async (url: string, contestantNick: string) => {
  try {
    const urlInstance = new URL(url);
    const res = await fetch(`/api/${urlInstance.pathname}`);
    const html = await res.text();

    const $ = load(html);

    const parseTeamsInfo = () => {
      const sentinelTeamHTML: string[] = [];
      const scourgeTeamHTML: string[] = [];

      const leavers: Leaver[] = [];

      $(".match-player.gameLeaver").each((_, leaver) => {
        const nick = $(leaver).find(".player-login__nick").text();
        const kills = parseInt($(leaver).find(".kda-text.-green").text());
        const deaths = parseInt($(leaver).find(".kda-text.-red").text());
        const assists = parseInt($(leaver).find(".kda-text.-blue").text());

        leavers.push({
          nick: nick,
          kills: kills,
          deaths: deaths,
          assists: assists,
        });
      });

      $(".details-team-one").each((_, playerInfo) => {
        sentinelTeamHTML.push($(playerInfo).html()!);
      });

      $(".details-team-two").each((_, playerInfo) => {
        scourgeTeamHTML.push($(playerInfo).html()!);
      });

      const calculateAveragePoints = (
        teamHTML: string[],
        contestantNick: string
      ) => {
        const team = [];
        let foundContestant = false;

        for (let i = 0; i < teamHTML.length; i++) {
          const htmlString = teamHTML[i];
          const $ = load(htmlString);
          const playerNickElements = $(".player-login__nick");
          const playerPointsElements = $(".player-rank-current");

          for (let j = 0; j < playerNickElements.length; j++) {
            const playerElement = playerNickElements[j];
            const playerNickname = $(playerElement).text();
            const playerPoints = parseInt($(playerPointsElements[j]).text());

            if (playerNickname === contestantNick) {
              foundContestant = true;
            }

            team.push({ name: playerNickname, points: playerPoints });
          }
        }

        const totalPoints = team.reduce(
          (acc, player) => acc + player.points,
          0
        );
        const averagePoints = team.length > 0 ? totalPoints / team.length : 0;

        return { foundContestant, averagePoints };
      };

      const sentinelTeamResult = calculateAveragePoints(
        sentinelTeamHTML,
        contestantNick
      );
      const scourgeTeamResult = calculateAveragePoints(
        scourgeTeamHTML,
        contestantNick
      );

      const feeders: Feeder[] = [];

      function processTeam(teamHTML: string[]) {
        for (let i = 0; i < teamHTML.length; i++) {
          const htmlString = teamHTML[i];
          const $ = load(htmlString);
          $(".match-player").each((_, feeder) => {
            const nick = $(feeder).find(".player-login__nick").text();
            const kills = parseInt($(feeder).find(".kda-text.-green").text());
            const deaths = parseInt($(feeder).find(".kda-text.-red").text());

            if (
              (kills == 0 && deaths >= 6) ||
              (kills == 1 && deaths >= 7) ||
              (kills == 2 && deaths >= 8) ||
              (kills == 3 && deaths >= 10) ||
              (kills == 4 && deaths >= 15) ||
              (kills == 5 && deaths >= 18)
            ) {
              feeders.push({
                nick: nick,
                kills: kills,
                deaths: deaths,
              });
            }
          });
        }
      }

      if (sentinelTeamResult.foundContestant) {
        processTeam(scourgeTeamHTML);
      }

      if (scourgeTeamResult.foundContestant) {
        processTeam(sentinelTeamHTML);
      }

      const contestantTeamAvgPts = sentinelTeamResult.foundContestant
        ? sentinelTeamResult.averagePoints
        : scourgeTeamResult.averagePoints;

      const opposingTeamAvgPts = scourgeTeamResult.foundContestant
        ? sentinelTeamResult.averagePoints
        : scourgeTeamResult.averagePoints;

      return {
        contestantTeamAvgPts,
        opposingTeamAvgPts,
        feeders,
        leavers,
      };
    };

    const gameMinDuration = parseInt(
      $("tr")
        .eq(3)
        .find("td")
        .eq(1)
        .text()
        .match(/(\d+)m/)![1]
    );

    const parseContestantInfo = () => {
      const contestant = {
        pts: null as number | null,
        items: [] as Item[],
        isVictory: false,
        avgKDA: null as number | null,
      };

      $(".details-team-one, .details-team-two").each((_, teamElement) => {
        const nick = $(teamElement).find(".player-login__nick").text();

        if (nick === contestantNick) {
          const currentPts = parseInt(
            $(teamElement).find(".player-rank-current").text()
          );
          const points = parseInt(
            $(teamElement).find(".player-rank__pts").text()
          );
          const itemsInBlock = $(teamElement)
            .find(".player-items img")
            .map((_, img) => $(img).attr("alt"))
            .get();
          const itemsWithPrices = itemsInBlock.map((itemName) => {
            const item = itemsData.items.find((item) => item.name === itemName);
            return item || { name: itemName, price: 0 };
          });
          const kills = parseInt(
            $(teamElement).find(".kda-text.-green").text()
          );
          const deaths = parseInt($(teamElement).find(".kda-text.-red").text());
          const assists = parseInt(
            $(teamElement).find(".kda-text.-blue").text()
          );
          contestant.items.push(...itemsWithPrices);
          contestant.pts = currentPts;
          contestant.isVictory = points > 0;
          contestant.avgKDA = +((2 * (kills + assists)) / (deaths * 2)).toFixed(
            1
          );
        }
      });

      return contestant;
    };

    return {
      contestant: parseContestantInfo(),
      gameMinDuration,
      teams: parseTeamsInfo(),
    };
  } catch (error) {
    console.error(error);
  }
};
