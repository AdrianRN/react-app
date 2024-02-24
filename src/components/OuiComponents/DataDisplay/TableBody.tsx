import {
  TableBody as MuiTableBody,
  TableBodyProps as MuiTableBodyProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableBody = styled((props: MuiTableBodyProps) => (
  <MuiTableBody {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableBody(props: MuiTableBodyProps) {
  return <CustomTableBody {...props} />;
}
