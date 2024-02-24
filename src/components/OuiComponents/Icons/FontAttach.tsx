import React from "react";
import { ColorGrayDisabled } from "../Theme";
import { IIcon } from "./IIcon";

export default function FontAttach({ color = ColorGrayDisabled }: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15.3125 10.6159L8.90169 17.0267C8.19842 17.73 7.24459 18.1251 6.25002 18.1251C5.25546 18.1251 4.30162 17.73 3.59836 17.0267C2.89509 16.3234 2.5 15.3696 2.5 14.375C2.5 13.3805 2.89509 12.4266 3.59836 11.7234L12.715 2.6067C12.9472 2.37458 13.2229 2.19048 13.5263 2.06491C13.8296 1.93933 14.1548 1.87474 14.4831 1.87482C14.8114 1.87489 15.1365 1.93964 15.4399 2.06536C15.7432 2.19108 16.0187 2.37531 16.2509 2.60753C16.483 2.83975 16.6671 3.11541 16.7926 3.41878C16.9182 3.72215 16.9828 4.04729 16.9827 4.37562C16.9827 4.70395 16.9179 5.02905 16.7922 5.33236C16.6665 5.63567 16.4822 5.91125 16.25 6.14336L7.12669 15.2667C6.89001 15.4936 6.57366 15.6176 6.24581 15.6134C5.91797 15.6093 5.60488 15.4765 5.37402 15.2437C5.14317 15.0108 5.01303 14.6966 5.01166 14.3688C5.01029 14.0409 5.13779 13.7256 5.36669 13.4909L11.875 6.98253M7.13419 15.2584L7.12586 15.2667"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}