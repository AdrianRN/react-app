import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Cargando",
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots === "..." ? "" : prevDots + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(5px)",
        zIndex: 9998,
      }}
    >
      {/* Contenido de carga */}
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          textAlign: "center",
        }}
      >
        <CircularProgress color="primary" style={{ color: "#e6135c", marginBottom:"30px" }} />
        <Typography
          variant="h6"
          color="primary"
          style={{ color: "#e6135c", display: "flex", whiteSpace: "pre", flexDirection:"row"}}
        >
          <Box>{message}</Box>
          <Box>{"\u00A0"}</Box>
          <Box width={"30px"}>{dots}</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
