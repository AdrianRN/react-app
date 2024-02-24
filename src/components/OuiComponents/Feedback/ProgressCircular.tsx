import {
  CircularProgress as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomCircularProgress = styled((props: MuiCircularProgressProps) => (
  <MuiCircularProgress {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function CircularProgress(props: MuiCircularProgressProps) {
  return <CustomCircularProgress {...props} />;
}
