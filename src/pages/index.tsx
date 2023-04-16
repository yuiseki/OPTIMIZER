/* eslint-disable @next/next/no-img-element */
import Head from "next/head";

import { SupportModeCard } from "@/components/SupportModeCard";
import { BackgroundEffect } from "@/components/BackgroundEffect";
import { CircleClock } from "@/components/CircleClock";
import { OPTIMIZER } from "@/components/OPTIMIZER";
import { UserInfoCard } from "@/components/UserInfoCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>対話型制度探索社会最適化支援システム オプティマイザー</title>
        <meta
          name="description"
          content="対話型制度探索社会最適化支援システム オプティマイザー"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BackgroundEffect />
      <CircleClock />
      <SupportModeCard />
      <UserInfoCard />
      <OPTIMIZER />
    </>
  );
}
