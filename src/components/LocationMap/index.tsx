import dynamic from "next/dynamic";
export const LocationMap = dynamic(
  () => import("./LocationMap").then((module) => module.LocationMap),
  {
    ssr: false,
  }
);
