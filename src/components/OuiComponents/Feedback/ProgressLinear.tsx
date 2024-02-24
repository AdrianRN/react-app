import {
  LinearProgress as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomLinearProgress = styled((props: MuiLinearProgressProps) => (
  <MuiLinearProgress {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function LinearProgress(props: MuiLinearProgressProps) {
  return <CustomLinearProgress {...props} />;
}
