import { useEffect, useState } from "react";

export const SupportModeCard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 1000px)").matches);
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 50,
        right: 20,
        gap: "2px",
        width: "340px",
        height: "260px",
        borderRadius: "2px",
        border: "2px solid rgba(219, 219, 219, 0.2)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.2)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.9",
        transform:
          "perspective(300px) rotateX(-5deg) rotateY(-15deg) rotateZ(-10deg)",
      }}
      className="optimizerStatus"
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.4em",
          opacity: "0.9",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        OPTIMIZER
      </div>
      <div
        style={{ fontSize: "12px", paddingLeft: "30px", paddingRight: "30px" }}
      >
        An interactive welfare program exploration and social optimization
        support system.
      </div>
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1.1em",
          opacity: "0.9",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        OpenAI API:
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.2em",
          opacity: "0.9",
          textShadow: "0 0 4px rgba(60, 191, 204, 1)",
          color: "rgb(60, 191, 204)",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
        }}
      >
        ONLINE
      </div>
      <div
        style={{
          width: "100%",
          fontSize: "12px",
          textAlign: "left",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        Embedding Model: `text-embedding-ada-002`
      </div>
      <div
        style={{
          width: "100%",
          fontSize: "12px",
          textAlign: "left",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        Large Language Model: `text-davinci-003`
      </div>
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1.2em",
          opacity: "0.9",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        SUPPORT MODE:
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.2em",
          opacity: "0.9",
          textShadow: "0 0 4px rgba(60, 191, 204, 1)",
          color: "rgb(60, 191, 204)",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
        }}
      >
        {/* 
        GOAL-SEEK EXPLORER
        */}
        COMPLETION RESOLVER
      </div>
      <div
        style={{
          width: "100%",
          fontSize: "12px",
          textAlign: "left",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        Vectorized welfare programs: 323
      </div>
    </div>
  );
};
