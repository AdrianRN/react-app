import {
  ListItemIcon as MuiListItemIcon,
  ListItemIconProps as MuiListItemIconProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItemIcon = styled((props: MuiListItemIconProps) => (
  <MuiListItemIcon {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItemIcon(props: MuiListItemIconProps) {
  return <CustomListItemIcon {...props} />;
}
