import {
  ButtonGroup as MuiButtonGroup,
  ButtonGroupProps as MuiButtonGroupProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomButtonGroup = styled((props: MuiButtonGroupProps) => (
  <MuiButtonGroup {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ButtonGroup(props: MuiButtonGroupProps) {
  return <CustomButtonGroup {...props} />;
}
