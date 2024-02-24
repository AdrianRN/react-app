import {
  MenuList as MuiMenuList,
  MenuListProps as MuiMenuListProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomMenuList = styled((props: MuiMenuListProps) => (
  <MuiMenuList {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function MenuList(props: MuiMenuListProps) {
  return <CustomMenuList {...props} />;
}
