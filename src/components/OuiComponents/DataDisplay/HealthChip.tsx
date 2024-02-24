import {
  Chip as MuiChip,
  ChipProps as MuiChipProps,
  styled,
} from "@mui/material";
import React from "react";
import { ColorPureWhite, FontBase, LinkSmallFont } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomChip = styled((props: MuiChipProps) => <MuiChip {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
    width: "66px",
    height: "33px",

    ...LinkSmallFont,
    color: ColorPureWhite,
  })
);

interface HealthChipProps {
  label: string;
  color: string;
}

export default function HealthChip(props: HealthChipProps) {
  return (
    <CustomChip label={props.label} sx={{ backgroundColor: props.color }} />
  );
}
