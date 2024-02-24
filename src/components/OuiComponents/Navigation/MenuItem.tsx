import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomMenuItem = styled((props: MuiMenuItemProps) => (
  <MuiMenuItem {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function MenuItem(props: MuiMenuItemProps) {
  return <CustomMenuItem {...props} />;
}
