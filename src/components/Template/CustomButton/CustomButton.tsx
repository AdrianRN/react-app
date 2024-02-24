import React from 'react';
import Button from '@mui/material/Button';
import styles from './CustomButton.module.css'; // Importar el archivo CSS en módulos



const CustomButton = () => {

  return (
    <Button className = {   `${styles.btn}` } > Custom Button</Button>
  );
};

export default CustomButton;