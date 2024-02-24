import React from "react";
import { IIcon } from "./IIcon";

export default function Notification({ color = "black" }: IIcon) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.8575 17.082C16.7207 16.8614 18.5513 16.4217 20.3115 15.772C18.8209 14.1208 17.9972 11.9745 18.0005 9.75V9.05V9C18.0005 7.4087 17.3683 5.88258 16.2431 4.75736C15.1179 3.63214 13.5918 3 12.0005 3C10.4092 3 8.88305 3.63214 7.75784 4.75736C6.63262 5.88258 6.00048 7.4087 6.00048 9V9.75C6.00349 11.9746 5.17946 14.121 3.68848 15.772C5.42148 16.412 7.24848 16.857 9.14348 17.082M14.8575 17.082C12.9595 17.3071 11.0415 17.3071 9.14348 17.082M14.8575 17.082C15.0016 17.5319 15.0374 18.0094 14.9621 18.4757C14.8867 18.942 14.7023 19.384 14.4239 19.7656C14.1454 20.1472 13.7808 20.4576 13.3597 20.6716C12.9386 20.8856 12.4729 20.9972 12.0005 20.9972C11.5281 20.9972 11.0624 20.8856 10.6413 20.6716C10.2202 20.4576 9.85555 20.1472 9.5771 19.7656C9.29865 19.384 9.11424 18.942 9.03889 18.4757C8.96354 18.0094 8.99937 17.5319 9.14348 17.082"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
