import {
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
  styled,
} from "@mui/material";
import React from "react";
import { FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomSkeleton = styled((props: MuiSkeletonProps) => (
  <MuiSkeleton {...props} />
))(({}) => ({
  ...BASE_PROPS,
}));

export default function Skeleton(props: MuiSkeletonProps) {
  return <CustomSkeleton {...props} />;
}
