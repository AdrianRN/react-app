import {
  TabScrollButton as MuiTabScrollButton,
  TabScrollButtonProps as MuiTabScrollButtonProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTabScrollButton = styled((props: MuiTabScrollButtonProps) => (
  <MuiTabScrollButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TabScrollButton(props: MuiTabScrollButtonProps) {
  return <CustomTabScrollButton {...props} />;
}
