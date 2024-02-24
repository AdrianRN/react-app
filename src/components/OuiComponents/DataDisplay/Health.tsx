import { Box, styled } from "@mui/material";
import React from "react";
import { FontBase, ColorPureWhite, ColorBlue } from "../Theme";
import { CircleIcon, HealthIcon } from "../Icons";

const BASE_PROPS = {
  fontFamily: FontBase,
};
const CustomDiv = styled("div")(({ theme, color }) => ({
  width: "73px",
  height: "16px",
  display: "flex",
  alignItems: "center",
  background: color || ColorBlue, // Cambia este color de fondo según tus necesidades
  padding: theme.spacing(1), // Espacio interior para el contenido
  borderRadius: "10px",
  justifyContent: "space-between",
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const CircleContainer = styled(IconContainer)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));
type HealthProps = {
  bgColor: string;
  circleColor?: string; // Propiedad para el color del círculo
  circleNumber?: string;
};
export default function Health({
  bgColor,
  circleColor = ColorPureWhite, // Valor por defecto para el color del círculo
  circleNumber = "1", // Valor por defecto para el número dentro del círculo
}: HealthProps) {
  const numberProp =
    circleNumber.toString().length > 1 ? circleNumber.toString().length - 1 : 1;

  const number = circleNumber.toString().slice(0, numberProp);

  return (
    <CustomDiv color={bgColor}>
      <IconContainer>
        <HealthIcon />
      </IconContainer>
      <CircleContainer>
        <CircleIcon color={circleColor} number={number} />
      </CircleContainer>
    </CustomDiv>
  );
}
