import {
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomPagination = styled((props: MuiPaginationProps) => (
  <MuiPagination {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Pagination(props: MuiPaginationProps) {
  return <CustomPagination {...props} />;
}
