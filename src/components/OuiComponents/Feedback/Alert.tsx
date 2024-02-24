import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  styled,
} from "@mui/material";
import React from "react";
import {
  ColorError,
  ColorErrorLight,
  ColorInfo,
  ColorInfoLight,
  ColorSuccess,
  ColorSuccessLight,
  ColorWarning,
  ColorWarningLight,
  FontBase,
} from "../Theme";

const CustomContainedAlert = styled((props: MuiAlertProps) => (
  <MuiAlert {...props} />
))(({ severity = "info" }) => {
  const lightColorsMap = {
    error: ColorErrorLight,
    warning: ColorWarningLight,
    info: ColorInfoLight,
    success: ColorSuccessLight,
  };
  const colorsMap = {
    error: ColorError,
    warning: ColorWarning,
    info: ColorInfo,
    success: ColorSuccess,
  };

  return {
    position: "fixed",
    top: "20%",
    right: "30%",
    left: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: lightColorsMap[severity],
    borderRadius: "20px",
    "& .MuiAlert-icon": {
      marginRight: "8px",
      color: colorsMap[severity],
    },
    "& .MuiAlert-message": {
      fontFamily: `${FontBase}, Arial, sans-serif`, // Cambia la fuente aquí
      fontSize: "15px", // Cambia el tamaño de fuente aquí
      fontWeight: "600", // Cambia el peso de fuente aquí
      lineHeight: "24px", // Cambia la altura de línea aquí
      letterSpacing: "0.75px", // Cambia el espaciado de letras aquí
      margin: "0", // Quita el margen superior e inferior
      padding: "0", // Quita el relleno interno
      color: "#000",
    },
  };
});

export default function Alert(muiProps: MuiAlertProps) {
  const { severity = "info" } = muiProps;
  const iconMapping = {
    error: <CancelIcon fontSize="inherit" />,
    warning: <ErrorIcon fontSize="inherit" />,
    info: <InfoOutlinedIcon fontSize="inherit" />,
    success: <CheckCircleIcon fontSize="inherit" />,
  };
  return (
    <CustomContainedAlert
      {...muiProps}
      icon={iconMapping[severity]}
    ></CustomContainedAlert>
  );
}
