import {
  ListItemButton as MuiListItemButton,
  ListItemButtonProps as MuiListItemButtonProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItemButton = styled((props: MuiListItemButtonProps) => (
  <MuiListItemButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItemButton(props: MuiListItemButtonProps) {
  return <CustomListItemButton {...props} />;
}
