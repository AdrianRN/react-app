import React from "react";
import { IIcon } from "./IIcon";

export default function Star({ color = "black" }: IIcon) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="33"
        viewBox="0 0 43 41"
        fill="none"
      >
        <g clipPath="url(#clip0_895_1524)">
          <path
            d="M9.39999 40.2C8.89999 40.2 8.49999 40.1 8.09999 39.8C7.39999 39.3 6.99999 38.4 7.19999 37.5L9.89999 25.6L0.69999 17.6C-1.03712e-05 17 -0.20001 16.1 -1.03712e-05 15.2C0.29999 14.4 0.99999 13.7 1.89999 13.7L14 12.6L19 1.4C19.3 0.5 20.1 0 21 0C21.9 0 22.7 0.5 23.1 1.4L27.9 12.6L40 13.7C40.9 13.8 41.6 14.4 41.9 15.2C42.2 16 41.9 17 41.3 17.6L32.1 25.6L34.8 37.5C35 38.4 34.7 39.3 33.9 39.8C33.2 40.3 32.2 40.4 31.4 39.9L21 33.7L10.5 40C10.2 40.1 9.79999 40.2 9.39999 40.2Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_895_1524">
            <rect width="43" height="41" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
}
