/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { nextJsonPost } from "@/lib/nextJsonPost";

const initializeSequence = [
  `対話型制度探索社会最適化支援システム。
  オプティマイザー、起動しました。
  ユーザー認証。
  使用許諾確認。
  適正ユーザーです。
  支援モード、ゴールシーク・エクスプローラー。
  落ち着いて状況を整理し、困り事または悩み事を簡潔に入力してください。`,
];

export default function Home() {
  const [dialogueList, setDialogueList] = useState<
    {
      who: string;
      text: string;
    }[]
  >([]);
  const [responseTextListLength, setResponseTextListLength] = useState(1);
  const [lastResponseTextLength, setLastResponseTextLength] = useState(0);
  const [responding, setResponding] = useState(true);

  const [inputText, setInputText] = useState("");

  const initializer = useCallback(() => {
    if (
      responseTextListLength === initializeSequence.length &&
      lastResponseTextLength ===
        initializeSequence[initializeSequence.length - 1].length
    ) {
      setResponding(false);
      return;
    }
    let newResponseText = "";
    if (
      lastResponseTextLength <
      initializeSequence[responseTextListLength - 1].length
    ) {
      newResponseText = initializeSequence[responseTextListLength - 1].slice(
        0,
        lastResponseTextLength + 1
      );
    }

    let newResponseTextList = [];
    if (responseTextListLength === 0) {
      newResponseTextList = [{ who: "assistant", text: newResponseText }];
    } else {
      newResponseTextList = [
        ...initializeSequence.slice(0, responseTextListLength - 1).map((t) => {
          return { who: "assistant", text: t };
        }),
        { who: "assistant", text: newResponseText },
      ];
    }
    setDialogueList(newResponseTextList);
    setResponseTextListLength(newResponseTextList.length);
    if (
      lastResponseTextLength <
      initializeSequence[responseTextListLength - 1].length
    ) {
      newResponseText = initializeSequence[responseTextListLength - 1].slice(
        0,
        lastResponseTextLength + 1
      );
      setResponseTextListLength(newResponseTextList.length);
      setLastResponseTextLength(newResponseText.length);
    } else {
      setResponseTextListLength(newResponseTextList.length + 1);
      setLastResponseTextLength(0);
    }
  }, [lastResponseTextLength, responseTextListLength]);

  useEffect(() => {
    setTimeout(initializer, 50);
  }, [initializer]);

  const submit = useCallback(async () => {
    setResponding(true);
    const newInputText = inputText;
    setInputText("");
    const newDialogueListWithUser = [
      ...dialogueList,
      { who: "user", text: inputText },
    ];
    setDialogueList(newDialogueListWithUser);
    setResponding(false);
    const res = await nextJsonPost("/api/search", { query: newInputText });
    const json = await res.json();
    console.log(json);
    const systemTitles: string = json
      .map((system: [{ metadata: any; pageContent: string }, number]) => {
        return (
          "- " +
          system[0].pageContent
            .split("\n")[1]
            .replace("title: ", "")
            .replaceAll(",", "")
        );
      })
      .join("\n");
    console.log(systemTitles);
    const newDialogueListWithUserAndAssistant = [
      ...newDialogueListWithUser,
      {
        who: "assistant",
        text:
          "あたたの状況を改善し社会を最適化させるために、以下の制度が有用であると推測しました。\n" +
          systemTitles,
      },
    ];
    setDialogueList(newDialogueListWithUserAndAssistant);
  }, [inputText, dialogueList]);

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
      <main className={styles.main}>
        <div style={{ width: "50vw", paddingBottom: "10vh" }}>
          {dialogueList.map((dialogueElement, dialogueIdx) => {
            return (
              <div
                key={dialogueIdx}
                style={{
                  display: "flex",
                  marginBottom: "10px",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  {dialogueElement.who === "assistant" ? (
                    <img
                      width={20}
                      height={20}
                      src="https://i.gyazo.com/311db640f4fc0083ea572e6bb2e433d0.png"
                      alt="ai icon"
                    />
                  ) : (
                    <img
                      width={20}
                      height={20}
                      src="https://i.gyazo.com/8960181a3459473ada71a8718df8785b.png"
                      alt="user icon"
                    />
                  )}
                </div>
                <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                  {dialogueElement.text.split("\n").map((row, rowIdx) => {
                    return (
                      <div key={`${dialogueIdx}-${rowIdx}`}>
                        {row}
                        {responding &&
                          dialogueIdx === dialogueList.length - 1 &&
                          rowIdx ===
                            dialogueElement.text.split("\n").length - 1 && (
                            <span className={styles.blinkingCursor} />
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "relative",
            bottom: "5em",
            width: "50vw",
          }}
        >
          <textarea
            value={inputText}
            placeholder="災害で家が全壊しました"
            onChange={(e) => setInputText(e.currentTarget.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "12px 8px",
              borderRadius: "6px",
              fontSize: "1.2em",
            }}
          />
          <div style={{ textAlign: "right", width: "100%" }}>
            <input
              type="button"
              value="最適化の支援を要求"
              onClick={submit}
              disabled={responding}
              style={{
                display: "block",
                textAlign: "right",
                padding: "5px",
                marginRight: 0,
                marginLeft: "auto",
                fontSize: "1em",
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
