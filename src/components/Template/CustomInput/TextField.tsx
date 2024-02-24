import {
  styled, TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps
} from '@mui/material';
import React from 'react';


const CustomContainedTextField = styled((props: MuiTextFieldProps) => (
    <MuiTextField {...props} />
  ))(({theme }) =>( {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    
    '& .MuiInputBase-input': {
      borderRadius: 16, // Establece el radio del borde
      position: 'relative',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    
      '&:focus': {
        borderRadius: '16px',
        border: '2px solid #000',
        backgroundColor: '#FFF',
      },
    },
  }));


  export default function TextField(muiProps: MuiTextFieldProps){
        return <CustomContainedTextField  { ...muiProps}  ></CustomContainedTextField>
  }