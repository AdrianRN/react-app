import {
  TableSortLabel as MuiTableSortLabel,
  TableSortLabelProps as MuiTableSortLabelProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableSortLabel = styled((props: MuiTableSortLabelProps) => (
  <MuiTableSortLabel {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableSortLabel(props: MuiTableSortLabelProps) {
  return <CustomTableSortLabel {...props} />;
}
