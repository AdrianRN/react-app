import {
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase, ColorPink } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomTabs = styled((props: MuiTabsProps) => <MuiTabs {...props} 
  
  />)(
  ({}) => ({
    ...BASE_PROPS,
    "& .MuiTabs-indicator":{
      backgroundColor: ColorPink  
    },
    "& button:focus":{
      backgroundColor: "#EFF0F6",
      borderRadius: "16px"
    },
  })
);

export default function Tabs(props: MuiTabsProps) {
  return <CustomTabs {...props} />;
}
