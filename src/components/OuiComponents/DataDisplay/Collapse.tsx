import {
  Collapse as MuiCollapse,
  CollapseProps as MuiCollapseProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomCollapse = styled((props: MuiCollapseProps) => (
  <MuiCollapse {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Collapse(props: MuiCollapseProps) {
  return <CustomCollapse {...props} />;
}
