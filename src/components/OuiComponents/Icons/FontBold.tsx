import React from "react";
import { ColorGrayDisabled } from "../Theme";
import { IIcon } from "./IIcon";

export default function FontBold({ color = ColorGrayDisabled }: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8142 4.16669H5.8335V15.8334H10.8142C12.6658 15.8334 14.1668 14.3323 14.1668 12.4807C14.1668 11.6862 13.8847 10.9175 13.3706 10.3116L13.1062 10L13.3706 9.68843C13.8847 9.08259 14.1668 8.31387 14.1668 7.51934C14.1668 5.66772 12.6658 4.16669 10.8142 4.16669ZM8.3335 6.25002H10.4168C11.1072 6.25002 11.6668 6.80966 11.6668 7.50002C11.6668 8.19038 11.1072 8.75002 10.4168 8.75002H8.3335V6.25002ZM8.3335 11.25H10.4168C11.1072 11.25 11.6668 11.8097 11.6668 12.5C11.6668 13.1904 11.1072 13.75 10.4168 13.75H8.3335V11.25Z"
        fill={color}
      />
    </svg>
  );
}
