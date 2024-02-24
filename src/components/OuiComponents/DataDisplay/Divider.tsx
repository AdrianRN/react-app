import {
  Divider as MuiDivider,
  DividerProps as MuiDividerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomDivider = styled((props: MuiDividerProps) => (
  <MuiDivider {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Divider(props: MuiDividerProps) {
  return <CustomDivider {...props} />;
}
