import React from "react";

interface CustomButtonExampleProps{
    color?: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    children?: React.ReactNode;
}

export type {  CustomButtonExampleProps };