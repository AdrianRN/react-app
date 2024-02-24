import React, { FC }  from 'react';
import styles from './CustomButtonExample.module.css';
import {  CustomButtonExampleProps } from './CustomButtonExample.types';



const CustomButtonExample: FC<CustomButtonExampleProps> = ({ color = 'blue', size = 'medium', onClick, children }) => {
    const buttonStyles = `${styles.button} ${styles[size]}`;
    return (
      <button className={buttonStyles} style={{ backgroundColor: color }} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  export default CustomButtonExample;
