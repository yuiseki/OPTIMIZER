/* eslint-disable @next/next/no-img-element */
import Head from "next/head";

import { SupportModeCard } from "@/components/SupportModeCard";
import { BackgroundEffect } from "@/components/BackgroundEffect";
import { CircleClock } from "@/components/CircleClock";
import { OPTIMIZER } from "@/components/OPTIMIZER";
import { UserInfoCard } from "@/components/UserInfoCard";
import { LocationMap } from "@/components/LocationMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>対話型制度探索社会最適化支援システム オプティマイザー</title>
        <meta
          name="description"
          content="対話型制度探索社会最適化支援システム オプティマイザー 起動しました。 落ち着いて状況を整理し、あなたの抱えている困り事や悩み事を、具体的かつ簡潔に入力してください。"
        />
        <meta
          property="og:title"
          content="対話型制度探索社会最適化支援システム オプティマイザー"
        />
        <meta
          property="og:description"
          content="対話型制度探索社会最適化支援システム オプティマイザー 起動しました。 落ち着いて状況を整理し、あなたの抱えている困り事や悩み事を、具体的かつ簡潔に入力してください。"
        />
        <meta
          property="og:image"
          content="https://i.gyazo.com/b1f6cfdd3c3d3ab3d3e877782b450f68.png"
        />
        <meta property="og:url" content="https://optimizer.yuiseki.net/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BackgroundEffect />
      <CircleClock />
      <SupportModeCard />
      <UserInfoCard />
      <LocationMap />
      <OPTIMIZER />
    </>
  );
}
