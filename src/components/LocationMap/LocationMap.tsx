import Map from "react-map-gl";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";

export const LocationMap = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 1000px)").matches);
  }, []);

  if (isMobile) {
    return null;
  }
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: -55,
          left: -55,
          width: "500px",
          height: "500px",
          borderRadius: "500px",
          border: "1px dashed rgba(60, 191, 204, 1)",
          boxShadow: "0 2px 2px 0 rgba(60, 191, 204, 1)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          opacity: "0.6",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -45,
          left: -45,
          width: "480px",
          height: "480px",
          borderRadius: "480px",
          border: "1px solid rgba(255, 255, 255, 1)",
          boxShadow: "0 2px 2px 0 rgba(255, 255, 255, 1)",
          backgroundColor: "transparent",
          opacity: "0.4",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -15,
          left: -15,
          width: "420px",
          height: "420px",
          borderRadius: "420px",
          border: "1px dotted rgba(255, 255, 255, 1)",
          boxShadow: "0 2px 2px 0 rgba(255, 255, 255, 1)",
          backgroundColor: "transparent",
          opacity: "0.4",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: -5,
          left: -5,
          width: "400px",
          height: "400px",
          borderRadius: "400px",
          border: "1px dashed rgba(219, 219, 219, 0.4)",
          boxShadow: "0 2px 3px 0 rgba(219, 219, 219, 0.4)",
          backgroundColor: "rgba(79, 79, 79, 0.8)",
          opacity: "0.9",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 55,
            left: 50,
            zIndex: "100",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              textShadow: "0 0 2px rgba(255, 255, 255, 0.4)",
            }}
          >
            AREA
          </div>
          <div
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              textShadow: "0 0 1px rgba(255, 255, 255, 0.4)",
            }}
          >
            LEVEL
          </div>
          <div
            style={{
              fontSize: "3.5em",
              fontWeight: "bold",
              textShadow: "0 0 1px rgba(255, 255, 255, 0.4)",
            }}
          >
            01
          </div>
          <div
            style={{
              fontSize: "1em",
              textShadow: "0 0 1px rgba(255, 255, 255, 1)",
            }}
          >
            Taito, Tokyo
          </div>
          <div
            style={{
              textShadow: "0 0 4px rgba(60, 191, 204, 1)",
              color: "rgb(60, 191, 204)",
            }}
          >
            SUPPORTED
          </div>
        </div>
        <Map
          mapLib={maplibregl}
          initialViewState={{
            longitude: 139.7896,
            latitude: 35.71614,
            zoom: 13,
          }}
          mapStyle="./map_styles/fiord-color-gl-style/style.json"
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "500px",
            zIndex: "99",
            opacity: "0.9",
          }}
        />
      </div>
    </>
  );
};
