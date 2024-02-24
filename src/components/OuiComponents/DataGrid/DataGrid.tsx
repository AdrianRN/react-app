import { createTheme, styled } from "@mui/material";
import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps, esES
} from "@mui/x-data-grid";
import React from "react";
import Typography from "../DataDisplay/Typography";
import Box from "../Layout/Box";
import { ColorGrayDark2, FontBase } from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,


};


const CustomDataGrid = styled((props: MuiDataGridProps & { pageSize?: number }) => {

  const {
    pageSize = 10,  // Valor predeterminado de pageSize
    ...otherProps
  } = props;

  const arrayToSort: number[] = [5, 10, 20, 30];
  if (!arrayToSort.includes(pageSize)) {
    arrayToSort.push(pageSize);
  }
  const sortedArray = arrayToSort.sort((a, b) => a - b);

  return <MuiDataGrid {...props} sx={{

    ...(props.rows.length === 0 && {
      height: 300
    }),

  }}

    disableColumnSelector
    autoHeight
    slotProps={{
      pagination: { labelRowsPerPage: 'Registros por página' },
      basePopper: {
        sx: {
          "& .MuiDataGrid-menuList": {
            borderRadius: '16px',
            background: 'white',
            
          },
          "& .MuiPaper-root": {
            borderRadius: '16px',
            
          }
        }
      }
    }}
    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
    initialState={{
      pagination: {

        paginationModel: {
          pageSize: pageSize
        },
      },
    }}
    slots={{
      noRowsOverlay: () => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography>No se encontraron registros</Typography>
          </Box>
        )
      },
    }}
    pageSizeOptions={sortedArray}


  />
  })(({ }) => ({
  ...BASE_PROPS,
  //Fondo de la tabla
  "&.MuiDataGrid-root": {
    borderRadius: "16px",
  },
  //Headers de la tabla
  "& .MuiDataGrid-columnHeaders": {
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    backgroundColor: ColorGrayDark2,
    color: "white",

  },

  '& .MuiDataGrid-columnSeparator': {
    color: "white",
    visibility: "visible",
  },
  // disable cell selection style
  '.MuiDataGrid-cell:focus': {
    outline: 'none'
  },
  // pointer cursor on ALL rows
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',

  },
  //Cambia el diseño del icono de filtro
  '.MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
  },
  "& .MuiDataGrid-sortIcon": {
    opacity: 'inherit !important',
    color: "white",
    visibility: 'visible'
  },
  //Cambia el diseño del icono de menu
  "& .MuiDataGrid-menuIconButton": {
    opacity: 1,
    color: "white",

  },
  "& .MuiDataGrid-menuIcon": {
    visibility: "visible",
    width: "auto"
  }


}));


export default function DataGrid(props: MuiDataGridProps & { pageSize?: number }) {
  return <CustomDataGrid {...props} />;
}
