import React from "react";
import { IIcon } from "./IIcon";

export default function Print({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.72 13.829C6.48 13.859 6.24 13.891 6 13.925M6.72 13.829C10.2263 13.3891 13.7737 13.3891 17.28 13.829M6.72 13.829L6.34 18M17.28 13.829C17.52 13.859 17.76 13.891 18 13.925M17.28 13.829L17.66 18L17.889 20.523C17.9032 20.6787 17.8848 20.8356 17.8349 20.9837C17.7851 21.1319 17.7049 21.268 17.5995 21.3834C17.4942 21.4989 17.3659 21.5911 17.2229 21.6542C17.0799 21.7173 16.9253 21.7499 16.769 21.75H7.231C6.569 21.75 6.051 21.182 6.111 20.523L6.34 18M6.34 18H5.25C4.65326 18 4.08097 17.7629 3.65901 17.341C3.23705 16.919 3 16.3467 3 15.75V9.456C3 8.375 3.768 7.441 4.837 7.281C5.47295 7.18587 6.11074 7.10352 6.75 7.034M17.658 18H18.749C19.0446 18.0001 19.3372 17.942 19.6103 17.829C19.8834 17.716 20.1316 17.5503 20.3406 17.3413C20.5497 17.1324 20.7155 16.8843 20.8286 16.6113C20.9418 16.3382 21 16.0456 21 15.75V9.456C21 8.375 20.232 7.441 19.163 7.281C18.5271 7.18588 17.8893 7.10353 17.25 7.034M17.25 7.034C13.7603 6.6543 10.2397 6.6543 6.75 7.034M17.25 7.034V3.375C17.25 2.754 16.746 2.25 16.125 2.25H7.875C7.254 2.25 6.75 2.754 6.75 3.375V7.034M18 10.5H18.008V10.508H18V10.5ZM15 10.5H15.008V10.508H15V10.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}