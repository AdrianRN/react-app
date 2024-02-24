import React from "react";
import { ColorGrayDisabled } from "../Theme";
import { IIcon } from "./IIcon";

export default function FontItalics({ color = ColorGrayDisabled }: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect x="7.5" y="4.16669" width="8.33333" height="2.5" fill={color} />
      <rect x="4.1665" y="13.3333" width="8.33333" height="2.5" fill={color} />
      <rect
        x="6.6665"
        y="14.3754"
        width="10.4494"
        height="2.5"
        transform="rotate(-65 6.6665 14.3754)"
        fill={color}
      />
    </svg>
  );
}
