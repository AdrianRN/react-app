
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {
  IconButton,
  InputAdornment,
  TextFieldProps as MuiTextFieldProps,
  styled,
} from "@mui/material";
import React from "react";
import { ColorGray, ColorGrayDark2, ColorGrayDisabled, ColorPureBlack } from "../Theme";
import TextField from './TextField';
import { Search } from '../Icons';

interface Obj {
  folio: string;
  name: string;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AutocompleteInput(props: any) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Obj[]>([]);
  const [loading, setLoading] = React.useState(false)
  const [placeholderText, setPlaceholderText] = React.useState("");

  React.useEffect(() => {
    if (props.placeholderValue) {
      setPlaceholderText(props.placeholderValue)
    } else {
      setPlaceholderText("Buscar");
    }
  }, [])
  

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        //setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleInputChange = async (value: any) => {
    setTimeout(async () => {
      if (value) {
        setLoading(true);
        const response = await props.function(value)
        if(response.data == null){
          setOptions([])
          setLoading(false)
          return
        }

        const list = response.data

        list.map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const lastName = row['lastName'] || '';
              const maternalLastName = row['maternalLastName'] || '';
              const fullName = `${row[column]} ${lastName} ${maternalLastName}`.trim();
              row['name'] = fullName;
              return { field: 'name', headerName: 'Name' };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });


        //Si el listado es de otro tipo y no cuenta con la propiedad 'name'
        list.map((row: { [key: string]: any }) => {
          if(!row['lastName']){
            Object.keys(row).map((column) => {
                if(column.toLowerCase().includes((props.name ? (props.name) : ("name")).toLowerCase())){
                  row['name'] = row[column]
                }
            })
          }else{
            return;
          }
        })

        setOptions(list)
        setLoading(false)


        
      } else {
        setOptions([]);
        setOpen(false)
      }
    }, 500)
  }

  const renderOptions = (props: React.HTMLAttributes<HTMLLIElement>, option: Partial<any>) => {
    return (
      <li {...props} key={option.folio}>
        {option.name}
      </li>
    );
  }

  const handleClientInfo = (clientInfo: any) => clientInfo && props.parentCallBack(clientInfo)
  const BASE_PROPS = {
    display: "flex",
    width: "290px",
    paddingRight: "0px",
    alignItems: "center",
    gap: "8px",
    borderRadius: "16px",
  };
  

  return (
    <Autocomplete
      id="asynchronous-demo"
      defaultValue={props.data && (
        {
          name: props.data.fullName,
          folio: props.data.folio,
          year: 1
        }
      )}
      fullWidth
      open={open}
      onOpen={() => setOptions([])}
      onClose={() => { setOpen(false) }}
      isOptionEqualToValue={(option, value) => option.name? option.name === value.name : option.folio === value.folio}
      getOptionLabel={(option) => option.name ? option.name : option.folio}
      options={options}
      loading={loading}
      noOptionsText="No hay registros"
      loadingText='Buscando...'
      onInputChange={(e, value) => { handleInputChange(value); setOpen(true) }}
      onChange={(e, value) => { setLoading(false); handleClientInfo(value) }}
      renderOption={renderOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholderText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <React.Fragment>
                  <Search color={ColorGrayDark2} />
              </React.Fragment>
          ),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress sx={{ color: "#E5105D" }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}