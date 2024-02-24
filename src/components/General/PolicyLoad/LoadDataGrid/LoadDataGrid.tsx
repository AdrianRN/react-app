import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GridColDef, esES } from '@mui/x-data-grid';
import { DataGrid } from "../../../OuiComponents/DataGrid";
import * as React from 'react';
import styles from './LoadDataGrid.module.css';
import { useEffect, useRef, useState } from 'react';

const columns: GridColDef[] = [
  {
    field: 'inciso',
    headerName: 'Inciso',
    width: 70,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    

  },
  {
    field: 'no_poliza',
    headerName: 'No. Póliza',
    width: 170,
    editable: false,
    align: 'left',
    headerAlign: 'left',
 
  },
  {
    field: 'modelo',
    headerName: 'Modelo',
    width: 170,
    editable: false,
    align: 'left',
    headerAlign: 'left',
  },
  {
    field: 'descripcion',
    headerName: 'Descripción',
    type: 'number',
    width: 200,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    
  },
  {
    field: 'no_serie',
    headerName: 'No. Serie',
    type: 'number',
    width: 200,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 200,
    align: 'left',
    headerAlign: 'left',
    
    renderCell: (params) => (
      <Tooltip placement="right" arrow enterDelay={300} title={
        <Typography color="inherit">
          {params.value ? 'OK' : '❌'}<br />
          {params.value ? '' : params.row.message}
        </Typography>
      }>
        <div className={params.value ? styles.okButton : styles.noButton}>
          {params.value ? 'OK' : 'NO'}
        </div>
      </Tooltip>
    ),
  },
];

function LoadDataGrid({ onSelectRowsData, response }: any) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const onRowSelectionHandler = (selectedIds: any) => {
    const selectedRowsData = selectedIds.map((index: number) => {
      const selectedRow = response.fileContent[index - 1];
      return selectedRow;
    });

    onSelectRowsData(selectedRowsData);
  };

  const generateRowsWithIds = (rows:any) => {
    let idCounter = 1;
    return rows.map((row:any) => {
      return { ...row, id: idCounter++ };
    });
  };

  // Función para manejar cambios en el tamaño de la pantalla
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth > 1000); // Cambia 1000 al ancho que consideres "grande"
  };

  useEffect(() => {
    // Agrega un evento de escucha del tamaño de la ventana cuando el componente se monta
    window.addEventListener('resize', handleResize);
    handleResize(); // Llama a la función para establecer el estado inicial

    // Limpia el evento de escucha cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.customGridSize}>
      <DataGrid
        rows={generateRowsWithIds(response.fileContent || [])}
        columns={columns.map((column) => ({
          ...column,
          flex: isLargeScreen ? 1 : undefined,
        }))}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        isRowSelectable={(params) => params.row.status !== false}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        onRowSelectionModelChange={(ids) => onRowSelectionHandler(ids)}
      />
    </div>
  );
}

export default LoadDataGrid;