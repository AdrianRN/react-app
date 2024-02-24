import {
  ListItemSecondaryAction as MuiListItemSecondaryAction,
  ListItemSecondaryActionProps as MuiListItemSecondaryActionProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomListItemSecondaryAction = styled(
  (props: MuiListItemSecondaryActionProps) => (
    <MuiListItemSecondaryAction {...props} />
  )
)(({}) => ({
  ...BASE_PROPS,
}));

export default function ListItemSecondaryAction(
  props: MuiListItemSecondaryActionProps
) {
  return <CustomListItemSecondaryAction {...props} />;
}
