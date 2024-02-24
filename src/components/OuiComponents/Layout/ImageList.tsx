import {
  ImageList as MuiImageList,
  ImageListProps as MuiImageListProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomImageList = styled((props: MuiImageListProps) => (
  <MuiImageList {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ImageList(props: MuiImageListProps) {
  return <CustomImageList {...props} />;
}
