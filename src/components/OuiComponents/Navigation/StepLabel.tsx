import {
  StepLabel as MuiStepLabel,
  StepLabelProps as MuiStepLabelProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepLabel = styled((props: MuiStepLabelProps) => (
  <MuiStepLabel {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function StepLabel(props: MuiStepLabelProps) {
  return <CustomStepLabel {...props} />;
}
