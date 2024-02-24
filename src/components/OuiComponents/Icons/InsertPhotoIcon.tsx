import React from "react";
import { IIcon } from "./IIcon";

export default function InsertPhotoIcon({ color = "black" }: IIcon) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="20"
        viewBox="0 0 25 20"
        fill="none"
      >
        <path
          d="M23.2882 0.388672H1.7118C0.845211 0.388672 0.142578 1.09126 0.142578 1.95785V18.0422C0.142578 18.9087 0.845211 19.6113 1.7118 19.6113H23.2882C24.1548 19.6113 24.8575 18.9087 24.8575 18.0421V1.95785C24.8575 1.09126 24.1549 0.388672 23.2882 0.388672ZM23.2882 1.95785V13.3702L20.1957 10.5586C19.7309 10.1361 19.0161 10.153 18.572 10.5975L15.4422 13.7268L9.27101 6.35552C8.80453 5.79844 7.9501 5.79297 7.47663 6.34336L1.7118 13.0431V1.95785H23.2882ZM16.6192 6.077C16.6192 4.88519 17.5849 3.91934 18.7768 3.91934C19.9686 3.91934 20.9344 4.88519 20.9344 6.077C20.9344 7.26882 19.9687 8.23462 18.7768 8.23462C17.585 8.23467 16.6192 7.26882 16.6192 6.077Z"
          fill={color}
        />
      </svg>
    </>
  );
}