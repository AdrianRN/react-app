import React from "react";
import { IIcon } from "./IIcon";

export default function ArrowRight({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 12H19.5M19.5 12L12.75 5.25M19.5 12L12.75 18.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
