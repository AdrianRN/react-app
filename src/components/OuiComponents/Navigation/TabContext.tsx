import {
  TabContext as MuiTabContext,
  TabContextProps as MuiTabContextProps,
} from "@mui/lab/";
import { styled } from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTabContext = styled((props: MuiTabContextProps) => (
  <MuiTabContext {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TabContext(props: MuiTabContextProps) {
  return <CustomTabContext {...props} />;
}
