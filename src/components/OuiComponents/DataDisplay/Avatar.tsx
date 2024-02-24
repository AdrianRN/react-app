import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomAvatar = styled((props: MuiAvatarProps) => (
  <MuiAvatar {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Avatar(props: MuiAvatarProps) {
  return <CustomAvatar {...props} />;
}
