import {
  TableFooter as MuiTableFooter,
  TableFooterProps as MuiTableFooterProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableFooter = styled((props: MuiTableFooterProps) => (
  <MuiTableFooter {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableFooter(props: MuiTableFooterProps) {
  return <CustomTableFooter {...props} />;
}
