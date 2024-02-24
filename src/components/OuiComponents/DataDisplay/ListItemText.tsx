import {
  ListItemText as MuiListItemText,
  ListItemTextProps as MuiListItemTextProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItemText = styled((props: MuiListItemTextProps) => (
  <MuiListItemText {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItemText(props: MuiListItemTextProps) {
  return <CustomListItemText {...props} />;
}
