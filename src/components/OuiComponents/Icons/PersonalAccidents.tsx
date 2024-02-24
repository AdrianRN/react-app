import React from 'react'
import { IIcon } from './IIcon'

function PersonalAccidents({ color = "black" }: IIcon) {
    return (
        <>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0_208_2519)">
                    <path
                        d="M20 30V25C20 22.3478 19.5786 19.8043 18.8284 17.9289C18.0783 16.0536 17.0609 15 16 15H8C6.93913 15 5.92172 16.5536 5.17157 18.4289C4.42143 20.3043 4 28.5 4 25.5L4 30"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke={color}
                    />
                    <path
                        d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke={color}
                    />
                    <line x1="14.4903" y1="15.0981" x2="13.4903" y2="20.0981" stroke={color} />
                    <g filter="url(#filter0_d_208_2519)">
                        <path
                            d="M16.3671 21.2302C16.2944 21.4949 16.0937 21.7651 15.7427 21.9992C15.2926 22.2992 14.6422 22.501 13.8987 22.501C13.1552 22.501 12.5047 22.2992 12.0547 21.9992C11.6012 21.6968 11.3987 21.3341 11.3987 21.001C11.3987 20.6679 11.6012 20.3051 12.0547 20.0028C12.4058 19.7688 12.8788 19.5945 13.4228 19.5292C13.4868 20.1838 13.6802 20.6738 14.0244 20.9984C14.4652 21.4142 15.0252 21.4394 15.4488 21.3967C15.6657 21.3749 15.8764 21.3321 16.0529 21.2948C16.0749 21.2901 16.0962 21.2856 16.1169 21.2812C16.2134 21.2607 16.2952 21.2434 16.3671 21.2302Z"
                            shapeRendering="crispEdges"
                            stroke={color}
                        />
                    </g>
                    <line x1="20" y1="22.5" x2="14" y2="22.5" stroke={color} />
                    <line x1="16.5" y1="15" x2="16.5" y2="23" stroke={color} />
                    <line x1="9.27514" y1="5.58251" x2="15.9759" y2="9.99854" stroke={color} />
                    <line x1="7.5" y1="18" x2="7.5" y2="24" stroke={color} />
                    <line x1="14.5528" y1="9.22361" x2="12.5528" y2="5.22359" stroke={color} />
                </g>
                <defs>
                    <filter id="filter0_d_208_2519" x="6.89868" y="19.001" width="14" height="12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_208_2519" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_208_2519" result="shape" />
                    </filter>
                    <clipPath id="clip0_208_2519">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </>
    )
}

export default PersonalAccidents