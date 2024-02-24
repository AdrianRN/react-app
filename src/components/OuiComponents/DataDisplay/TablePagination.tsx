import {
  TablePagination as MuiTablePagination,
  TablePaginationProps as MuiTablePaginationProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTablePagination = styled((props: MuiTablePaginationProps) => (
  <MuiTablePagination {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TablePagination(props: MuiTablePaginationProps) {
  return <CustomTablePagination {...props} />;
}
