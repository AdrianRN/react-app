import React from "react";
import { IIcon } from "./IIcon";

export default function Delete({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.74 8.99997L14.394 18M9.606 18L9.26 8.99997M19.228 5.78997C19.57 5.84197 19.91 5.89697 20.25 5.95597M19.228 5.78997L18.16 19.673C18.1164 20.2382 17.8611 20.7661 17.445 21.1512C17.029 21.5363 16.4829 21.7501 15.916 21.75H8.084C7.5171 21.7501 6.97102 21.5363 6.55498 21.1512C6.13894 20.7661 5.88359 20.2382 5.84 19.673L4.772 5.78997M19.228 5.78997C18.0739 5.61549 16.9138 5.48307 15.75 5.39297M4.772 5.78997C4.43 5.84097 4.09 5.89597 3.75 5.95497M4.772 5.78997C5.92613 5.61549 7.08623 5.48307 8.25 5.39297M15.75 5.39297V4.47697C15.75 3.29697 14.84 2.31297 13.66 2.27597C12.5536 2.24061 11.4464 2.24061 10.34 2.27597C9.16 2.31297 8.25 3.29797 8.25 4.47697V5.39297M15.75 5.39297C13.2537 5.20005 10.7463 5.20005 8.25 5.39297"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
