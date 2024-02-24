import {
  TableRow as MuiTableRow,
  TableRowProps as MuiTableRowProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableRow = styled((props: MuiTableRowProps) => (
  <MuiTableRow {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableRow(props: MuiTableRowProps) {
  return <CustomTableRow {...props} />;
}
