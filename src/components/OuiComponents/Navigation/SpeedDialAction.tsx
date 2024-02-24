import {
  SpeedDialAction as MuiSpeedDialAction,
  SpeedDialActionProps as MuiSpeedDialActionProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSpeedDialAction = styled((props: MuiSpeedDialActionProps) => (
  <MuiSpeedDialAction {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function SpeedDialAction(props: MuiSpeedDialActionProps) {
  return <CustomSpeedDialAction {...props} />;
}
