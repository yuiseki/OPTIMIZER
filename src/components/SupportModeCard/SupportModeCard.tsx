import { useEffect, useState } from "react";

export const SupportModeCard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 600px)").matches);
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
        position: "absolute",
        top: 50,
        right: 50,
        width: "300px",
        height: "150px",
        borderRadius: "2px",
        border: "2px solid rgba(219, 219, 219, 0.2)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.2)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.9",
        transform: "perspective(250px) rotateX(-10deg) rotateY(-20deg)",
      }}
    >
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1.3em",
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
          fontSize: "1.3em",
          opacity: "0.9",
          textShadow: "0 0 2px rgba(60, 191, 204, 1)",
          color: "rgb(60, 191, 204)",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
        }}
      >
        GOAL-SEEK EXPLORER
      </div>
    </div>
  );
};
