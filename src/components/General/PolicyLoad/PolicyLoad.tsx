import React, { useEffect, useRef, useState } from "react";
import { GridColDef, esES } from '@mui/x-data-grid';
import './PolicyLoad-styles.module.css';
import Check from '@mui/icons-material/Check';
import NorthIcon from '@mui/icons-material/North';
import Download from '../../OuiComponents/Icons/Download';
import LoadDataGrid from './LoadDataGrid/LoadDataGrid';
import ValidateDataGrid from './ValidateDataGrid/ValidateDataGrid';
import { Row } from "./ValidateDataGrid/ValidateDataGrid";
import { getPolicyFiles, validateFileService } from "../../../services/policyload.service";
import Title from "../Title/Title";
import * as XLSX from "xlsx"; // Importa la librería xlsx
import { Button, TextField } from "../../OuiComponents/Inputs";
import { SIZE_WEB_URL } from "../../../enviroment/enviroment";
import Paper from "../../OuiComponents/Surfaces/Paper";
import Box from "../../OuiComponents/Layout/Box";
import Stack from "../../OuiComponents/Layout/Stack";
import Grid from "../../OuiComponents/Layout/Grid";
import DataGrid from "../../OuiComponents/DataGrid/DataGrid";
import Search from "../../OuiComponents/Icons/Search";
import Typography from "../../OuiComponents/DataDisplay/Typography";
import { ColorPureWhite, LinkLargeFont, LinkSmallFont, TextSmallFont } from "../../OuiComponents/Theme";
import { Alert, CircularProgress, Dialog, Snackbar } from "../../OuiComponents/Feedback";
import Modal from "../../OuiComponents/Utils/Modal";
import { DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VehiclePolicy from "../../../insuranceServices/vehiclepolicy.service";


let response: any = [];
let invalidFileContents: any = [];

const PolicyLoad: React.FC = () => {
    const [selectedFecha, setSelectedFecha] = useState('');
    const [selectedNombre, setSelectedNombre] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [showValidateButton, setShowValidateButton] = useState(false);
    const [rows, setRows] = useState<Row[]>([]);
    const [showLoadDataGrid, setShowLoadDataGrid] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState<Row[]>([]);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [selectedRowsCopy, setSelectedRowsCopy] = useState<any[]>([]); // Estado para almacenar una copia de las filas
    const [loadingValidate, setLoadingValidate] = useState(true);
    const [loadingLoad, setLoadingLoad] = useState(true);
    const [loadingValidateFile, setLoadingValidateFile] = useState(false);
    const [validationClicked, setValidationClicked] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);



    const formatDate = (inputDate: string) => {
        const parts = inputDate.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        const formattedDate = `${month}-${day}-${year}`;
        return formattedDate;
    };

    const [policyFiles, setPolicyFiles] = useState<any[]>([]);

    // validateDataGrid
    const handleFetchData = async () => {
        try {
            setLoadingValidate(true);
            setShowTable(true);
            setShowValidateButton(true);

            const formattedFecha = selectedFecha ? formatDate(selectedFecha) : "";

            const queryParams = {
                date: formattedFecha,
                fileName: selectedNombre,
                containerName: 'policydetail'
            };

            const fetchedPolicyFiles: any = await getPolicyFiles(queryParams);

            if (Array.isArray(fetchedPolicyFiles) && fetchedPolicyFiles.length > 0) {
                const updatedRows: any = fetchedPolicyFiles.map((file, index) => ({
                    name: file.name,
                    dateUpload: file.dateUpload,
                    contentType: file.contentType,
                    size: `${file.size}kb`,
                    status: file.status,
                    id: index + 1,
                }));
                setRows(updatedRows);
                // Almacena la respuesta de la API en el estado policyFiles
                setPolicyFiles(fetchedPolicyFiles);
            } else {
                setRows([]);
                // Si no hay datos, limpia el estado policyFiles
                setPolicyFiles([]);
            }
            setLoadingValidate(false); // Ocultar el cargador
        } catch (error) {
            console.error('Error al obtener los archivos de pólizas:', error);
            setLoadingValidate(false); // Asegúrate de ocultar el cargador en caso de error
        }
    };

    const columns: GridColDef[] = [
        { field: 'inciso', headerName: 'Inciso', width: 50 },
        { field: 'no_poliza', headerName: 'Núm. póliza' },
        { field: 'modelo', headerName: 'Modelo' },
        { field: 'descripcion', headerName: 'Descripción', width: 200 },
        { field: 'no_serie', headerName: 'Núm. serie', width: 200 },
        { field: 'status', headerName: 'Estado' },
    ];

    const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);

    const handleSelectedRowsData = (data: any[]) => {
        setSelectedRowsData(data);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = async (confirmed: boolean) => {
        setOpenDialog(false);

        if (confirmed) {
            let requestData: any[] = [];

            for (const key in selectedRowsData) {
                if (selectedRowsData.hasOwnProperty(key)) {
                    const row = selectedRowsData[key];
                    const formattedRow: any = {
                        policyFolio: row.policyFolio,
                        noPolicy: row.no_poliza,
                        noSerie: row.no_serie,
                        state: row.estado,
                    };

                    if (row.vehicleFolio) {
                        formattedRow.vehicleFolio = row.vehicleFolio;
                    }

                    if (row.beneficiaryFolio) {
                        formattedRow.beneficiaryFolio = row.beneficiaryFolio;
                    }

                    requestData.push(formattedRow);
                }
            }

            try {
                if (!requestData[0].noPolicy) {
                    requestData = [];
                    setSnackbarMessage("Seleccione un vehículo");
                    setSnackbarOpen(true);

                    // Configura el temporizador para cerrar el Snackbar después de 3 segundos
                    setTimeout(() => {
                        setSnackbarOpen(false);
                    }, 3000);

                    return;
                }

                // Agrega un ID a cada fila en requestData, comenzando desde 1
                const requestDataWithIds = requestData.map((row, index) => ({ ...row, id: index + 1 }));
                setSelectedRowDetails(requestDataWithIds);
                const copiedRowsData = selectedRowsData.map((row) => ({ ...row }));
                setSelectedRowsCopy(copiedRowsData);
                setIsSuccessModalOpen(true);


                // console.log(requestDataWithIds);

                // Realiza la petición HTTP
                const response = await VehiclePolicy.postVehiclePolicyList(requestDataWithIds);

                // console.log('Respuesta de la petición:', response);

                setSuccessSnackbarOpen(true);

            } catch (error) {
                console.error('Error en la petición HTTP:', error);
            }
        }
    };

    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    const handleSelectRow = (row: Row) => {
        setSelectedRow(row);
    };

    const handlePrintSelectedRow = async () => {
        if (selectedRow) {
            const selectedId = selectedRow[0].id - 1;
            // console.log("Fila seleccionada:", selectedRow);

            // Establece validationClicked en true al hacer clic en el botón de validación
            setValidationClicked(true);

            // Establece loadingLoad en true antes de la validación o carga
            setLoadingLoad(true);

            const selectedPolicy = policyFiles[selectedId];

            // Call the service to validate the file
            try {
                // console.log(selectedPolicy.uri);
                setLoadingValidateFile(true);
                response = await validateFileService(selectedPolicy.uri, 'policydetail');
                // console.log("Response from file validation:", response);

                invalidFileContents = response.fileContent.filter((item: any) => !item.status);
                setShowLoadDataGrid(true);

                handleSelectedRowsData(response);
            } catch (error) {
                console.error("Error validating the file:", error);
                setErrorSnackbarOpen(true);
                response = [];
                setShowLoadDataGrid(false);
            } finally {
                // Establece loadingLoad en false una vez que la validación se complete
                setLoadingLoad(false);
                setLoadingValidateFile(false);
            }
        } else {
            setShowLoadDataGrid(false);
        }
    };


    const handleDownloadErrors = () => {
        if (invalidFileContents.length > 0) {
            // Convierte el arreglo de errores a un libro de Excel
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(invalidFileContents);
            XLSX.utils.book_append_sheet(wb, ws, "Errores");

            // Genera un archivo Excel en base64
            const base64String = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

            // Convierte la cadena base64 en un blob
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            // Crea un objeto URL para el blob
            const url = window.URL.createObjectURL(blob);

            // Crea un enlace <a> para descargar el blob
            const a = document.createElement("a");
            a.href = url;
            a.download = "errores.xlsx";

            // Simula un clic en el enlace para iniciar la descarga
            a.click();

            // Libera el objeto URL
            window.URL.revokeObjectURL(url);
        } else {
            setAlertOpen(true);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [shouldRefresh]);

    const confirmButton = () => {
        setIsSuccessModalOpen(false);
        window.location.reload();
    }


    return (
        <>
            <Title title={"Importación de archivos"} url={(window.location.href).slice(SIZE_WEB_URL)} />

            <Paper sx={{ p: '24px', borderRadius: '16px' }}>
                <Box display='flex' sx={{ p: 2 }}>
                    <Stack display='column' spacing={1} width='100%'>
                        <Box display='flex'>
                            <Typography sx={{ ...LinkLargeFont, flexGrow: 1 }} variant='h5'>
                                <strong>Carga de pólizas</strong>
                            </Typography>
                            <Box sx={{ flexGrow: 0, pb: 2 }}>
                                <Typography sx={{ flexGrow: 1 }} variant='h5'>
                                    <strong style={{ fontSize: '16px', color: '#E5105d' }}>Ver todos</strong>
                                </Typography>
                            </Box>
                        </Box>

                        <Stack display='column' spacing={1}>
                            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Stack direction='column' spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>
                                            Fecha
                                        </Typography>
                                        <TextField
                                            placeholder="Fecha de alta"
                                            type="date"
                                            value={selectedFecha}
                                            onChange={(e) => setSelectedFecha(e.target.value)}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Stack direction='column' spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>
                                            Nombre
                                        </Typography>
                                        <TextField
                                            placeholder="Nombre"
                                            onChange={(e) => setSelectedNombre(e.target.value)}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Stack style={{ width: '100%', height: '100%' }} direction='column' spacing={1}>
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                type="button"
                                                startIcon={<Search color={ColorPureWhite} />}
                                                size="large"
                                                disableElevation
                                                onClick={handleFetchData}
                                            >
                                                Buscar
                                            </Button>
                                        </div>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Stack>
                </Box>

                {showTable && (
                    loadingValidate ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        // Muestra el DataGrid cuando los datos estén listos
                        <div style={{ marginTop: '10px' }}>
                            <ValidateDataGrid
                                selectedFecha={selectedFecha}
                                selectedNombre={selectedNombre}
                                rows={rows}
                                selectedRow={selectedRow}
                                onSelectRow={handleSelectRow}
                            />
                        </div>
                    )
                )}

                {showValidateButton && (
                    <Box sx={{ display: 'flex', pt: 1 }}>
                        <Typography sx={{ flexGrow: 1 }} variant='h5' />
                        <Box sx={{ flexGrow: 0 }}>
                            <Button
                                variant="contained"
                                type="button"
                                startIcon={<Check />}
                                size="large"
                                disableElevation
                                sx={{
                                    marginRight: '20px',
                                    marginTop: '31px',
                                    backgroundColor: '#e5105d',
                                    textTransform: 'none',
                                    fontSize: '13px',
                                    '&:hover': {
                                        backgroundColor: '#e5105d',
                                    },
                                }}
                                onClick={handlePrintSelectedRow}
                            >
                                Validar
                            </Button>
                        </Box>
                    </Box>
                )}

                <Box sx={{ pr: 6, pl: 2, pt: 2, pb: 2 }}>
                    <Stack display='column' spacing={1}>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <Stack style={{ width: '100%', height: '100%' }} direction='column' spacing={1}>
                                    <div>
                                        {validationClicked ? (
                                            loadingLoad ? (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <CircularProgress />
                                                </div>
                                            ) : (
                                                response && response.fileContent && response.fileContent.length > 0 ? (
                                                    <LoadDataGrid
                                                        onSelectRowsData={handleSelectedRowsData}
                                                        response={response}
                                                    />
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Typography variant="h5" color="#e5105d">
                                                            Documento con formato incorrecto.
                                                        </Typography>
                                                    </div>
                                                )
                                            )
                                        ) : null}
                                    </div>

                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>

                <Box sx={{ display: 'flex', pt: 1 }}>
                    <Typography sx={{ flexGrow: 1 }} variant='h5' />
                    <Box sx={{ flexGrow: 0, pb: 2 }}>
                        {showLoadDataGrid && (
                            <div>
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<Download color="white" />}
                                    size="large"
                                    disableElevation
                                    sx={{
                                        marginRight: '20px',
                                        backgroundColor: '#1976d2',
                                        textTransform: 'none',
                                        fontSize: '13px',
                                        '&:hover': {
                                            backgroundColor: '#1976d2',
                                        },
                                    }}
                                    onClick={handleDownloadErrors}
                                >
                                    Descargar errores
                                </Button>

                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<NorthIcon />}
                                    size="large"
                                    disableElevation
                                    sx={{
                                        marginRight: '20px',
                                        backgroundColor: '#e5105d',
                                        textTransform: 'none',
                                        fontSize: '13px',
                                        '&:hover': {
                                            backgroundColor: '#e5105d',
                                        },
                                    }}
                                    onClick={handleOpenDialog}
                                >
                                    Cargar
                                </Button>
                            </div>
                        )}
                        <Snackbar
                            open={alertOpen}
                            autoHideDuration={3000}
                            onClose={handleAlertClose}
                        >
                            <div>
                                <Alert severity={"info"} sx={{ width: "20%" }}>
                                    No hay errores para descargar.
                                </Alert>
                            </div>
                        </Snackbar>


                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={handleSnackbarClose}
                        >
                            <div>
                                <Alert severity={"info"} sx={{ width: "20%" }}>
                                    {snackbarMessage}
                                </Alert>
                            </div>
                        </Snackbar>
                    </Box>
                </Box>

                {isSuccessModalOpen && (
                    <Modal
                        open={isSuccessModalOpen}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            width: '80%',
                            maxWidth: '800px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <h1>Resumen de importación realizada</h1>
                            <div style={{ height: '620px', width: '100%', marginTop: '20px' }}>
                                <DataGrid
                                    rows={selectedRowsCopy.map((row, index) => ({ ...row, id: index + 1 }))}
                                    columns={columns}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                />
                            </div>
                            <Box sx={{
                                flexGrow: 0,
                                display: 'flex',
                                justifyContent: 'right',
                                paddingTop:'30px'
                            }}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<Check />}
                                    size="large"
                                    disableElevation
                                    sx={{
                                        marginTop: '10px',
                                        backgroundColor: '#e5105d',
                                        textTransform: 'none',
                                        fontSize: '13px',
                                        '&:hover': {
                                            backgroundColor: '#e5105d',
                                        },
                                    }}
                                    onClick={confirmButton}
                                >
                                    Confirmar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                )}


<>
      <Modal
        open={openDialog}
        onClose={() => handleCloseDialog(false)}
        sx={{ width: "100%", height: "100%", top: "150px" }}
        disableEnforceFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "555px",
            borderRadius: "20px",
            padding: "16px",
            margin: "auto",
            top: "150px",
            backgroundColor: ColorPureWhite,
          }}
          textAlign="center"
        >
          <Typography sx={{ ...LinkSmallFont, height: "62px" }}>
            {
              "¿Desea cargar las pólizas de vehículos?"
            }
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{ marginRight: "auto", height: "30px" }}
              variant="outlined"
              onClick={() => handleCloseDialog(false)}
            >
              No
            </Button>
            <Button
              onClick={() => handleCloseDialog(true)}
              sx={{ height: "20px", padding: "10px 25px" }}
            >
              Si
            </Button>
          </Box>
        </Box>
      </Modal>
    </>


                <Snackbar
                    open={successSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessSnackbarOpen(false)}
                >
                    <div>
                        <Alert severity={"success"} sx={{ width: "20%" }}>
                            Agregado correctamente
                        </Alert>
                    </div>
                </Snackbar>

                <Snackbar
                    open={errorSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setErrorSnackbarOpen(false)}
                >
                    <div>
                        <Alert severity={"error"} sx={{ width: "20%" }}>
                            Documento con formato incorrecto.
                        </Alert>
                    </div>
                </Snackbar>
            </Paper>
        </>
    );

}

export default PolicyLoad;