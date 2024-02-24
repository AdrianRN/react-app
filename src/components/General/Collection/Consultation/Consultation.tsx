import { IconButton, Tooltip } from '@mui/material';
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from 'react';
import { useAlertContext } from '../../../../context/alert-context';
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import IFilter from '../../../../insuranceModels/filters';
import FilterService from '../../../../insuranceServices/filters.service';
import Receipts from '../../../../models/Receipts';
import ReceiptsService from '../../../../services/receipts.service';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { CircularProgress } from '../../../OuiComponents/Feedback';
import MessageBar from '../../../OuiComponents/Feedback/MessageBar';
import { Delete, Edit, Plus } from "../../../OuiComponents/Icons";
import { Button } from "../../../OuiComponents/Inputs";
import Box from "../../../OuiComponents/Layout/Box";
import Stack from "../../../OuiComponents/Layout/Stack";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import {
  ColorPink,
  ColorWhite,
  LinkMediumFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import styles from '../../Home/Home-styles.module.css';
import Title from "../../Title/Title";
import TabModalReceiptDetails from '../ReceiptDetails/TabModalReceiptDetails';
import NewFilterModal from './NewFilterModal';
import PaperClip from '../../../OuiComponents/Icons/PaperClip';
import Email from '../../../OuiComponents/Icons/Email';
import CreditCard from '../../../OuiComponents/Icons/CreditCard';
import Cloud from '../../../OuiComponents/Icons/Cloud';
import FormatData from '../../../../utils/Formats.Data';

export default function Consultation() {

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  // States
  const [filter, setFilter] = React.useState<IFilter>();
  const [listado, setListado] = React.useState<IFilter[]>([])
  const [isFilter1Active, setIsFilter1Active] = React.useState<number>();
  const [titulo, setTitulo] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [filterData, setFilterData] = useState([]);
  const [receiptDetails, setReceiptDetails] = React.useState<Receipts>();
  const [loadingFilters, setLoadingFilters] = React.useState(true);
  // Columns DataGrid
  const [openTabReceipt, setOpenTabReceipt] = React.useState(false);
  const columns: GridColDef[] = [
    {
      field: 'icons',
      headerName: '',
      flex: 1,
      renderCell: (params) => {
        const hasFiles = params.row.hasFiles;
        const emailNotification = params.row.emailNotification;
        const isDomicilied = params.row.isDomicilied;
        const hasLogs = params.row.hasLogs;


        return (
          <>
            <Tooltip title={hasFiles ? 'Contiene documentos' : 'No contiene documentos'} arrow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                <PaperClip color={hasFiles ? ColorPink : '#5f5f5f'} />
              </div>
            </Tooltip>

            <Tooltip title={emailNotification ? 'Ha mandado correos' : 'No ha mandado correos'} arrow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                <Email color={emailNotification ? ColorPink : '#5f5f5f'} />
              </div>
            </Tooltip>

            <Tooltip title={isDomicilied ? 'Pago domiciliado' : 'Pago no domiciliado'} arrow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                <CreditCard color={isDomicilied ? ColorPink : '#5f5f5f'} />
              </div>
            </Tooltip>

            <Tooltip title={hasLogs ? 'Tiene registros en bitácora' : 'No tiene registros en bitácora'} arrow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                <Cloud color={hasLogs ? ColorPink : '#5f5f5f'} />
              </div>
            </Tooltip>

          </>
        );
      }
    }
    ,
    {
      field: 'validityBalance',
      headerName: 'Días',
      flex: 1,
      maxWidth: 75,
    },
    {
      field: 'dueDate',
      headerName: 'Fecha de vencimiento',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={TextSmallFont}>{FormatData.stringDateFormatDDMMYYY(params.row.dueDate)}</Typography>
          </>
        );
      }
    },
    {
      field: 'clientName',
      headerName: 'Cliente',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={TextSmallFont}>{params.row.clientName}</Typography>
          </>
        );
      }
    },
    {
      field: 'noPolicy',
      headerName: 'No. póliza',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={TextSmallFont}>{params.row.noPolicy===null?"1":params.row.noPolicy}</Typography>
          </>
        );
      }
    },
    {
      field: 'receiptNumber',
      headerName: 'Número de recibo',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={TextSmallFont}>{params.row.receiptNumber}/{params.row.totalReceipts}</Typography>
          </>
        );
      }
    },

  ];

  useEffect(() => {
    getAllFilters()
  }, [change]);

  const getAllFilters = async () => {
    try {
      var user = localStorage.getItem("userInfo");
      const restFilter = await FilterService.getFiltersByFolio(JSON.parse(`${user ?? ''}`).folio);

      // Agregar un filtro estático llamado "Todos"
      const allFilter = { folio: '', title: 'Todos' };
      setListado([allFilter, ...restFilter.data]);
      setChange(false);
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleNewFilter = () => {
    setFilter(undefined)
    setOpen(true);

  };

  const EditFilter = (filtro: IFilter) => {

    setFilter(filtro);

    setOpen(true);
  };

  const deleteFilter = async (folio: string) => {
    await FilterService.deleteFilter(folio);

    // Obtén el filtro actualmente seleccionado
    const deletedFilter = listado[isFilter1Active || 0]; // Usa 0 como índice predeterminado si isFilter1Active es undefined

    // Si el filtro eliminado es el filtro seleccionado, actualiza el estado titulo a vacío
    if (deletedFilter && deletedFilter.folio === folio) {
      setTitulo("");
      // Limpia los datos de la tabla
      setIsFilter1Active(undefined);
      setFilterData([]);
    }



    setDataAlert(true, "El filtro se eliminó exitosamente.", "success", autoHideDuration);
    getAllFilters();
  };

  useEffect(() => {
    // Realiza la petición solo si hay un filtro seleccionado
    if (isFilter1Active !== undefined) {
      const filtroSeleccionado = listado[isFilter1Active];

      // Realiza la petición HTTP aquí
      if (filtroSeleccionado) {
        ReceiptsService.getReceiptCollectionFilter(filtroSeleccionado.folio)
          .then(response => {
            // Maneja la respuesta de la petición aquí
            const newData = response.data.map((item: any, index: any) => ({
              ...item,
              id: index + 1,
            }));

            setFilterData(newData);
          })
          .catch(error => {
            // Maneja errores de la petición aquí
            console.error(error);
          });
      }
    } else {
      // Si no hay filtro seleccionado, limpia los datos de la tabla
      setFilterData([]);
    }
  }, [isFilter1Active, listado]);


  const handleTabReceipt = (params: any) => {
    if (params.row.folio === '') {
      // Lógica para el filtro "Todos"
      setFilterData([]); // Puedes ajustar esto según tus necesidades
    } else {
      setOpenTabReceipt(true);
      setReceiptDetails(params.row);
    }
  };

  const isStaticFilter = (filtro: IFilter) => filtro.folio === '';
  const selectedFilter = listado[isFilter1Active || 0];


  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Title
        title={"Cobranza"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />

      <Paper sx={{ p: "24px", borderRadius: 8 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Typography sx={{ ...LinkMediumFont, width: '100px' }}>
              {titulo}
            </Typography>

            {isFilter1Active !== undefined && !isStaticFilter(selectedFilter) && (
              <Box>
                <IconButton
                  sx={{ width: '40px', height: '40px' }}
                  onClick={() => EditFilter(selectedFilter)}
                  disabled={isStaticFilter(selectedFilter)}
                >
                  <Edit color={ColorPink} />
                </IconButton>
                <IconButton
                  sx={{ width: '40px', height: '40px' }}
                  onClick={() => deleteFilter(selectedFilter.folio)}
                  disabled={isStaticFilter(selectedFilter)}
                >
                  <Delete color={ColorPink} />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box>
            <Button variant="contained" startIcon={<Plus color={ColorWhite} />} onClick={() => handleNewFilter()}>
              Nuevo filtro
            </Button>
          </Box>
        </Stack>

        <Typography>
          <strong>Filtros</strong>
        </Typography>


        <Stack
          direction="row"
          alignItems="start"
          justifyContent="start"
          sx={{ mb: 5 }}

        >
          <Box className={styles['card-scroll']} sx={{ pl: '2px', pb: '2px', pt: '2px', pr: '3px' }}>
            <Box height={160} >
              <Stack
                direction="column"
                alignItems="start"
                gap="16px"
                sx={{ marginRight: '15px' }}
              >
                {loadingFilters ? (
                  <Box height={160} width={180} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={40} color="primary" />
                  </Box>
                ) : listado.length > 0 ? (

                  listado.map((filtro: IFilter, index: number) => (
                    <Stack key={filtro.folio} direction="row" alignItems="center">
                      <Button
                        variant={index === isFilter1Active ? 'contained' : 'outlined'}
                        key={filtro.folio}
                        sx={{
                          borderRadius: "12px",
                          padding: "12px 24px",
                          height: "40px",
                          width: '180px'
                        }}
                        onClick={() => {
                          setIsFilter1Active((prevIsFilter1Active) => (prevIsFilter1Active === index ? undefined : index));
                          setTitulo((prevTitulo) => (prevTitulo === filtro.title ? "" : filtro.title));
                        }}
                      >
                        {filtro.title.length > 10 ? filtro.title.substring(0, 10) + "..." : filtro.title}
                      </Button>

                    </Stack>
                  ))
                ) : (
                  <Box height={160} width={250} sx={{ display: 'flex', justifyContent: 'center' }}>

                    <Typography sx={{ ...LinkMediumFont, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <strong>No hay filtros</strong>
                    </Typography>

                  </Box>
                )}
              </Stack>
            </Box>
          </Box>

          {/* DataGrid */}
          <DataGrid

            rows={filterData.length > 0 ? filterData : []}
            columns={columns}
            disableRowSelectionOnClick
            onRowClick={handleTabReceipt}
            sx={{ ml: 3 }}
          />
        </Stack>

      </Paper>
      {open && (
        <NewFilterModal open={open} setOpen={setOpen} filter={filter}
          close={() => {
            setChange(true);
            setOpen(false);
          }} />
      )}
      {openTabReceipt && (
        <TabModalReceiptDetails openTabReceipt={openTabReceipt} setOpenTabReceipt={setOpenTabReceipt} receiptDetails={receiptDetails}
          closeTabReceipt={() => {
            setChange(true);
            setOpenTabReceipt(false);
          }} />
      )}
    </>
  );
}




