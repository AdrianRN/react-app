import {
  Grid as MuiGrid,
  GridProps as MuiGridProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomGrid = styled((props: MuiGridProps) => <MuiGrid {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Grid(props: MuiGridProps) {
  return <CustomGrid {...props} />;
}
