import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import ChubbVehicle from '../../../models/ChubbVehicles';

interface AutocompleteVehiclesInputProps {
  options: ChubbVehicle[]; 
  onChange: (selectedOption: ChubbVehicle | null) => void;
}

export default function AutocompleteVehiclesInput(props: AutocompleteVehiclesInputProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<ChubbVehicle[]>([]);

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    setOpen(true);
    setLoading(true);

    if(props !== null)
    {
      const filteredChubbVehicles = props.options.filter((vehicle) =>
        vehicle.description.toLowerCase().includes(value.toLowerCase())
      );

      setOptions(filteredChubbVehicles);
    }
    

    setLoading(false);
  };

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.description === value.description}
      getOptionLabel={(option) => option.description}
      options={options}
      loading={loading}
      noOptionsText="No hay registros"
      inputValue={inputValue}
      onInputChange={(_, value) => handleInputChange(value)}
      onChange={(_, selectedOption) => {
        props.onChange(selectedOption);
        setInputValue(selectedOption ? selectedOption.description : '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar Modelo"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
