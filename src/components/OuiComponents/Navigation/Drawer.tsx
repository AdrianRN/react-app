import {
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomDrawer = styled((props: MuiDrawerProps) => (
  <MuiDrawer {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Drawer(props: MuiDrawerProps) {
  return <CustomDrawer {...props} />;
}
