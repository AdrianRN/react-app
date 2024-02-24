import {
  BottomNavigationAction as MuiBottomNavigationAction,
  BottomNavigationActionProps as MuiBottomNavigationActionProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomBottomNavigationAction = styled(
  (props: MuiBottomNavigationActionProps) => (
    <MuiBottomNavigationAction {...props} />
  )
)(({}) => ({
  ...BASE_PROPS,
}));

export default function BottomNavigationAction(
  props: MuiBottomNavigationActionProps
) {
  return <CustomBottomNavigationAction {...props} />;
}
