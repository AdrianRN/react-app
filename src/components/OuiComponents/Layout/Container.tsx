import {
  Container as MuiContainer,
  ContainerProps as MuiContainerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomContainer = styled((props: MuiContainerProps) => (
  <MuiContainer {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Container(props: MuiContainerProps) {
  return <CustomContainer {...props} />;
}
