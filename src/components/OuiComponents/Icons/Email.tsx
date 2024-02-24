import React from "react";
import { IIcon } from "./IIcon";

export default function Edit({ color = "black" }: IIcon) {
    return (
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.00195 1H19.002C20.102 1 21.002 1.9 21.002 3V15C21.002 16.1 20.102 17 19.002 17H3.00195C1.90195 17 1.00195 16.1 1.00195 15V3C1.00195 1.9 1.90195 1 3.00195 1Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.002 3L11.002 10L1.00195 3" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


    );
}
