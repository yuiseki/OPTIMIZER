import dynamic from "next/dynamic";

export const InitializingEffect = dynamic(
  () => import("./InitializingEffect").then((module) => module.InitializingEffect),
  {
    ssr: false,
  }
);
