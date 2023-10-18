"use client";

import { getGameInfo } from "@/utils/getGameInfo";
import { PlayerInfo } from "@/utils/types";
import { Button, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

const columns: ColumnsType<PlayerInfo> = [
  {
    title: "Player",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "PTS",
    dataIndex: "pts",
    key: "pts",
  },
  {
    title: "Average PTS",
    dataIndex: "averagePts",
    key: "averagePts",
    onCell: (_, index) => {
      return index === 0 || index === 5 ? { rowSpan: 5 } : { rowSpan: 0 };
    },
  },
];

const Home = () => {
  const [url, setUrl] = useState("");
  const [playersInfo, setPlayersInfo] = useState<PlayerInfo[] | null>(null);
  const [showInput, setShowInput] = useState(true);

  const data: PlayerInfo[] = (playersInfo || []).map((player, index) => ({
    key: String(index + 1),
    nickname: player.nickname,
    pts: player.pts,
  }));

  const averagePtsFirstFive =
    data?.slice(0, 5).reduce((sum, item) => sum + item.pts, 0) / 5;

  const averagePtsLastFive =
    data?.slice(5).reduce((sum, item) => sum + item.pts, 0) / 5;

  data?.forEach((item, index) => {
    item.averagePts = index < 5 ? averagePtsFirstFive : averagePtsLastFive;
  });

  return (
    <div className="m-2">
      {showInput ? (
        <div className="w-1/4">
          <label>
            Enter URL to the game details
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
          <Button
            type="primary"
            className="mt-2"
            onClick={() => {
              getGameInfo(url).then((data) => setPlayersInfo(data || null));
              setShowInput(false);
            }}
          >
            Get info
          </Button>
        </div>
      ) : null}
      {playersInfo && !showInput && (
        <>
          <Table
            bordered
            pagination={false}
            columns={columns}
            dataSource={data}
          />
          <Button
            type="primary"
            className="mt-2"
            onClick={() => {
              setShowInput(true);
              setPlayersInfo(null);
              setUrl("");
            }}
          >
            Go back
          </Button>
        </>
      )}
    </div>
  );
};

export default Home;
