import {
  StepConnector as MuiStepConnector,
  StepConnectorProps as MuiStepConnectorProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStepConnector = styled((props: MuiStepConnectorProps) => (
  <MuiStepConnector {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function StepConnector(props: MuiStepConnectorProps) {
  return <CustomStepConnector {...props} />;
}
