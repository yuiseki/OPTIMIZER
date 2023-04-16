import dynamic from "next/dynamic";

export const BackgroundEffect = dynamic(
  () => import("./BackgroundEffect").then((module) => module.BackgroundEffect),
  {
    ssr: false,
  }
);
