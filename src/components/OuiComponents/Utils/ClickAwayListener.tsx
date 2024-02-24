import {
  ClickAwayListener as MuiClickAwayListener,
  ClickAwayListenerProps as MuiClickAwayListenerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomClickAwayListener = styled((props: MuiClickAwayListenerProps) => (
  <MuiClickAwayListener {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ClickAwayListener(props: MuiClickAwayListenerProps) {
  return <CustomClickAwayListener {...props} />;
}
