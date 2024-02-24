import {
  TabPanel as MuiTabPanel,
  TabPanelProps as MuiTabPanelProps,
} from "@mui/lab/";
import { styled } from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTabPanel = styled((props: MuiTabPanelProps) => (
  <MuiTabPanel {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TabPanel(props: MuiTabPanelProps) {
  return <CustomTabPanel {...props} />;
}
