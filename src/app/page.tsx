"use client";

import GameDetails from "@/components/GameDetails";
import { Input, Button, Tabs, TabsProps } from "antd";
import { useState } from "react";

const Home = () => {
  const [firstUrl, setFirstUrl] = useState("");
  const [secondUrl, setSecondUrl] = useState("");
  const [nick, setNick] = useState("");
  const [inputVisible, setInputVisible] = useState(true);

  const handleClick = () => {
    setInputVisible(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Game 1",
      children: (
        <GameDetails
          url={firstUrl}
          nick={nick}
          updateInputVisible={setInputVisible}
        />
      ),
    },
    {
      key: "2",
      label: "Game 2",
      children: (
        <GameDetails
          url={secondUrl}
          nick={nick}
          updateInputVisible={setInputVisible}
        />
      ),
    },
  ];

  return (
    <div className="m-2">
      {inputVisible && (
        <form className="space-y-4">
          <div>
            <label htmlFor="firstUrl">Enter first game URL</label>
            <div className="shadow-sm sm:max-w-md mb-2">
              <Input
                name="firstUrl"
                value={firstUrl}
                onChange={(e) => setFirstUrl(e.target.value)}
              />
            </div>
            <label htmlFor="secondUrl">Enter second game URL</label>
            <div className="shadow-sm sm:max-w-md mb-2">
              <Input
                name="secondUrl"
                value={secondUrl}
                onChange={(e) => setSecondUrl(e.target.value)}
              />
            </div>
            <label htmlFor="nick">Enter contestant nick</label>
            <div className="shadow-sm sm:max-w-md">
              <Input
                name="nick"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleClick}>Get info</Button>
        </form>
      )}
      {!inputVisible && <Tabs items={items} />}
    </div>
  );
};

export default Home;
