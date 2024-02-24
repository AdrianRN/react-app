import { Tab as MuiTab, TabProps as MuiTabProps, styled } from "@mui/material";
import React from "react";
import { FontBase, ColorPureBlack } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "22px",
  letterSpacing: "0.25px",
  color: ColorPureBlack
};
const CustomTab = styled((props: MuiTabProps) => <MuiTab {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
    "&.Mui-selected": {
      color: ColorPureBlack,
    },
  })
);

export default function Tab(props: MuiTabProps) {
  return <CustomTab {...props} />;
}
