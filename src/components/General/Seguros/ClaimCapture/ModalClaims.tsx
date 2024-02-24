import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import { ColorYellow, LinkLargeFont, LinkSmallFont } from "../../../OuiComponents/Theme";
import { Button, DatePicker, TextField } from "../../../OuiComponents/Inputs";
import LogBooks from "../../../../insuranceModels/LogBooks";
import { LogBooksService } from "../../../../insuranceServices/LogBooks";
import { useAlertContext } from "../../../../context/alert-context";
import { Form, useFormik } from "formik";
import * as Yup from "yup"
import Format from "../../../../utils/Formats.Data";
import { error } from "node:console";
import { Avatar, Typography } from "../../../OuiComponents/DataDisplay";
import { Upload } from "@mui/icons-material";
import Constants from "../../../../utils/Constants";
import FormatData from "../../../../utils/Formats.Data";
import Cloud from "../../../OuiComponents/Icons/Cloud";
import FileStorage from "../../../../models/FileStorage";
import fileStorageService from "../../../../services/fileStorage.service";
import DownloadCloud from "../../../OuiComponents/Icons/DownloadCloud";
import { CircularProgress } from "../../../OuiComponents/Feedback";



function ModalClaims(props: any) {
    let disabledHypertext = false;
    if (props.modifyValueDisabled === true) {
        disabledHypertext = props.modifyValueDisabled;
    }
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();
   const [claims, setClaims] = React.useState<FileStorage | null>(null)
   const [editClaim, setEditClaim] = React.useState({})
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [image, setImage] = React.useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [selectedFileName, setSelectedFileName] = useState('');
   const [expectedDate, setExpectedDate] = useState(
    Format.dateCurrentYYYYMMDD()
  );
    console.log(props.clientName)

    const handleCloseModal = () => {
        props.close(false)

        console.log('se cerro')
    }

    React.useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try{
            const response = LogBooksService.getLogBooksByPolicy(props.policyFolio)
            console.log(response)
            setEditClaim(response)
        } catch(error){
            console.error('Error al obtener datos', error);
        }
    };

    const onSubmit = () => {
      if (!claims?.notes || !claims?.description) {
        setDataAlert(true,"Por favor, ingrese los campos de comentarios y seguimiento", 'warning', autoHideDuration);
        return; 
      }
      if (claims?.fileBytes) {
        setLoading(true)
        fileStorageService
          .post(claims)
          .then((response: any) => {
            if (response.message === "OK") {
              setDataAlert(
                true,
                "Se registro un nuevo seguimiento.",
                "success",
                autoHideDuration
              );
              setTimeout(() => {
                props.close(false)
              }, 2000)
              //setLoading(true);
            } else {
              setDataAlert(true, response.message, "error", autoHideDuration);
            }
          })
          .catch((e: Error) => {
            setDataAlert(true, e.message, "error", autoHideDuration);
          }).finally(()=>{
           // handleCleanForm();
           setLoading(false)
          });
          
      }
    }

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
        let updatedFileForm = { ...claims };
        updatedFileForm.externalFolio = props.policyFolio;
        updatedFileForm.fileName = fileName;
        updatedFileForm.notes = notes ?? "";
        updatedFileForm.fileExtension = fileExt;
        updatedFileForm.containerName = Constants.claimContainerName;
        updatedFileForm.objectStatusId = 1;
        updatedFileForm.fileBytes = readerSplit ?? "";
        updatedFileForm.fileUrl = "";
        updatedFileForm.effectiveDate =  props.clientName ?? ""; //En lo que se actualiza el objeto aqui se guarda el nombre del cliente
        let currentTimestamp = Date.now();
        updatedFileForm.issueDate = issueDate ?? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(currentTimestamp);
        ;
        setClaims(updatedFileForm);
  
      };
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


    return (
        <>
            <Dialog
                open={props.open}
                aria-labelledby="modal-modal-title"
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "15px",
                        padding: 1,
                    },
                }}>
                {/* <IconButton onClick={handleCloseModal} sx={{padding: '5px'}}><Cancel/></IconButton> */}
                <DialogTitle sx={{ ...LinkLargeFont, padding: '5px' }}>Captura de registro de bitacora</DialogTitle>
               
                <Box component="form">
                <DialogContent sx={{ overflowX: 'hidden', padding: '10px' }}> 
                <Grid direction='row' justifyContent='space-between'>
                  <Stack direction='row' justifyContent='space-between'>
                    
                  <Grid spacing={3} padding='10px'>
                    <Stack direction='row' justifyContent='space-between' padding='10px'>
                      <Typography>Nombre
                        <TextField
                          label={props.clientName}
                          disabled
                          name="name"
                         
                        />
                      </Typography>
                    </Stack>
                    <Stack direction='row' justifyContent='space-between' padding='10px'>
                    <Typography>
                      Fecha 
                      <TextField
                      type="date"
                        sx={{width: '110%'}}
                        onChange={(event: any) => {
                          const updatedFileForm = { ...claims};
                          updatedFileForm.issueDate = event.target.value
                          setClaims(updatedFileForm)
                        }}
                        defaultValue=''
                        value={claims?.issueDate ? `${new Date(claims.issueDate).toISOString().split("T")[0]}`
                               : FormatData.dateFormat(new Date()).toString()}
                      />
                    </Typography>
                      
                    </Stack>
                    <Stack direction='row' justifyContent='space-between' padding='10px'>
                     <Typography>
                      Comentarios
                     <TextField
                        onChange={(event: any) => {
                          const updatedFileForm = { ...claims};
                          updatedFileForm.description = event.target.value
                          setClaims(updatedFileForm)
                        }}
                        defaultValue=''
                        value={claims?.description ? claims.description: ''}
                        
                      />
                     </Typography>
                     

                    </Stack>
                    <Stack direction='row' justifyContent='space-between' padding='10px'>
                        <Typography>
                          Seguimiento
                        <TextField
                        onChange={(event: any) => {
                          const updatedFileForm = { ...claims};
                          updatedFileForm.notes = event.target.value
                          setClaims(updatedFileForm)
                        }}
                        defaultValue=''
                        value={claims?.notes ? claims.notes: ''}
                         />
                        </Typography>
                      
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={8} md={8}>
                    <Box
                      flexGrow={1}
                      flexBasis={0}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      paddingTop='50%'
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        border="2px dashed #1475cf"
                        height="150%"
                        width="80%"
                        borderRadius={3}
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => inputRef.current?.click()}
                        
                      >
                        <input
                          type="file"
                          accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/*"
                          hidden
                          ref={inputRef}
                          onChange={handleChangeFile}
                        />
                    
                       <Box width="50%" height="90%">
                       <Stack direction="column" spacing={1} alignItems="center">
                    <DownloadCloud color="#8f91aa" />
                    <Typography>{selectedFileName}</Typography>
                    <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                      Subir Archivo
                    </label>
                  </Stack>
                     </Box>
{/*                     
                      <>
                      <Cloud />
                      <Typography sx={LinkSmallFont}>
                        Selecciona tu imagen
                      </Typography>
                    </> */}
                    

                      </Box>
                    </Box>
                  </Grid>
                </Stack>

              </Grid>

                    
                    <Grid direction='row' spacing={2} sx={{ justifyContent: 'space-between' }} >
                        <Stack direction='row' sx={{ justifyContent: 'space-between', paddingTop: ' 15px' }}>
                            <Button onClick={handleCloseModal}>Cancelar</Button>
                            <Button onClick={onSubmit}>Guardar</Button>
                        </Stack>
                    </Grid>
                </DialogContent>
                </Box>
                {loading && <CircularProgress 
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "49%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 9999, // Coloca el indicador de progreso por encima de todo
                }}/>}
            </Dialog>

        </>
    )
}

export default ModalClaims;