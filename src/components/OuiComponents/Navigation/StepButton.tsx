import {
  StepButton as MuiStepButton,
  StepButtonProps as MuiStepButtonProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepButton = styled((props: MuiStepButtonProps) => (
  <MuiStepButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function StepButton(props: MuiStepButtonProps) {
  return <CustomStepButton {...props} />;
}
