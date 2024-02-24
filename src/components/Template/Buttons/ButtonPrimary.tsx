import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import React, { ReactNode } from 'react';
import LinkSmall from '../Typography/LinkSmall';


interface ButtonPrimaryProps {
    icon: ReactNode; // Tipo ReactNode para cualquier componente de React
    text: string;     // Tipo string para el texto del botón
   
  }
// Crea un componente de botón personalizado utilizando el sistema de estilos
const CustomButton = styled(Button) ({
  display: 'inline-flex',
  padding: '16px 32px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  borderRadius: '16px',
  backgroundColor: '#E5105D',
  textTransform: 'none',
  color: 'white', // Cambia el color del texto del botón
  
  '&:hover': {
    backgroundColor: '#840A36', // Cambia el color de fondo al pasar el mouse por encima
  },
  '&:active': {
    backgroundColor: '#E5105D',
    border: '4px solid #FACFDF',
  },
});


function ButtonPrimary({ icon, text }: ButtonPrimaryProps) {
    return (
      <CustomButton variant="contained" >
        {icon}
        <LinkSmall>
            {text}
        </LinkSmall>
      </CustomButton>
    );
  }


export default ButtonPrimary;

