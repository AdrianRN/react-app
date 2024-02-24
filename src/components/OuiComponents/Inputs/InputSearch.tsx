import {
  IconButton,
  InputAdornment,
  TextField as MuiTexTextField,
  TextFieldProps as MuiTextFieldProps,
  styled,
} from "@mui/material";
import React from "react";
import { Cancel, Search } from "../Icons";
import { ColorGray, ColorGrayDisabled, ColorPureBlack } from "../Theme";

const BASE_PROPS = {
  display: "flex",
  width: "290px",
  paddingRight: "0px",
  alignItems: "center",
  gap: "8px",
  borderRadius: "16px",
};

const CustomContainedTextField = styled((props: MuiTextFieldProps) => (
  <MuiTexTextField {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    ...BASE_PROPS,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      width: "auto",
      borderColor: ColorGray,
    },
    "&:hover fieldset": {
      border: ColorPureBlack,
      borderStyle: "solid",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      border: ColorPureBlack,
      borderStyle: "solid",
      borderWidth: "2px",
    },
    "&.Mui-disabled fieldset": {
      opacity: 0.3,
      background: ColorGrayDisabled,
    },
  },
}));

type InputSearchProps = {
  showClearIcon: boolean; // Definir el tipo del prop showClearIcon
  handleCancelClick: () => void;
  handleSearchClick: () => void;
} & MuiTextFieldProps;

export default function InputSearch({
  showClearIcon,
  handleCancelClick,
  handleSearchClick,
  ...muiProps
}: InputSearchProps) {
  return (
    <CustomContainedTextField
      {...muiProps}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleSearchClick}>
              <Search color={ColorGrayDisabled} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleCancelClick} disableRipple>
              <Cancel
                color={showClearIcon ? ColorGrayDisabled : "transparent"}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    ></CustomContainedTextField>
  );
}
