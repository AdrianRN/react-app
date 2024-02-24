import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  styled,
} from "@mui/material";
import React from "react";
import {
  ColorGrayDark,
  ColorGrayLight,
  ColorPink,
  ColorPinkDark,
  ColorWhite,
} from "../Theme";

const CustomSwitch = styled((props: MuiSwitchProps) => (
  <MuiSwitch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: "64px",
  height: "32px",
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(32px)",
      color: ColorWhite,
      "& + .MuiSwitch-track": {
        backgroundColor: ColorPink,
        opacity: 1,
        border: 0,
      },
      "&:hover": {
        "& + .MuiSwitch-track": {
          backgroundColor: ColorPinkDark,
        },
      },

      "&.Mui-disabled + .MuiSwitch-track": {
        color: ColorPink,
      },
    },

    "&.Mui-disabled .MuiSwitch-thumb": {
      color: ColorGrayDark,
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      color: ColorGrayLight,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: "28px",
    height: "28px",
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    backgroundColor: ColorGrayLight,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function Switch(muiProps: MuiSwitchProps) {
  return <CustomSwitch {...muiProps} />;
}
