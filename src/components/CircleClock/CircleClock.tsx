import { useEffect, useState } from "react";

export const CircleClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 100);
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
        gap: "6px",
        position: "absolute",
        top: 180,
        right: 50,
        width: "160px",
        height: "60px",
        borderRadius: "2px",
        border: "2px solid rgba(219, 219, 219, 0.2)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.2)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.8",
        transform: "perspective(300px) rotateX(-13deg) rotateY(-28deg)",
        fontFamily: "D7MR",
        fontSize: "0.5em",
        fontWeight: "bold",
      }}
    >
      <div
        style={{
          flex: "0 0 15px",
        }}
      >
        <span className="circleClockDate">{`${now.getFullYear()}-${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${now.getDate()}`}</span>{" "}
        <span className="circleClockTime">{now.toLocaleTimeString()}</span>
      </div>
      <div
        style={{
          flex: "0 0 15px",
        }}
      >
        <span className="circleClockUnixTime">{now.getTime()}</span>
      </div>
    </div>
  );
};
