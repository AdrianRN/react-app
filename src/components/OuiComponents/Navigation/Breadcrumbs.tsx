import {
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps as MuiBreadcrumbsProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomBreadcrumbs = styled((props: MuiBreadcrumbsProps) => (
  <MuiBreadcrumbs {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Breadcrumbs(props: MuiBreadcrumbsProps) {
  return <CustomBreadcrumbs {...props} />;
}
