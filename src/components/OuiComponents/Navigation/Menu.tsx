import {
  Menu as MuiMenu,
  MenuProps as MuiMenuProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomMenu = styled((props: MuiMenuProps) => <MuiMenu {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Menu(props: MuiMenuProps) {
  return <CustomMenu {...props} />;
}
