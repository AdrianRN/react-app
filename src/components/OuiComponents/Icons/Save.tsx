import React from "react";
import { IIcon } from "./IIcon";

export default function Save({ color = "black" }: IIcon) {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 8.25H7.5C6.90326 8.25 6.33097 8.48705 5.90901 8.90901C5.48705 9.33097 5.25 9.90326 5.25 10.5V19.5C5.25 20.0967 5.48705 20.669 5.90901 21.091C6.33097 21.5129 6.90326 21.75 7.5 21.75H16.5C17.0967 21.75 17.669 21.5129 18.091 21.091C18.5129 20.669 18.75 20.0967 18.75 19.5V10.5C18.75 9.90326 18.5129 9.33097 18.091 8.90901C17.669 8.48705 17.0967 8.25 16.5 8.25H15M9 12L12 15M12 15L15 12M12 15V2.25"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
