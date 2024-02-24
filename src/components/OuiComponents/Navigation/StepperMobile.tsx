import {
  MobileStepper as MuiMobileStepper,
  MobileStepperProps as MuiMobileStepperProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomMobileStepper = styled((props: MuiMobileStepperProps) => (
  <MuiMobileStepper {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function MobileStepper(props: MuiMobileStepperProps) {
  return <CustomMobileStepper {...props} />;
}
