import {
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSlider = styled((props: MuiSliderProps) => (
  <MuiSlider {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Slider(props: MuiSliderProps) {
  return <CustomSlider {...props} />;
}
