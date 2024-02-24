import {
  TableHead as MuiTableHead,
  TableHeadProps as MuiTableHeadProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTableHead = styled((props: MuiTableHeadProps) => (
  <MuiTableHead {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function TableHead(props: MuiTableHeadProps) {
  return <CustomTableHead {...props} />;
}
