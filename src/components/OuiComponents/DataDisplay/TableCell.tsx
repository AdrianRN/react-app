import {
  TableCell as MuiTableCell,
  TableCellProps as MuiTableCellProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableCell = styled((props: MuiTableCellProps) => (
  <MuiTableCell {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableCell(props: MuiTableCellProps) {
  return <CustomTableCell {...props} />;
}
