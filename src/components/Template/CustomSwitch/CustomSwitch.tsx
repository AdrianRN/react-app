import * as React from 'react';
import Switch from '@mui/material/Switch';
import styles from './CustomTextField.module.css';



const label = { inputProps: { 'aria-label': 'Custom Switch' } };

function CustomSwitchField() {
    return        <Switch {...label} defaultChecked /> ;
}


export default CustomSwitchField;