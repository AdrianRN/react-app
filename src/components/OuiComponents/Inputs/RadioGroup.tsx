import {
  RadioGroup as MuiRadioGroup,
  RadioGroupProps as MuiRadioGroupProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomRadioGroup = styled((props: MuiRadioGroupProps) => (
  <MuiRadioGroup {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function RadioGroup(props: MuiRadioGroupProps) {
  return <CustomRadioGroup {...props} />;
}
