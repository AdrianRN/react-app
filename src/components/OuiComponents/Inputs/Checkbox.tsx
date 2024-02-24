import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import React from "react";
import CheckedIcon from "../Icons/CheckedIcon";
import UncheckedIcon from "../Icons/UncheckedIcon";

export default function Checkbox(muiProps: MuiCheckboxProps) {
  return (
    <MuiCheckbox
      {...muiProps}
      checkedIcon={<CheckedIcon />}
      icon={<UncheckedIcon />}
    />
  );
}
