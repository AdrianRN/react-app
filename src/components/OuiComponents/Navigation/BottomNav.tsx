import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationProps as MuiBottomNavigationProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomBottomNavigation = styled((props: MuiBottomNavigationProps) => (
  <MuiBottomNavigation {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function BottomNavigation(props: MuiBottomNavigationProps) {
  return <CustomBottomNavigation {...props} />;
}
