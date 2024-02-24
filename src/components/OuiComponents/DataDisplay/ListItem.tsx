import {
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItem = styled((props: MuiListItemProps) => (
  <MuiListItem {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItem(props: MuiListItemProps) {
  return <CustomListItem {...props} />;
}
