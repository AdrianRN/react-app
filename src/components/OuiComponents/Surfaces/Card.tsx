import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomCard = styled((props: MuiCardProps) => <MuiCard {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Card(props: MuiCardProps) {
  return <CustomCard {...props} />;
}
