import { TextField as MuiTextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import * as React from 'react';


const BASE_PROPS = {
    borderRadius: "16px",
    position: 'relative',
    border: '1px solid #ced4da',
};


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    ...BASE_PROPS
  },
}));

const CustomTextField = styled(MuiTextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
      ...BASE_PROPS,
    },
  }));

export default function CustomizedSelects() {
  const [age, setAge] = React.useState('');
  const handleChange = (event: { target: { value: string } }) => {
    setAge(event.target.value);
  };
  return (
    <div>
      
      <FormControl sx={{ m: 1 }} variant="standard">
        
      <Select
          value={age}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <CustomTextField
            
            fullWidth
            
            helperText="Seleccionar opción"
            select
        >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
        </CustomTextField>

      </FormControl>
    </div>
  );
}