export const BackgroundEffect: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="backgroundEffectInnerCircle" />
      <div className="backgroundEffectOuterCircle" />
    </div>
  );
};
