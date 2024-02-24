import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTypography = styled((props: MuiTypographyProps) => (
  <MuiTypography {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Typography(props: MuiTypographyProps) {
  return <CustomTypography {...props} />;
}
