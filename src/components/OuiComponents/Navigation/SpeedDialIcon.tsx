import {
  SpeedDialIcon as MuiSpeedDialIcon,
  SpeedDialIconProps as MuiSpeedDialIconProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSpeedDialIcon = styled((props: MuiSpeedDialIconProps) => (
  <MuiSpeedDialIcon {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function SpeedDialIcon(props: MuiSpeedDialIconProps) {
  return <CustomSpeedDialIcon {...props} />;
}
