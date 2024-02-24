import React from "react";
import { IIcon } from "./IIcon";

export default function DocumentComplete({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.125 2.25H5.625C5.004 2.25 4.5 2.754 4.5 3.375V20.625C4.5 21.246 5.004 21.75 5.625 21.75H18.375C18.996 21.75 19.5 21.246 19.5 20.625V11.625M10.125 2.25H10.5C12.8869 2.25 15.1761 3.19821 16.864 4.88604C18.5518 6.57387 19.5 8.86305 19.5 11.25V11.625M10.125 2.25C11.0201 2.25 11.8785 2.60558 12.5115 3.23851C13.1444 3.87145 13.5 4.72989 13.5 5.625V7.125C13.5 7.746 14.004 8.25 14.625 8.25H16.125C17.0201 8.25 17.8786 8.60558 18.5115 9.23851C19.1444 9.87145 19.5 10.7299 19.5 11.625M9 15L11.25 17.25L15 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
