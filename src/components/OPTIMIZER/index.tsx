/* eslint-disable @next/next/no-img-element */

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
  落ち着いて状況を整理し、困り事または悩み事を、簡潔に入力してください。
  ユーザーの入力を待機しています…`,
];

export const OPTIMIZER: React.FC = () => {
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
    setTimeout(initializer, 80);
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
          "あなたの状況を改善し、社会を最適化するために、以下の制度を活用することを検討してください。\n" +
          systemTitles,
      },
    ];
    setDialogueList(newDialogueListWithUserAndAssistant);
  }, [inputText, dialogueList]);

  return (
    <>
      <main className={styles.main}>
        <div style={{ width: "100%", paddingBottom: "10vh" }}>
          {dialogueList.map((dialogueElement, dialogueIdx) => {
            return (
              <div
                key={dialogueIdx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "30px",
                  padding: "12px",
                  borderRadius: "2px",
                  border: "2px solid rgba(219, 219, 219, 0.8)",
                  boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.3)",
                  backgroundColor: "rgba(79, 79, 79, 0.8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyItems: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: "10px",
                      width: "44px",
                      height: "44px",
                      marginLeft: "8px",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      backdropFilter: "blur(4px)",
                      backgroundColor:
                        dialogueElement.who === "assistant"
                          ? "rgba(5, 251, 255, 0.8)"
                          : "rgba(0, 0, 0, 0.5)",
                      border:
                        dialogueElement.who === "assistant"
                          ? "2px solid rgba(5, 251, 255, 0.6)"
                          : "2px solid rgba(0, 0, 0, 0.1)",
                      boxShadow:
                        dialogueElement.who === "assistant"
                          ? "0 2px 6px 0 rgba(5, 251, 255, 0.6)"
                          : "0 2px 6px 0 rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {dialogueElement.who === "assistant" ? (
                      <img
                        width={30}
                        height={30}
                        src="https://i.gyazo.com/311db640f4fc0083ea572e6bb2e433d0.png"
                        alt="ai icon"
                      />
                    ) : (
                      <img
                        width={30}
                        height={30}
                        src="https://i.gyazo.com/8960181a3459473ada71a8718df8785b.png"
                        alt="user icon"
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.4em",
                      marginLeft: "4px",
                    }}
                  >
                    {dialogueElement.who === "assistant" ? "OPTIMIZER" : "USER"}
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "2px solid rgba(219, 219, 219, 0.8)",
                    boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.3)",
                  }}
                />
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    paddingLeft: "66px",
                  }}
                >
                  {dialogueElement.text.split("\n").map((row, rowIdx) => {
                    return (
                      <div key={`${dialogueIdx}-${rowIdx}`}>
                        {row}
                        {responding &&
                          dialogueIdx === dialogueList.length - 1 &&
                          rowIdx ===
                            dialogueElement.text.split("\n").length - 1 && (
                            <span className="blinkingCursor" />
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
            width: "100%",
          }}
        >
          <textarea
            value={inputText}
            placeholder="災害で家が全壊しました"
            onChange={(e) => setInputText(e.currentTarget.value)}
            rows={4}
            style={{
              color: "rgb(219, 219, 219)",
              backgroundColor: "rgba(79, 79, 79, 0.8)",
              borderRadius: "6px",
              border: "2px solid rgba(219, 219, 219, 0.8)",
              boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.3)",
              width: "100%",
              padding: "12px 8px",
              fontSize: "1.2em",
            }}
          />
          <div style={{ textAlign: "right", width: "100%", marginTop: "30px" }}>
            <input
              type="button"
              value="最適化の支援を要求"
              onClick={submit}
              disabled={responding}
              style={{
                color: "rgb(253, 254, 255)",
                backgroundColor: "rgba(5, 251, 255, 0.8)",
                border: "2px solid rgba(5, 251, 255, 0.8)",
                boxShadow: "0 2px 6px 0 rgba(5, 251, 255, 0.8)",
                display: "block",
                textAlign: "right",
                padding: "8px",
                marginRight: 0,
                marginLeft: "auto",
                fontSize: "1.1em",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
};