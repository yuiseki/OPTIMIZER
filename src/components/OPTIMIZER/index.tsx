/* eslint-disable @next/next/no-img-element */

import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { nextJsonPost } from "@/lib/nextJsonPost";

const initializeSequence = [
  `対話型制度探索社会最適化支援システム。
オプティマイザー、起動しました。

ユーザー認証。
自律分散協調デジタル庁 社会最適化推進局所属。
最適化監視官。
使用許諾確認。
適正ユーザーです。

最適化支援モード、ゴールシーク・エクスプローラー。

落ち着いて状況を整理し、
あなたの抱えている困り事や悩み事を、
具体的かつ簡潔に入力してください。

ユーザーの入力を待機しています…`,
];

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

const scrollToBottom = async () => {
  await sleep(100);
  window.scroll({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

export const OPTIMIZER: React.FC = () => {
  const [dialogueList, setDialogueList] = useState<
    {
      who: string;
      text: string;
      details?: string;
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
    await sleep(100);
    const newDialogueListWithUserAndAssistant = [
      ...newDialogueListWithUser,
      {
        who: "assistant",
        text: "ユーザーの入力に従って、社会の最適化を計算しています…",
      },
    ];
    setDialogueList(newDialogueListWithUserAndAssistant);
    await scrollToBottom();
    await sleep(100);
    const res = await nextJsonPost("/api/completion", { query: newInputText });
    const json = await res.json();
    console.log(json);
    const programsText: string = json.programsText;
    const completionText = json.completionText;

    const newDialogueListWithUserAndAssistantAndResponse = [
      ...newDialogueListWithUserAndAssistant,
      {
        who: "assistant",
        text: completionText,
        details: programsText,
      },
    ];
    setDialogueList(newDialogueListWithUserAndAssistantAndResponse);
    setResponding(false);
    await scrollToBottom();
  }, [inputText, dialogueList]);

  return (
    <>
      <main className={styles.main}>
        <div style={{ width: "100%", marginBottom: "15em" }}>
          {dialogueList.map((dialogueElement, dialogueIdx) => {
            return (
              <div className="dialogueElement" key={dialogueIdx}>
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
                      <div
                        key={`${dialogueIdx}-${rowIdx}`}
                        style={{
                          minHeight: "1em",
                          marginLeft: row.startsWith(" ") ? "1em" : "0px",
                        }}
                      >
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
                  {dialogueElement.details && (
                    <>
                      <details style={{ marginTop: "20px" }}>
                        <summary>各制度の詳細情報</summary>
                        {dialogueElement.details
                          .split("\n")
                          .map((row, rowIdx) => {
                            return (
                              <div
                                key={`${dialogueIdx}-details-${rowIdx}`}
                                style={{
                                  minHeight: "1em",
                                  marginLeft: row.startsWith(" ")
                                    ? "1em"
                                    : "0px",
                                }}
                              >
                                {row}
                                {responding &&
                                  dialogueIdx === dialogueList.length - 1 &&
                                  rowIdx ===
                                    dialogueElement.text.split("\n").length -
                                      1 && <span className="blinkingCursor" />}
                              </div>
                            );
                          })}
                      </details>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "5em",
            width: "100%",
          }}
        >
          <textarea
            value={inputText}
            placeholder={responding ? "..." : "災害で家が全壊しました"}
            onChange={(e) => setInputText(e.currentTarget.value)}
            rows={4}
            style={{
              color: "rgb(219, 219, 219)",
              backgroundColor: "rgba(79, 79, 79, 0.9)",
              borderRadius: "2px",
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
                borderRadius: "2px",
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
