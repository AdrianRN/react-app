import {
  Stack as MuiStack,
  StackProps as MuiStackProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomStack = styled((props: MuiStackProps) => <MuiStack {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Stack(props: MuiStackProps) {
  return <CustomStack {...props} />;
}
