export const UserInfoCard: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        bottom: 50,
        right: 50,
        width: "300px",
        height: "120px",
        borderRadius: "2px",
        border: "2px solid rgba(219, 219, 219, 0.2)",
        boxShadow: "0 2px 6px 0 rgba(219, 219, 219, 0.2)",
        backgroundColor: "rgba(79, 79, 79, 0.8)",
        opacity: "0.9",
        transform:
          "perspective(300px) rotateX(10deg) rotateY(-20deg) rotateZ(10deg)",
      }}
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
        USER
      </div>
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1.2em",
          opacity: "0.9",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
          textShadow: "0 0 4px rgba(60, 191, 204, 1)",
          color: "rgb(60, 191, 204)",
        }}
      >
        AUTHENTICATED
      </div>
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1.2em",
          opacity: "0.9",
          width: "100%",
          textAlign: "left",
          paddingLeft: "30px",
          textShadow: "0 0 4px rgba(60, 191, 204, 1)",
          color: "rgb(60, 191, 204)",
        }}
      >
        PERMISSION VALIDATED
      </div>
    </div>
  );
};
