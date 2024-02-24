import React from "react";
import { ColorGrayDisabled } from "../Theme";
import { IIcon } from "./IIcon";

export default function FontOrderList({ color = ColorGrayDisabled }: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.3335 4.16669H18.3335"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3335 10H18.3335"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3335 15.8333H18.3335"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6665 2.5H2.9165V5.83333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6665 14.1667H3.74984V15.8334M1.6665 17.5H3.74984V15.8334M2.49984 15.8334H3.74984"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6665 8.33331H3.74984L2.08317 11.25H4.1665"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
