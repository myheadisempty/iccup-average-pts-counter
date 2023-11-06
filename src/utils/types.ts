export type Leaver = {
  nick: string;
  kills: number;
  deaths: number;
  assists: number;
};

export type Feeder = {
  nick: string;
  kills: number;
  deaths: number;
};

export type Item = {
  name: string;
  price: number;
};

type Contestant = {
  pts: number;
  items: Item[];
  isVictory: boolean;
  avgKDA: number;
};

type Teams = {
  contestantTeamAvgPts: number;
  opposingTeamAvgPts: number;
  feeders: Feeder[];
  leavers: Leaver[];
};

export type GameData = {
  contestant: Contestant;
  gameMinDuration: number;
  teams: Teams;
};
