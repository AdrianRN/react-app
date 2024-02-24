import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomDialog = styled((props: MuiDialogProps) => (
  <MuiDialog {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Dialog(props: MuiDialogProps) {
  return <CustomDialog {...props} />;
}
