import {
  InputAdornment as MuiInputAdornment,
  InputAdornmentProps as MuiInputAdornmentProps,
  styled,
} from "@mui/material";
import React from "react";

const CustomInputAdorment = styled((props: MuiInputAdornmentProps) => (
  <MuiInputAdornment {...props} />
))(({}) => ({}));

export default function InputAdornment(props: MuiInputAdornmentProps) {
  return <CustomInputAdorment {...props} />;
}
