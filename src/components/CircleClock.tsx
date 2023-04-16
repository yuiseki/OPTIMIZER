import { useEffect, useState } from "react";

export const CircleClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 100);
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
        bottom: 50,
        right: 50,
        width: "200px",
        height: "200px",
        borderRadius: "250px",
        border: "2px solid rgba(219, 219, 219, 0.2)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.2)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.8",
        transform: "perspective(250px) rotateX(5deg) rotateY(-15deg)",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        {now.toLocaleDateString()}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        {now.toLocaleTimeString()}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
          textShadow: "0 0 2px rgba(255, 255, 255, 1)",
        }}
      >
        {now.getTime()}
      </div>
    </div>
  );
};
