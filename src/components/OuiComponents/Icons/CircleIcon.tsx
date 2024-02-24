import React from "react";
import {IIcon} from "./IIcon";
import { ColorPureBlack,FontBase} from "../Theme";
export interface ICustomIcon extends IIcon{
  number ?: string;
}

export default function CircleIcon({ color = "black", number }: ICustomIcon) {
  const circleSize = 13; // Tamaño del círculo
  const fontSize = 8; // Tamaño de fuente del número
  // Calcula la posición para centrar el número horizontalmente y verticalmente en el círculo
  const textX = circleSize / 2;
  const textY = circleSize / 2 + fontSize / 8;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={circleSize}
      height={circleSize}
      viewBox={`0 0 ${circleSize} ${circleSize}`}
      fill="none"
    >
      <circle cx={circleSize / 2} cy={circleSize / 2} r={circleSize / 2} fill={color} />
      {number && (
        <text x={textX} y={textY} fontFamily={FontBase} fill={ ColorPureBlack} fontSize={fontSize} textAnchor="middle" alignmentBaseline="middle">
          {number}
        </text>
      )}
    </svg>
  );
}
