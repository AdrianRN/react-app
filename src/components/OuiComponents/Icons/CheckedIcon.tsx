import React from "react";
import { ColorPink } from "../Theme";

function CheckedIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill={ColorPink} />
      <path
        d="M22 12L13.75 21L10 16.9091"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default CheckedIcon;
