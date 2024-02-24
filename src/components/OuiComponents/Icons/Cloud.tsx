import React from "react";
import { IIcon } from "./IIcon";

export default function Edit({ color = "black" }: IIcon) {
    return (
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.0054 13.998L12.0054 9.99805L8.00537 13.998" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.0054 9.99805V18.998" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.3953 16.3885C21.3707 15.8568 22.1412 15.0154 22.5852 13.9971C23.0292 12.9789 23.1215 11.8418 22.8475 10.7652C22.5735 9.68867 21.9488 8.73403 21.072 8.05197C20.1952 7.3699 19.1162 6.99925 18.0053 6.99852H16.7453C16.4426 5.82776 15.8785 4.74085 15.0953 3.81951C14.3121 2.89817 13.3302 2.16637 12.2234 1.67913C11.1167 1.19188 9.91388 0.961878 8.70545 1.0064C7.49701 1.05093 6.3144 1.36882 5.24651 1.93618C4.17862 2.50355 3.25324 3.30562 2.53995 4.2821C1.82666 5.25858 1.34402 6.38406 1.12831 7.57391C0.912601 8.76377 0.969437 9.98705 1.29454 11.1518C1.61965 12.3165 2.20457 13.3924 3.00533 14.2985" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.0054 13.998L12.0054 9.99805L8.00537 13.998" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>




    );
}
