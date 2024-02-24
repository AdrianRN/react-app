import {
  SwipeableDrawer as MuiSwipeableDrawer,
  SwipeableDrawerProps as MuiSwipeableDrawerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSwipeableDrawer = styled((props: MuiSwipeableDrawerProps) => (
  <MuiSwipeableDrawer {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function SwipeableDrawer(props: MuiSwipeableDrawerProps) {
  return <CustomSwipeableDrawer {...props} />;
}
