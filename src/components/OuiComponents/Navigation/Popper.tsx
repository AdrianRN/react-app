import {
  Popper as MuiPopper,
  PopperProps as MuiPopperProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomPopper = styled((props: MuiPopperProps) => (
  <MuiPopper {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Popper(props: MuiPopperProps) {
  return <CustomPopper {...props} />;
}
