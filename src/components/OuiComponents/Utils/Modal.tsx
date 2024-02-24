import {
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomModal = styled((props: MuiModalProps) => <MuiModal {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
  })
);

export default function Modal(props: MuiModalProps) {
  return <CustomModal {...props} />;
}
