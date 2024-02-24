
import {
    Select as MuiSelect,
    SelectProps as MuiSelectProps,
    styled
} from '@mui/material';
import React from 'react';

const CustomContainedSelect = styled((props: MuiSelectProps) => (
    <MuiSelect   {...props} />
  ))(({theme}) => ({
    width: '205px',
    height: '56px',
    borderRadius: '16px',
    background: '#FFF',
    display: 'inline-flex',
    paddingLeft: '0px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap:'205px',
    
    
    '& MuiSelect-select':{
        borderStyle: 'solid',
        borderColor: 'blue',
    },
    '& .MuiSelect-icon':{
        width:'24px',
        height:'24px'
    },
    
    
    
  }));


  export default function Select(muiProps: MuiSelectProps){
        return <CustomContainedSelect  { ...muiProps}  >
            
        </CustomContainedSelect>
  }