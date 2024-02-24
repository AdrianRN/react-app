import { Box as MuiBox, BoxProps as MuiBoxProps, styled } from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomBox = styled((props: MuiBoxProps) => <MuiBox {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Box(props: MuiBoxProps) {
  return <CustomBox {...props} />;
}
