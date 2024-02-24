import { Box, IconButton,styled } from "@mui/material";
import React from "react";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import {
    ColorPink,
    ColorPureWhite,
    LinkLargeFont,
    TextSmallFont,
} from "../../../OuiComponents/Theme";

import { Grid } from "../../../OuiComponents/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { ArrowRight, Delete,Download } from "../../../OuiComponents/Icons";
import {ClaimsService} from "../../../../services/claims.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import DownloadCloud from "../../../OuiComponents/Icons/DownloadCloud";
import FileStorage from "../../../../models/FileStorage";
import fileStorageService from "../../../../services/fileStorage.service";
import Constants from "../../../../utils/Constants";
import { name } from "@azure/msal-browser/dist/packageMetadata";
import { add } from "lodash";
import { url } from "inspector";
import { id } from "date-fns/locale";

interface IClaimLog {
    RegistrationDate: string,
    Reason: string,
    description: string,
    logType: string,
    policyFolio: string,
    claimFolio: string,
    attachedFiles: IattachedFiles[]
}

interface IattachedFiles{
    name: string,
    type: string,
    url: string,
    _id: string
}

const StyledBox = styled(Box)({
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: "100%",
    padding: '20px',
    width: '100%'
  });

  

export default function TabClaimsLog(props: any) {
    const [valuesData, setValuesData] = React.useState<IClaimLog>();
    const [gridData, setGridData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [fileForm, setFileForm] = React.useState<FileStorage | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = React.useState('');


    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    React.useEffect(() => {
        // Realiza la petición GET al montar el componente
        getReceiptsLogsData();
    }, [props.data.folio]
    );

    const setBase64 = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const readerSplit = reader.result?.toString().split(",")[1] ?? null;
          const fileName = file.name.toString();
          const notes = file.notes;
          const fileExt = file.name.toString().split(".")[1];
          const effectiveDate = file.effectiveDate;
          const issueDate = file.issueDate;
          let updatedFileForm = { ...fileForm };
          updatedFileForm.externalFolio = props.data.folio;
          updatedFileForm.description = "";
          updatedFileForm.fileName = fileName;
          updatedFileForm.fileExtension = fileExt;
          updatedFileForm.containerName = Constants.claimContainerName;
          updatedFileForm.fileBytes = readerSplit ?? "";
          updatedFileForm.fileUrl = "";
          let currentTimestamp = Date.now();
          updatedFileForm.issueDate = issueDate ?? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(currentTimestamp);
          ;
          setFileForm(updatedFileForm);
    
        };
      };
    

    const getReceiptsLogsData = () => {
        setLoading(true);
        ClaimsService.getReceiptsLogs(props.data?.folio)
            .then(async (result) => {
                if (result.data === null) {
                    await ClaimsService.patchFlags(props.data.receiptFolio, "emailNotification", false);
                    await ClaimsService.patchFlags(props.data.receiptFolio, "hasLogs", false);
                }

                if (result.data.length === 1 && result.data[0].logType === "log") {
                    await ClaimsService.patchFlags(props.data.receiptFolio, "emailNotification", false);
                    await ClaimsService.patchFlags(props.data.receiptFolio, "hasLogs", true);
                }
                // Agregar un identificador único a cada objeto de datos
                const dataWithIds = result.data.map((item: any, index: any) => ({
                    ...item,
                    id: index + 1, // Puedes ajustar el método de generación de ID según tus necesidades
                }));

                // Actualizar el estado con los datos y sus identificadores
                setGridData(dataWithIds);
            })
            .catch((error) => {
                setGridData([]);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChangeFile = (e: any) => {
        if (e.target instanceof HTMLInputElement && e.target.files?.length) {
          setBase64(e.target.files[0]);
        }
    
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
          setSelectedFileName(selectedFile.name);
        }
      };

    const onSubmit = (data: IClaimLog, { resetForm }: { resetForm: () => void }) => {
        data.logType = "log";
        if (fileForm?.fileBytes) {
            fileStorageService
              .post(fileForm)
              .then((response: any) => {
                if (response.message === "OK") 
                {
                    
                    data.attachedFiles[0].url= response.data?.fileUrl;
                    data.attachedFiles[0].name = response.data?.fileName;
                    data.attachedFiles[0].type = response.data?.fileExtension;

                    ClaimsService.postClaimsLogs(props.data.receiptFolio, data)
                    .then(async (result: any) => {
                        
                        setDataAlert(true, "Creado exitosamente.", "success", autoHideDuration);

                        resetForm();
                        
                        getReceiptsLogsData();
                    })
                    .catch((error) => {
                        // Manejar el error aquí si es necesario
                        console.error(error);
                    });

                  setDataAlert(
                    true,
                    "El archivo se registró al expediente.",
                    "success",
                    autoHideDuration
                  );
                  setLoading(true);
                } else {
                  setDataAlert(true, response.message, "error", autoHideDuration);
                }
              })
              .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            });
        } else{
        ClaimsService.postClaimsLogs(props.data.receiptFolio, data)
            .then(async (result: any) => {
                
                setDataAlert(true, "Creado exitosamente.", "success", autoHideDuration);

                resetForm();
                
                getReceiptsLogsData();
            })
            .catch((error) => {
                // Manejar el error aquí si es necesario
                console.error(error);
            });
        }
            
    };


    const initialValues: IClaimLog = {
        RegistrationDate: valuesData?.RegistrationDate ?? "",
        Reason: valuesData?.Reason ?? "",
        description: valuesData?.description ?? "",
        logType: valuesData?.description ?? "log",
        policyFolio :props.data?.policy,
        claimFolio: props.data?.folio,
        attachedFiles: [{
            name:"",
            type:"",
            url:"",
            _id:""
        }]
        //attachedFiles: []
        
    }
    
    const { handleSubmit, handleChange, errors, values } =
        useFormik({
            initialValues,
            validationSchema: Yup.object({
                RegistrationDate: Yup.string().required("Este campo es requerido"),
                Reason: Yup.string().required("Este campo es requerido."),
                description: Yup.string().required("Este campo es requerido."),

            }),
            onSubmit,
            enableReinitialize: true,
        });

    const columns: GridColDef[] = [
        {   field: 'description', 
            headerName: 'Descripción', 
            flex: 1
         },
        { field: 'registrationDate', headerName: 'Fecha de registro', flex: 1 },
        { field: 'reason', headerName: 'Razón', flex: 1 },
        {
            field: '',
            headerName: 'Acciones',
            renderCell: (params) => 
            params.row.attachedFiles[0].url =="" ? 
            (
                <IconButton
                    sx={{ marginLeft: '0px', width: '40px', height: '40px' }}
                    onClick={() => {
                        handleDelete(params.row.claimFolio)
                    }
                    }
                    >
                    <Delete color={ColorPink} />
                </IconButton>
            ):
            (
                <>
                <IconButton
                sx={{ marginLeft: '8px', width: '40px', height: '40px' }}
                 onClick={() => handleDownloadFileClick(params.row.attachedFiles[0].url)}>
                <Download color={ColorPink} />
                </IconButton>
                <IconButton
                    sx={{ marginLeft: '0px', width: '40px', height: '40px' }}
                    onClick={() => {
                        handleDelete(params.row.claimFolio)
                    }
                    }
                    >
                    <Delete color={ColorPink} />
                </IconButton>
                
                </>
            ),
              
        },
    ];

    const handleDownloadFileClick = (url: any) => {
        window.open(url, "_blank");
      };

    const handleDelete = (claimLogId: string) => {
        // Ejecutar la acción de eliminación aquí
        ClaimsService.deleteClaimLog(claimLogId)
            .then((result) => {
                setDataAlert(true, "Eliminado exitosamente.", "success", autoHideDuration);

                // Después de un DELETE exitoso, actualiza los datos con una nueva petición GET
                getReceiptsLogsData();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <Box component='form' onSubmit={handleSubmit} maxWidth="auto">
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Bitácora
                </Typography>
                <Stack direction="column">
                    <Stack direction="row" display="flex" spacing={1}>
                        <Grid
                            container
                            flexGrow={1}
                            flexBasis={0}
                            rowSpacing={1}
                            columnSpacing={{ xs: 1 }}
                        >
                            <Grid item xs={4} >
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{ paddingBottom: "32px" }}
                                >
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Fecha de registro
                                    </Typography>
                                    <TextField
                                        name="RegistrationDate"
                                        value={values.RegistrationDate}
                                        onChange={handleChange}
                                        type="date"
                                        helperText={errors.RegistrationDate}
                                        error={!!errors.RegistrationDate}
                                    />

                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{ paddingBottom: "32px" }}
                                >
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Razón
                                    </Typography>
                                    <TextField
                                        name="Reason"
                                        value={values.Reason}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.Reason}
                                        error={!!errors.Reason}
                                    />
                                </Stack>
                            </Grid>


                            <Grid item xs={12} sm={4}>
                                <Stack direction="column" spacing={1}>
                                    <Typography sx={TextSmallFont}>Adjuntar</Typography>

                                    <StyledBox
                                        height="70%"
                                        width="100%"
                                        borderRadius={3}
                                        sx={{
                                            cursor: "pointer",
                                            position: "relative",
                                            marginBottom: '30px',
                                            backgroundColor: fileForm && fileForm.description ? '#ececec' : '#f2f2f2',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '20px',
                                            opacity: fileForm && fileForm.description ? 1 : 0.5,
                                        }}
                                        onClick={() =>inputRef.current?.click()}
                                        >
                                        <input
                                            type="file"
                                            accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/*"
                                            id="file-upload"
                                            style={{ display: "none" }}
                                            onChange={handleChangeFile}
                                            ref={inputRef}
                                        />
                                        <Stack direction="column" spacing={1} alignItems="center">
                                            <DownloadCloud color="#8f91aa" />
                                            <Typography>{selectedFileName}</Typography>
                                            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                                            Subir Archivo
                                            </label>
                                        </Stack>
                                    </StyledBox>
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Stack direction="column" spacing={1}>
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Descripción
                                    </Typography>
                                    <TextField sx={{ height: "200px" }}
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.description}
                                        error={!!errors.description}

                                    />
                                </Stack>
                            </Grid>

                            

                            <Grid item xs={12} md={20} textAlign="end">
                                <Button sx={{ marginTop: '32px', marginBottom: '26px' }} type="submit">Guardar</Button>
                            </Grid>

                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        height: '100%', // Puedes ajustar la altura según tus necesidades
                                        width: '100%', // Ajusta el ancho según tus necesidades
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <DataGrid
                                    rows={gridData}
                                    columns={columns}
                                    disableRowSelectionOnClick
                                    sx={{ mt: 2 }}
                                />
                            )}

                            <MessageBar
                                open={isSnackbarOpen}
                                severity={severity}
                                message={messageAlert}
                                close={handleSnackbarClose}
                                autoHideDuration={autoHideDuration}
                            />
                        </Grid>
                    </Stack>
                </Stack>

            </Box>
        </>
    );
}
