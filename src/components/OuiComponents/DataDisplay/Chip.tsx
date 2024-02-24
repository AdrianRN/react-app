import {
  Chip as MuiChip,
  ChipProps as MuiChipProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomChip = styled((props: MuiChipProps) => <MuiChip {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Chip(props: MuiChipProps) {
  return <CustomChip {...props} />;
}
