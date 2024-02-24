import {
  Rating as MuiRating,
  RatingProps as MuiRatingProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomRating = styled((props: MuiRatingProps) => (
  <MuiRating {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Rating(props: MuiRatingProps) {
  return <CustomRating {...props} />;
}
