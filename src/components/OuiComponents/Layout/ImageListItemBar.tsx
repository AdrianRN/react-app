import {
  ImageListItemBar as MuiImageListItemBar,
  ImageListItemBarProps as MuiImageListItemBarProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomImageListItemBar = styled((props: MuiImageListItemBarProps) => (
  <MuiImageListItemBar {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ImageListItemBar(props: MuiImageListItemBarProps) {
  return <CustomImageListItemBar {...props} />;
}
