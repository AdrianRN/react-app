import React from "react";
import { IIcon } from "./IIcon";

export default function ArrowUp({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19.5V4.5M12 4.5L5.25 11.25M12 4.5L18.75 11.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
