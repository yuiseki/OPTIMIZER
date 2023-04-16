export const BackgroundEffect: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        //backgroundImage:
        //  "url(https://i.gyazo.com/18accaef60cd032294bb594f5cdc9ac3.jpg)",
        //backgroundSize: "cover",
        //backgroundPosition: "center",
        //backgroundRepeat: "no-repeat",
      }}
    >
      <div className="backgroundEffectInnerCircle" />
      <div className="backgroundEffectInnerCircleOuter" />
      <div className="backgroundEffectOuterCircleInner" />
      <div className="backgroundEffectOuterCircle" />
    </div>
  );
};
