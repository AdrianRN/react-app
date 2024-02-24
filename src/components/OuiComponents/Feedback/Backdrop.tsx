import {
  Backdrop as MuiBackdrop,
  BackdropProps as MuiBackdropProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomBackdrop = styled((props: MuiBackdropProps) => (
  <MuiBackdrop {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Backdrop(props: MuiBackdropProps) {
  return <CustomBackdrop {...props} />;
}
