import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomLink = styled((props: MuiLinkProps) => <MuiLink {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Link(props: MuiLinkProps) {
  return <CustomLink {...props} />;
}
