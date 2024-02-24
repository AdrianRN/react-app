import {
  StepContent as MuiStepContent,
  StepContentProps as MuiStepContentProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepContent = styled((props: MuiStepContentProps) => (
  <MuiStepContent {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function StepContent(props: MuiStepContentProps) {
  return <CustomStepContent {...props} />;
}
