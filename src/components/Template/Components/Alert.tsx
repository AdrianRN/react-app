import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    Alert as MuiAlert,
    AlertProps as MuiAlertProps,
    styled
} from '@mui/material';
import React from 'react';


const CustomContainedAlert = styled((props: MuiAlertProps) => (
    <MuiAlert {...props} />
  ))(({severity = 'info'}) => {
    const backgroundColorMapping = {
        error: '#FFE5F2',
        warning: '#FEFEE5',
        info: '#C7E9FF',
        success: '#E5FFF2',
    };  

    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColorMapping[severity],
        borderRadius: '20px',
        '& .MuiAlert-icon': {
            marginRight: '8px',
            color:
            severity === 'error' ? '#E40173' :
            severity === 'warning' ? '#DCC80F' :
            severity === 'info' ? '#1976d2' :
            severity === 'success' ? '#00CC67' : 'inherit',
        },
        '& .MuiAlert-message': {
            fontFamily: 'Titillium Web, Arial, sans-serif', // Cambia la fuente aquí
            fontSize: '15px', // Cambia el tamaño de fuente aquí
            fontWeight: '600', // Cambia el peso de fuente aquí
            lineHeight: '24px', // Cambia la altura de línea aquí
            letterSpacing: '0.75px', // Cambia el espaciado de letras aquí
            margin: '0', // Quita el margen superior e inferior
            padding: '0', // Quita el relleno interno
            color: '#000'
        },
    }
  });


  export default function Alert(muiProps: MuiAlertProps){
        const { severity = 'info' } = muiProps;
        const iconMapping = {
            error: <CancelIcon fontSize="inherit" />,
            warning: <ErrorIcon fontSize="inherit" />,
            info: <InfoOutlinedIcon fontSize="inherit" />,
            success: <CheckCircleIcon fontSize="inherit" />,
        };
        return <CustomContainedAlert  { ...muiProps} icon={iconMapping[severity]} ></CustomContainedAlert>
  }