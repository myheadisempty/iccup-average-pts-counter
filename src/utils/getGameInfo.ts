import { load } from "cheerio";
import { PlayerInfo } from "./types";

export const getGameInfo = async (url: string) => {
  const urlInstance = new URL(url);

  try {
    const res = await fetch(`/api/${urlInstance.pathname}`);
    const html = await res.text();

    const $ = load(html);

    const players: PlayerInfo[] = [];

    $(".details-nick").each((_, element) => {
      const nickname = $(element).find("a").text().trim();
      const pts = Number(
        $(element)
          .find(
            ".a3, .a2, .a1, .b3, .b2, .b1, .c3, .c2, .c1, .d3, .d2, .d1, .cpu, .s1, .s2, .s3"
          )
          .attr("title")
      );

      players.push({
        nickname,
        pts,
      });
    });

    return players;
  } catch (error) {
    console.error(error);
  }
};
