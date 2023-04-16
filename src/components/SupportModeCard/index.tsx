import dynamic from "next/dynamic";

export const SupportModeCard = dynamic(
  () => import("./SupportModeCard").then((module) => module.SupportModeCard),
  {
    ssr: false,
  }
);
