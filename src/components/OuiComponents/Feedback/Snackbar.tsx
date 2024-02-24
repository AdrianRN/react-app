import {
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
  styled,
} from "@mui/material";
import React from "react";
import { ColorSuccessLight } from "../Theme";

const CustomContainedSnackbar = styled((props: MuiSnackbarProps) => (
  <MuiSnackbar {...props} />
))(({}) => ({
  borderRadius: "20px",
  backgroundColor: `var(--success-bg, ${ColorSuccessLight})`,
  boxShadow: "0px 4px 6px 0px rgba(0, 0, 0, 0.04)",
  color: "white", // Color del texto en el Snackbar
}));

export default function Snackbar(muiProps: MuiSnackbarProps) {
  return <CustomContainedSnackbar {...muiProps}></CustomContainedSnackbar>;
}
