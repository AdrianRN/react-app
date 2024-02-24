import {
  Step as MuiStep,
  StepProps as MuiStepProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStep = styled((props: MuiStepProps) => <MuiStep {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Step(props: MuiStepProps) {
  return <CustomStep {...props} />;
}
