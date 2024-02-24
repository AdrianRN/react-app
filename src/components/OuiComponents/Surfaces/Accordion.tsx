import {
  Accordion as MuiAccordion,
  AccordionProps as MuiAccordionProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomAccordion = styled((props: MuiAccordionProps) => (
  <MuiAccordion {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Accordion(props: MuiAccordionProps) {
  return <CustomAccordion {...props} />;
}
