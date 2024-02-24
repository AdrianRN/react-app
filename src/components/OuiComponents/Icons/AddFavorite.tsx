import React from "react";
import { IIcon } from "./IIcon";

export default function AddFavorite({ color = "black" }: IIcon) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="33"
        viewBox="0 0 43 41"
        fill="none"
      >
        <path
          d="M9.40269 40.2493C8.94241 40.2493 8.48214 40.1096 8.09584 39.8219C7.37255 39.2959 7.02735 38.3918 7.22461 37.5205L9.92872 25.6192L0.764332 17.5808C0.0903594 16.989 -0.164435 16.0603 0.106798 15.2055C0.38625 14.3589 1.1342 13.7507 2.03009 13.6685L14.1534 12.5671L18.9534 1.35616C19.3068 0.534246 20.1123 0 21.0082 0C21.9041 0 22.7095 0.534246 23.063 1.35616L27.8465 12.5671L39.9698 13.6685C40.8657 13.7507 41.6136 14.3507 41.8931 15.2055C42.1726 16.0521 41.9178 16.989 41.2438 17.5808L32.0794 25.6192L34.7835 37.5205C34.9808 38.3918 34.6438 39.3041 33.9123 39.8219C33.189 40.3479 32.2191 40.389 31.4547 39.9288L20.9999 33.6822L10.5452 39.937C10.1917 40.1425 9.80543 40.2493 9.40269 40.2493ZM20.9999 30.9863C21.3945 30.9863 21.789 31.0931 22.1424 31.3068L32.0054 37.2082L29.4575 25.9726C29.2767 25.1753 29.5479 24.337 30.1643 23.7945L38.8191 16.2082L27.3698 15.1726C26.5479 15.0986 25.8328 14.5808 25.5123 13.8164L20.9917 3.23014L16.4712 13.8164C16.1506 14.5726 15.4438 15.0904 14.6219 15.1644L3.18077 16.2L11.8356 23.7863C12.452 24.3288 12.7232 25.1589 12.5424 25.9644L9.99447 37.2L19.8575 31.3068C20.2109 31.0931 20.6054 30.9863 20.9999 30.9863Z"
          fill={color}
        />
        <path
          d="M20.9999 26.1452C20.6958 26.1452 20.4493 25.8986 20.4493 25.5945V20.663H15.5178C15.2136 20.663 14.9671 20.4165 14.9671 20.1123C14.9671 19.8082 15.2136 19.5617 15.5178 19.5617H20.4493V14.6302C20.4493 14.326 20.6958 14.0795 20.9999 14.0795C21.3041 14.0795 21.5506 14.326 21.5506 14.6302V19.5617H26.4821C26.7863 19.5617 27.0328 19.8082 27.0328 20.1123C27.0328 20.4165 26.7863 20.663 26.4821 20.663H21.5506V25.5945C21.5506 25.8986 21.3041 26.1452 20.9999 26.1452Z"
          fill={color}
        />
      </svg>
    </>
  );
}