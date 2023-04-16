import dynamic from "next/dynamic";
export const CircleClock = dynamic(
  () => import("./CircleClock").then((module) => module.CircleClock),
  {
    ssr: false,
  }
);
