import React from "react";
import { IIcon } from "./IIcon";

export default function HealthIcon({ color = "black" }: IIcon) {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="45" 
        height="10" 
        viewBox="0 0 45 10" 
        fill="none">
        <g clipPath="url(#clip0_552_293)">
            <path 
                d="M16.6877 9.99988C16.6877 9.99988 16.6872 9.99988 16.6866 9.99988C16.5307 9.99988 16.3951 9.93641 16.3568 9.84687L12.608 0.993503L9.22954 8.20609C9.1907 8.28861 9.06914 8.34775 8.92506 8.35376C8.78155 8.35978 8.64648 8.31167 8.58851 8.23315L6.16005 4.9496L5.60569 5.78719C5.55448 5.86471 5.42841 5.91549 5.28827 5.91549H0.841055C0.652518 5.91549 0.5 5.82495 0.5 5.71302C0.5 5.6011 0.652518 5.51056 0.841055 5.51056H5.05584L5.82518 4.34822C5.87527 4.27204 5.99796 4.22159 6.13584 4.21992C6.27429 4.21825 6.39923 4.26603 6.45495 4.34087L8.82883 7.55025L12.2962 0.148225C12.3373 0.0596884 12.4741 -0.00145225 12.6288 -0.000115846C12.7836 0.000886459 12.9175 0.0636976 12.9553 0.152903L16.6922 8.97787L18.8928 3.92591C18.9299 3.84038 19.0565 3.77924 19.2051 3.77457C19.3537 3.76989 19.4904 3.82301 19.5422 3.90587L21.3342 6.74674L21.9032 5.64988C21.9471 5.56502 22.0793 5.50688 22.229 5.50688H44.1584C44.3469 5.50688 44.4994 5.59742 44.4994 5.70935C44.4994 5.82127 44.3469 5.91181 44.1584 5.91181H22.4806L21.6915 7.43365C21.6488 7.51651 21.5216 7.57397 21.3758 7.57631C21.23 7.57898 21.0972 7.52619 21.0466 7.44501L19.2828 4.64858L17.0175 9.84787C16.9787 9.93707 16.843 9.99955 16.6872 9.99955L16.6877 9.99988Z" 
                fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_552_293">
        <rect 
            width="44" 
            height="10" 
            fill={color} 
            transform="translate(0.5)"
        />
        </clipPath>
        </defs>
    </svg>
  );
}