import {
  Badge as MuiBadge,
  BadgeProps as MuiBadgeProps,
  styled,
} from "@mui/material";
import React from "react";
import { ColorPink, NavBarItemFont } from "../Theme";

const CustomBadge = styled((props: MuiBadgeProps) => <MuiBadge {...props} />)(
  ({}) => ({
    width: "24px",
    height: "24px",

    "& .MuiBadge-badge": {
      backgroundColor: ColorPink,
      minWidth: "15px",
      minHeight: "15px",
      width: "15px",
      height: "15px",

      top: 8,
      left: 8,

      ...NavBarItemFont,
    },
  })
);

export default function Badge(props: MuiBadgeProps) {
  return <CustomBadge {...props} max={9} />;
}
