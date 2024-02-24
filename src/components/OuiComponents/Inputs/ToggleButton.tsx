import {
  ToggleButton as MuiToggleButton,
  ToggleButtonProps as MuiToggleButtonProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomToggleButton = styled((props: MuiToggleButtonProps) => (
  <MuiToggleButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ToggleButton(props: MuiToggleButtonProps) {
  return <CustomToggleButton {...props} />;
}
