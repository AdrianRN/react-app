import {
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomPaper = styled((props: MuiPaperProps) => <MuiPaper {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Paper(props: MuiPaperProps) {
  return <CustomPaper {...props} />;
}
