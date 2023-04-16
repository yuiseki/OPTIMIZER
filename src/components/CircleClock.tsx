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
        border: "2px solid rgba(219, 219, 219, 0.5)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.8)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.8",
        transform: "perspective(250px) rotateX(10deg) rotateY(-20deg)",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
        }}
      >
        {now.toLocaleDateString()}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
        }}
      >
        {now.toLocaleTimeString()}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          flex: "0 0 40px",
        }}
      >
        {now.getTime()}
      </div>
    </div>
  );
};
