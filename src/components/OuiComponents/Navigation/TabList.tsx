import {
  TabList as MuiTabList,
  TabListProps as MuiTabListProps,
} from "@mui/lab/";
import { styled } from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTabList = styled((props: MuiTabListProps) => (
  <MuiTabList {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TabList(props: MuiTabListProps) {
  return <CustomTabList {...props} />;
}
