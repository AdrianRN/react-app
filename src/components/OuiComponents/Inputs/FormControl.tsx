import {
  FormControl as MuiFormControl,
  FormControlProps as MuiFormControlProps,
  styled,
} from "@mui/material";
import React from "react";

const CustomFormControl = styled((props: MuiFormControlProps) => (
  <MuiFormControl {...props} />
))(({}) => ({}));

export default function FormControl(props: MuiFormControlProps) {
  return <CustomFormControl {...props} />;
}
