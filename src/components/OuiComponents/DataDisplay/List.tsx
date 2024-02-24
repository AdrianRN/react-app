import {
  List as MuiList,
  ListProps as MuiListProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomList = styled((props: MuiListProps) => <MuiList {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function List(props: MuiListProps) {
  return <CustomList {...props} />;
}
