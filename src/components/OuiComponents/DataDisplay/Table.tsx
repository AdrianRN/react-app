import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTable = styled((props: MuiTableProps) => <MuiTable {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Table(props: MuiTableProps) {
  return <CustomTable {...props} />;
}
