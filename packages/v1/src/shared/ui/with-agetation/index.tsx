"use client";

import { Agentation } from "agentation";

import { isDev } from "@/shared/config/env";

type Props = {
  children: React.ReactNode;
};
export const WithAgetation: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      {isDev && <Agentation />}
    </>
  );
};
