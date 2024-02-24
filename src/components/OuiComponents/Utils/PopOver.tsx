import {
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomPopover = styled((props: MuiPopoverProps) => (
  <MuiPopover {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Popover(props: MuiPopoverProps) {
  return <CustomPopover {...props} />;
}
