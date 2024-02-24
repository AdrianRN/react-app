import {
  PaginationItem as MuiPaginationItem,
  PaginationItemProps as MuiPaginationItemProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomPaginationItem = styled((props: MuiPaginationItemProps) => (
  <MuiPaginationItem {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function PaginationItem(props: MuiPaginationItemProps) {
  return <CustomPaginationItem {...props} />;
}
