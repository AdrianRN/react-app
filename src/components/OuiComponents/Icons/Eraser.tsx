import React from "react";
import { IIcon } from "./IIcon";

export default function Eraser({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
         d="M25.8814 25.4647H12.7214C12.8091 25.3769 12.8968 25.3331 12.9846 25.2453L26.2762 11.9537C27.2413 10.9886 27.2413 9.36556 26.2762 8.40049L18.6434 0.723802C17.6783 -0.241267 16.0552 -0.241267 15.0902 0.723802L1.75467 14.0154C0.614135 15.156 0 16.6474 0 18.2705C0 19.8936 0.614135 21.3851 1.75467 22.5256L4.47441 25.2453C5.65881 26.4297 7.19415 27 8.72949 27H25.8814C26.3201 27 26.671 26.6491 26.671 26.2104C26.671 25.7717 26.3201 25.4647 25.8814 25.4647ZM16.143 1.82047C16.3184 1.645 16.5816 1.5134 16.8448 1.5134C17.108 1.5134 17.3712 1.60114 17.5467 1.82047L25.2234 9.49716C25.6182 9.89196 25.6182 10.5061 25.2234 10.9009L15.134 20.9903L6.05361 11.866L16.143 1.82047ZM2.85134 21.4289C2.01787 20.5954 1.53534 19.4549 1.53534 18.2705C1.53534 17.0861 2.01787 15.9456 2.85134 15.1121L5.00081 12.9626L14.0374 21.9992L11.8879 24.1487C10.1332 25.9033 7.28188 25.9033 5.57108 24.1487L2.85134 21.4289Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}