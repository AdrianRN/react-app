import {
  StepIcon as MuiStepIcon,
  StepIconProps as MuiStepIconProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepIcon = styled((props: MuiStepIconProps) => (
  <MuiStepIcon {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function StepIcon(props: MuiStepIconProps) {
  return <CustomStepIcon {...props} />;
}
