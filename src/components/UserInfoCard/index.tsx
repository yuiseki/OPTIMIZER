import dynamic from "next/dynamic";

export const UserInfoCard = dynamic(
  () => import("./UserInfoCard").then((module) => module.UserInfoCard),
  {
    ssr: false,
  }
);
