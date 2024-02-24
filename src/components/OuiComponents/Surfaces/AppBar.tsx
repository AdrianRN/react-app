import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomAppBar = styled((props: MuiAppBarProps) => (
  <MuiAppBar {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function AppBar(props: MuiAppBarProps) {
  return <CustomAppBar {...props} />;
}
