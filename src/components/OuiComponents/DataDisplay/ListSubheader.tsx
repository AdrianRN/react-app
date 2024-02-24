import {
  ListSubheader as MuiListSubheader,
  ListSubheaderProps as MuiListSubheaderProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListSubheader = styled((props: MuiListSubheaderProps) => (
  <MuiListSubheader {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ListSubheader(props: MuiListSubheaderProps) {
  return <CustomListSubheader {...props} />;
}
