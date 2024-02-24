import {
  ListItemAvatar as MuiListItemAvatar,
  ListItemAvatarProps as MuiListItemAvatarProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItemAvatar = styled((props: MuiListItemAvatarProps) => (
  <MuiListItemAvatar {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItemAvatar(props: MuiListItemAvatarProps) {
  return <CustomListItemAvatar {...props} />;
}
