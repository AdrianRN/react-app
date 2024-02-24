import React, { useEffect, useState } from 'react';
import Button from '../../../OuiComponents/Inputs/Button';
import Select from '../../../OuiComponents/Inputs/Select';
import { Alert, Grid, IconButton, MenuItem } from '@mui/material';
import { Attached, CheckedIcon, Delete, Plus } from '../../../OuiComponents/Icons';
import { Avatar, Typography } from '../../../OuiComponents/DataDisplay';
import { ColorPink, LinkLargeFont, TextSmallFont } from '../../../OuiComponents/Theme';
import Title from '../../Title/Title';
import { Box, Stack } from '../../../OuiComponents/Layout';
import { DatePicker, InputAdornment, TextField } from '../../../OuiComponents/Inputs';
import Divider from '../../../OuiComponents/DataDisplay/Divider';
import { DataGrid } from '../../../OuiComponents/DataGrid';
import FormatData from '../../../../utils/Formats.Data';
import { postClaims } from '../../../../services/claims.service';
import { useParams } from 'react-router-dom';
import { SIZE_WEB_URL } from '../../../../enviroment/enviroment';
import catalogValueService from '../../../../services/catalogvalue.service';
import ResultObject from '../../../../models/ResultObject';
import PoliciyService from '../../../../insuranceServices/policies.service';
import PolicyInfo from '../../../../models/PolicyInfo';
import Paper from '../../../OuiComponents/Surfaces/Paper';
import Constants from '../../../../utils/Constants';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useAlertContext } from '../../../../context/alert-context';
import MessageBar from '../../../OuiComponents/Feedback/MessageBar';
import { GridColDef } from '@mui/x-data-grid';
import { LogBooksService } from '../../../../insuranceServices/LogBooks';
import ModalClaims from './ModalClaims';
import fileStorageService from '../../../../services/fileStorage.service';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
  
  const NumericFormatCustomLimit100 = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
      const { onChange, ...other } = props;
  
      return (
        <NumericFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            const newValue = values.floatValue !== undefined ? values.floatValue : 0;
            const clampedValue = Math.min(100, newValue);
            onChange({
              target: {
                name: props.name,
                value: clampedValue.toString(),
              },
            });
          }}
          thousandSeparator
          valueIsNumericString
          decimalSeparator={"."}
          decimalScale={2}
        />
      );
    }
  );

  const NumericFormatCustomNoLimit = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
      const { onChange, ...other } = props;
  
      return (
        <NumericFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            const newValue = values.floatValue !== undefined ? values.floatValue : 0;
            // No hay límite máximo (eliminado el clampedValue)
            onChange({
              target: {
                name: props.name,
                value: newValue.toString(),
              },
            });
          }}
          thousandSeparator
          valueIsNumericString
          decimalSeparator={"."}
          decimalScale={2}
        />
      );
    }
);
  



interface ResponsabilityTypes {
    catalogValueId: string;
    folio: string;
    description: string;
    catalogId: string;
    objectStatusId: number;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string;
    updatedBy: string | null;
}


export default function ClaimCapture() {
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
      } = useAlertContext();
    const { policyId } = useParams();
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [showAlertTimeout, setShowAlertTimeout] = useState<NodeJS.Timeout | null>(null);
    const [policyFolio, setPolicyFolio] = React.useState(policyId ? policyId : "");
    const [responsability, setResponsability] = useState<ResponsabilityTypes[]>([]);
    const [policyInfo, setPolicyInfo] = useState<PolicyInfo | null>(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const [formData, setFormData] = useState({
        fecha: '',
        cliente: "",
        poliza: policyFolio,
        aseguradora: "",
        noSiniestro: "noSiniestro",
        tipoResponsabilidad: "",
        deducible: "",
        porcentajeDanos: "",
        fechaEntrega: null,
        observaciones: "",
        responsibility: ""
    });
   // console.log(formData.cliente)

    // Función para manejar los cambios en los campos de entrada
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
  const handleOpenModalClaims = () => {
    setOpenModal(true)
  }
  const handleCloseModalClaims = () => {
    setOpenModal(false)
  }
  const deleteLogBook = (params: any) => {
    
    //console.log(params.row.folio)
    const fetchDelete = async () => {
        fileStorageService.deleteByFolio(params.row.folio)
        .then((response: any) => {
            setDataAlert(true, "El seguimiento se ha eliminado.", "success" , autoHideDuration)
            fetchClaimsRows() //para actualizar datagrid despues de la eliminacion
        })
        .catch((e: Error) => {
            setDataAlert(true, e.message, "error", autoHideDuration);
        })
    }
    fetchDelete()
    
  }

  const columns:  GridColDef[] = [
    {
        field: "notes",
        headerName: "Seguimiento",
        width: 250,
        flex: 1
    },
    {
        field: "issueDate",
        headerName: "Creado",
        width: 150,
        flex: 1,
        // valueFormatter: (params) => {
        //     const date = new Date(params.value);
        //     return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        // }
    },
    {
        field: "effectiveDate",// Por el momento se utiliza para guardar el nombre
        headerName: "Cliente",
        width: 250,
        flex: 1
    },
    {
        field: "description",
        headerName: "Comentarios",
        width: 150,
        flex: 1,
    },
    {
        field: "Acciones",
        headerName: "Acciones",
        type: "Action",
        width: 100,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: any) => (
            <>
                <IconButton onClick={() => deleteLogBook(params)}>
                    <Delete color={ColorPink} />
                </IconButton>
                <IconButton onClick={() => handleConsultFile(params)}>
                    <Attached color={ColorPink} />
                </IconButton>
            </>
        ),
    },
];

const handleConsultFile = (params: any) => {
    window.open(params.row.fileUrl, "_blank");
  };

    // Función para manejar el botón "Guardar Siniestro"
    const handleGuardarSiniestro = async () => {
        try {

            const fecha = formData.fecha ? new Date(formData.fecha) : null;
            const fechaEntrega = formData.fechaEntrega ? new Date(formData.fechaEntrega) : null;

            // Construir un objeto con los datos del formulario
            const formDataToSend = {
                carClaim: 'carClaim',
                dateClaim: fecha ? fecha.toISOString() : '',
                client: formData.cliente,
                policy: formData.poliza,
                insuranceCompany: formData.aseguradora,
                claimNumber: formData.noSiniestro,
                liabilityType: formData.tipoResponsabilidad,
                deductible: formData.deducible,
                damagePercentage: formData.porcentajeDanos,
                observations: formData.observaciones,
                deliveryCommitmentDate: fechaEntrega ? fechaEntrega.toISOString() : '',
                responsibility: 'responsability',
                objectStatusId: '0'
            };          
            

            // console.log(formDataToSend);

            // Enviar los datos al servidor utilizando Axios
            const result = await postClaims(formDataToSend);

            //setAlertMessage("Siniestro guardado con éxito");
            setDataAlert(
                true,
                "Siniestro guardado con éxito.",
                "success",
                autoHideDuration
              );

            //Limpiar el formulario o hacer cualquier otra acción necesaria
            setFormData({
                fecha: '',
                cliente: policyInfo!.clientName,
                poliza: policyFolio,
                aseguradora: policyInfo!.insuranceCompany,
                noSiniestro: "noSiniestro",
                tipoResponsabilidad: "",
                deducible: "",
                porcentajeDanos: "",
                fechaEntrega: null,
                observaciones: "",
                responsibility: ""
            });
           
        } catch (error) {
            // Manejar errores, por ejemplo, mostrar una alerta de error
            console.error('Error al guardar el siniestro:', error);
            setDataAlert(
                true,
                "Error al guardar el siniestro.",
                "error",
                autoHideDuration
              );
        }
    };

    useEffect(() => {
        // Limpia el timeout cuando el componente se desmonta
        return () => {
            if (showAlertTimeout) {
                clearTimeout(showAlertTimeout);
            }
        };
    }, [showAlertTimeout]);
    


    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        // Assuming you have an async function that fetches data
        async function fetchData() {
            try {
                const { data } = await catalogValueService.getCatalogValueByCatalogId(Constants.typeCarResponsibilityFolio);
                setResponsability(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData(); // Call the async function when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlLogoCompany = localStorage.getItem("urlLogoCompany");
                setImage(urlLogoCompany);
                const response = await PoliciyService.getPoliciesByFolio(policyId!);
                const data = response.data;
                setPolicyInfo(data);
                
                // Set default values for "Cliente" and "Aseguradora" from policyInfo
                if (data) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        cliente: data.clientName || "", 
                        aseguradora: data.insuranceCompany || "", 
                    }));
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
    
        fetchData();
    }, []);

    const fetchClaimsRows = async () => {
        try {
            setLoading(true)
            const response = await fileStorageService.getFileStorageByExternalFolio(formData.poliza);
            // Aquí se obtienen los siniestros por el folio de la poliza
            setRows(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error al obtener los reclamos:', error);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchClaimsRows();
    }, []);


    const textFieldStyle = {
        // Establece el tamaño de la fuente y la altura del TextField aquí
        fontSize: '16px', // Tamaño de la fuente
        height: '100px', // Altura del TextField
    };

    return (
        <>
            <Title title={"Captura de siniestro"} url={(window.location.href).slice(SIZE_WEB_URL)} />
            <Paper sx={{ p: '24px', borderRadius: '16px' }}>
                

                        <Typography sx={LinkLargeFont} style={{ marginBottom: '20px' }}><strong>Datos del siniestro</strong></Typography>

                        {isAlertVisible && (
                            <Alert
                                severity="success" // Puedes cambiar 'success' a 'error', 'warning', o 'info' según el tipo de alerta que desees
                                sx={{
                                    position: 'fixed',
                                    bottom: '20px', // Ajusta la posición vertical
                                    left: '20px', // Ajusta la posición horizontal
                                    zIndex: 9999, // Asegura que esté en la parte superior
                                }}
                                onClose={() => setIsAlertVisible(false)} // Cierra la alerta al hacer clic en la 'x'
                            >
                                {alertMessage}
                            </Alert>
                        )}

                        <Avatar
                            src={image ?? ''} // Asigna la URL de la imagen aquí
                            variant="rounded"
                            alt="Policy Image"
                            sx={{
                                borderRadius: '50%',
                                width: "250px", // Tamaño más pequeño
                                height: "250px", // Tamaño más pequeño
                                margin: "0 auto", // Centra horizontalmente
                                marginBottom: "20px", // Opcional: Agregar un margen inferior a la imagen
                            }}
                        />

                        <Box style={{ marginBottom: "30px" }} paddingTop={1}>
                            <Grid container rowSpacing={4} columnSpacing={{ xs: 4 }}>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Fecha</Typography>
                                        {/* <DatePicker
                                            value={formData.fecha}
                                            onChange={(date) => handleInputChange({ target: { name: "fecha", value: date } })}

                                        /> */}
                                        <TextField
                                        fullWidth
                                        name="issuanceDate"
                                        value={formData.fecha}
                                        onChange={(value) => {
                                            handleInputChange({ target: { name: "fecha", value: value.target.value } })
                                        }}
                                        type="date"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Cliente</Typography>
                                        <TextField value={formData.cliente} onChange={handleInputChange}
                                            placeholder="Cliente" name="cliente"
                                            disabled={policyFolio !== ''}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Póliza</Typography>
                                        <TextField
                                            value={formData.poliza}
                                            onChange={handleInputChange}
                                            placeholder="Póliza"
                                            name="poliza"
                                            disabled={policyFolio !== ''}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Aseguradora</Typography>
                                        <TextField value={formData.aseguradora} disabled={policyFolio !== ''} onChange={handleInputChange} placeholder="Aseguradora" name="aseguradora" />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Tipo de responsabilidad</Typography>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            style={{ width: '100%' }}
                                            value={formData.tipoResponsabilidad}
                                            onChange={(e) => handleInputChange({ target: { name: "tipoResponsabilidad", value: e.target.value } })}
                                            name="tipoResponsabilidad"
                                        >

                                            {
                                                responsability.map(element => (
                                                    <MenuItem value={element.description}>{element.description}</MenuItem>
                                                ))
                                            }





                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Deducible</Typography>
                                        {/* <TextField type="number" value={formData.deducible} onChange={handleInputChange} placeholder="Deducible" name="deducible" /> */}
                                        <TextField
                                            name="deducible"
                                            value={Number(formData.deducible ? formData.deducible : 0.0001).toFixed(2)}
                                            onChange={handleInputChange}
                                            placeholder="Deducible"
                                            InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">$</InputAdornment>
                                                ),
                                                inputComponent: NumericFormatCustomNoLimit as any,
                                              }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Porcentaje de daños</Typography>
                                        
                                        <TextField
                                            placeholder="porcentajeDanos"
                                            name="porcentajeDanos"
                                            type="number"
                                            value={formData.porcentajeDanos
                                                ?formData.porcentajeDanos:'0.02'}
                                            onChange={handleInputChange}
                                            InputProps={{
                                            inputComponent: NumericFormatCustomLimit100 as any,
                                            endAdornment: (
                                                <InputAdornment position="end">%</InputAdornment>
                                            ),
                                            inputProps: {
                                                min:0.02,
                                                max: 100,
                                                maxLength: 3, // Máximo de 15 caracteres permitidos
                                            },
                                            
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Fecha de entrega</Typography>
                                        {/* <DatePicker
                                            value={formData.fechaEntrega}
                                            onChange={(date) => {
                                                console.log('DatePicker',date)
                                                handleInputChange({ target: { name: "fechaEntrega", value: date } })
                                            }}

                                        /> */}
                                        <TextField
                                        fullWidth
                                        name="issuanceDate"
                                        value={formData.fechaEntrega}
                                        onChange={(value) => {
                                            handleInputChange({ target: { name: "fechaEntrega", value: value.target.value } })
                                        }}
                                        type="date"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={12}> {/* Cambia sm={12} para ocupar las 3 columnas */}
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ ...TextSmallFont }}>Observaciones</Typography>
                                        <TextField
                                            style={{ width: '100%' }}
                                            value={formData.observaciones}
                                            onChange={handleInputChange}
                                            placeholder="Observaciones"
                                            name="observaciones"
                                            multiline
                                            rows={4}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>


                        <Divider style={{ marginBottom: "20px" }} />


                        <Typography sx={LinkLargeFont} style={{ marginBottom: '20px' }}><strong>Bitácora</strong></Typography>
                        <Grid container spacing={3} style={{ marginBottom: '15px' }}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Typography sx={TextSmallFont} style={{ marginBottom: '10px' }}>Seguimiento</Typography>
                                
                            </Grid>
                           
                        </Grid>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', marginBottom: '10px' }}>
                                <Button onClick={handleOpenModalClaims}>
                                    Nuevo 
                                    <IconButton><Plus color='#fff'/></IconButton>
                                </Button>
                        </div>

                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.folio + ""}
                            disableRowSelectionOnClick
                        />


                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', marginBottom: '10px' }}>
                    <Button onClick={handleGuardarSiniestro} startIcon={<CheckedIcon />}>Guardar Siniestro</Button>
                </div>
                <MessageBar
                open={isSnackbarOpen}
                severity={severity}
                message={messageAlert}
                close={handleSnackbarClose}
                autoHideDuration={autoHideDuration}
                />
            </Paper>
            { openModal && 
            <ModalClaims
              open={openModal}
              clientName={formData.cliente}
              policyFolio={formData.poliza}
              close={()=>{
                handleCloseModalClaims()
                fetchClaimsRows()
              }}
              
              />
            }
        </>
    );
}
