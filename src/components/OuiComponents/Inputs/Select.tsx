import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  styled,
} from "@mui/material";
import React from "react";
import {
  ColorGray,
  ColorGrayDisabled,
  ColorPink,
  ColorPureBlack,
  ColorPureWhite,
} from "../Theme";

const BASE_PROPS = {
  width: "217px",
  height: "56px",
  borderRadius: "16px",
  background: ColorPureWhite,
  display: "inline-flex",
  paddingLeft: "0px",
  justifyContent: "center",
  gap: "205px",
  "& .MuiSvgIcon-root": {
    width: "24px",
    height: "24px",
  },
};

const CustomContainedSelect = styled((props: MuiSelectProps) => (
  <MuiSelect {...props} />
))(({ theme }) => ({
  ...BASE_PROPS,
  
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "1px solid " + ColorGray,
    },
    "&:hover fieldset": {
      border: ColorPink,
      borderStyle: "solid",
    },
    "&.Mui-focused fieldset": {
      border: ColorPureBlack,
      borderStyle: "solid",
    },
    "&.Mui-disabled fieldset": {
      opacity: 0.3,
      background: ColorGrayDisabled,
      border: ColorPureBlack,
    },
  },
}));

export default function Select(muiProps: MuiSelectProps) {
  return (
    <CustomContainedSelect
      {...muiProps}
      IconComponent={KeyboardArrowDownIcon}
    />
  );
}
