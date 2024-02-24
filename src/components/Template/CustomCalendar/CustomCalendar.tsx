import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import styles from './CustomCalendar.module.css';

function CustomCalendar() {
    return <LocalizationProvider  dateAdapter={AdapterDayjs}>
        <div className= {styles.customCalendarContainer}>
            <DateCalendar  className= {styles.customCalendarRoot}   />
        </div>
  </LocalizationProvider>;
}


export default CustomCalendar;