import {
  TableContainer as MuiTableContainer,
  TableContainerProps as MuiTableContainerProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableContainer = styled((props: MuiTableContainerProps) => (
  <MuiTableContainer {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableContainer(props: MuiTableContainerProps) {
  return <CustomTableContainer {...props} />;
}
