import { Fab as MuiFAB, FabProps as MuiFABProps, styled } from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomFAB = styled((props: MuiFABProps) => <MuiFAB {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Fab(props: MuiFABProps) {
  return <CustomFAB {...props} />;
}
