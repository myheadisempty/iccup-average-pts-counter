"use client";

import { store } from "@/store/store";
import { FC, PropsWithChildren } from "react";
import { Provider } from "react-redux";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
