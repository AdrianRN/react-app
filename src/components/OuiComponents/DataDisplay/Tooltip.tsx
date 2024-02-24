import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTooltip = styled((props: MuiTooltipProps) => (
  <MuiTooltip {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Tooltip(props: MuiTooltipProps) {
  return <CustomTooltip {...props} />;
}
