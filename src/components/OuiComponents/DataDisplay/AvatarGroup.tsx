import {
  AvatarGroup as MuiAvatarGroup,
  AvatarGroupProps as MuiAvatarGroupProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomAvatarGroup = styled((props: MuiAvatarGroupProps) => (
  <MuiAvatarGroup {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function AvatarGroup(props: MuiAvatarGroupProps) {
  return <CustomAvatarGroup {...props} />;
}
