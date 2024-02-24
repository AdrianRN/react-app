import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  styled,
} from "@mui/material";
import React from "react";
import {
  ColorPink,
  ColorPinkDark,
  ColorPinkDisabled,
  ColorPinkLight,
  LinkSmallFont,
} from "../Theme";

const BASE_PROPS = {
  borderRadius: "16px",
  padding: "16px 32px",
  height: "64px",
  ...LinkSmallFont,
};
const CustomContainedButton = styled(MuiButton)(() => ({
  ...BASE_PROPS,
  textTransform: "none",

  color: "white",
  backgroundColor: ColorPink,
  border: "8px solid transparent",

  "&:hover": {
    backgroundColor: ColorPinkDark,
  },
  "&:focus": {
    backgroundColor: ColorPink,
    border: "8px solid " + ColorPinkLight,
  },
  "&: disabled": {
    color: "white",
    backgroundColor: ColorPinkDisabled,
  },
}));

const CustomOutlinedButton = styled((props: MuiButtonProps) => (
  <MuiButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
  textTransform: "none",

  color: ColorPink,
  backgroundColor: "white",
  border: "2px solid " + ColorPink,

  "&:hover": {
    color: ColorPinkDark,
    backgroundColor: "white",
    border: "2px solid " + ColorPinkDark,
  },
  "&:focus": {
    color: ColorPink,
    border: "2px solid " + ColorPinkLight,
  },
  "&: disabled": {
    color: ColorPinkDisabled,
    border: "2px solid " + ColorPinkDisabled,
  },
}));

const CustomTextButton = styled((props: MuiButtonProps) => (
  <MuiButton {...props} />
))(({}) => ({
  ...BASE_PROPS,
  textTransform: "none",

  color: ColorPink,
  backgroundColor: "white",

  "&:hover": {
    backgroundColor: "white",
    color: ColorPinkDark,
  },
  "&:focus": {
    color: ColorPink,
  },
  "&: disabled": { color: ColorPinkDisabled },
}));

export default function Button(muiProps: MuiButtonProps) {
  const customProps = {
    ...muiProps,
    disableRipple: true,
    disableElevation: true,
  };
  return muiProps.variant === "contained" ? (
    <CustomContainedButton {...customProps} />
  ) : muiProps.variant === "outlined" ? (
    <CustomOutlinedButton {...customProps} />
  ) : muiProps.variant === "text" ? (
    <CustomTextButton {...customProps} />
  ) : (
    <CustomContainedButton {...customProps} />
  );
}
