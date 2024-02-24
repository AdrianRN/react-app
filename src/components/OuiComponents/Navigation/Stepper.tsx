import {
  Stepper as MuiStepper,
  StepperProps as MuiStepperProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepper = styled((props: MuiStepperProps) => (
  <MuiStepper {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Stepper(props: MuiStepperProps) {
  return <CustomStepper {...props} />;
}
