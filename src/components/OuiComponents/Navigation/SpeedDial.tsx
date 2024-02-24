import {
  SpeedDial as MuiSpeedDial,
  SpeedDialProps as MuiSpeedDialProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSpeedDial = styled((props: MuiSpeedDialProps) => (
  <MuiSpeedDial {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function SpeedDial(props: MuiSpeedDialProps) {
  return <CustomSpeedDial {...props} />;
}
