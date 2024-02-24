import {
  ImageListItem as MuiImageListItem,
  ImageListItemProps as MuiImageListItemProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomImageListItem = styled((props: MuiImageListItemProps) => (
  <MuiImageListItem {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function ImageListItem(props: MuiImageListItemProps) {
  return <CustomImageListItem {...props} />;
}
