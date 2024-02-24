import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomToggleButtonGroup = styled((props: MuiToggleButtonGroupProps) => (
  <MuiToggleButtonGroup {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ToggleButtonGroup(props: MuiToggleButtonGroupProps) {
  return <CustomToggleButtonGroup {...props} />;
}
