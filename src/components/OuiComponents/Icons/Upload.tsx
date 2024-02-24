import React from "react";
import { IIcon } from "./IIcon";

export default function Upload({ color = "black" }: IIcon) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="25"
        viewBox="0 0 31 25"
        fill="none"
      >
        <path
          d="M15.5 19.3285V9.11977M15.5 9.11977L19.9286 13.657M15.5 9.11977L11.0714 13.657M7.75 23.8657C6.17048 23.8657 4.63524 23.291 3.43953 22.2474C2.22905 21.2039 1.43191 19.7368 1.18096 18.1488C0.930004 16.5457 1.24 14.9123 2.06667 13.536C2.89334 12.1597 4.16286 11.1161 5.66857 10.617C5.28477 8.59043 5.66858 6.48819 6.77572 4.76406C7.8681 3.03992 9.58048 1.81487 11.5438 1.36115C13.5071 0.907431 15.5738 1.24016 17.2862 2.31396C19.0133 3.38777 20.2533 5.09678 20.7552 7.09315C21.5376 6.83605 22.3791 6.8058 23.191 7.00241C23.9881 7.19902 24.7262 7.63762 25.3019 8.24258C25.8776 8.84754 26.2762 9.60374 26.4533 10.4356C26.6305 11.2674 26.5862 12.1295 26.3057 12.9159C27.5162 13.3847 28.52 14.2771 29.1548 15.4416C29.7895 16.591 30.011 17.9371 29.7748 19.2529C29.5386 20.5535 28.8743 21.7332 27.8705 22.5801C26.8814 23.4271 25.6267 23.8959 24.3276 23.8959H7.75V23.8657Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
