import React from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import { ColorPink, ColorPureWhite, TextSmallFont, TextXSmallFont } from "../../../OuiComponents/Theme";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import GetFileData from "../../../../utils/GetFileData";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Complete, Delete, Download, Refresh } from "../../../OuiComponents/Icons";
import { Box, IconButton, styled } from "@mui/material";
import DownloadCloud from "../../../OuiComponents/Icons/DownloadCloud";
import dayjs from "dayjs";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import fileStorageService from "../../../../services/fileStorage.service";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";

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
interface File {
  externalFolio: string; //Es el folio del padre
  fileName: string; //Nombre del archivo
  description: string; //Se coloca una descripcion del archivo
  notes: string; //Se agregan notas adicionales al archivo
  fileExtension: string; //Extension del archivo
  fileBytes: string; //Aqui se colocan los bytes del archivo
  containerName: string; //Nombre del contenedor donde se almacenara el archivo
  objectStatusId: number; //Estatus del objeto
  effectiveDate: string; //Fecha de vigencia
  issueDate: string; //Fecha de expedicion
}
interface TabConditionsProps {
  //Creamos el tipo de props
  data: string | undefined; // Folio de la compania, se agrego undefined para acoplarse a TabModalCompany
  onClose: () => void; // Función para cerrar el componente
}
function TabConditions({ data, onClose }: TabConditionsProps) {  //Colocamos el tipeado de los props
    const [rows, setRows] = React.useState< File[] >([]);
    const [load, setLoad] = React.useState(true);
    React.useEffect(()=>{
        const fetchRowsData = ()=>{
            if(data&&data!=='')
                fileStorageService.getFileStorageByExternalFolio(data).then((response)=>{
                    if(response?.data)
                        setRows(response.data);
                }).catch((e)=>{});
            setLoad(false);
        };
        if(load===true)
            fetchRowsData();
    },[load]);
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const initialValues:File = {
        externalFolio: data??'',
        fileName: "",
        description: "",
        notes: "",
        fileExtension: "",
        fileBytes: "",
        containerName: "boundsourcedocument",
        objectStatusId: 1,
        effectiveDate: dayjs(new Date()).toISOString(),
        issueDate: dayjs(new Date()).toISOString(),
      };

    const yupValidationFile =Yup.object({
        //externalFolio: Yup.string().required("Este campo es requerido."),
        fileName: Yup.string().required("Este campo es requerido."),
        description: Yup.string().required("Este campo es requerido."),
        notes: Yup.string().required("Este campo es requerido."),
        fileExtension: Yup.string().required("Este campo es requerido."),
        fileBytes: Yup.string().required("Este campo es requerido."),
        //containerName: Yup.string().required("Este campo es requerido."),
        //objectStatusId: Yup.string().required("Este campo es requerido."),
        //effectiveDate: Yup.string().required("Este campo es requerido."),
        //issueDate: Yup.string().required("Este campo es requerido."),
      });
      const onSubmit = async (file: File)=>{
        const fileName = (file.fileName).replace(/ /g, '_');
        const description = (file.description).replace(/ /g, '_')??'_';
        const fullFileName = values.externalFolio+'-'+description+'-'+fileName;
        const newFile = {
            ...file,
            fileName:fullFileName
        }
        if(rows){
            const TempRows = rows.reduce((acc:any,el:any)=>{
                acc[el.description]=el;
                return acc;
            },{})
            if(TempRows[file.description]){
                setFieldError("description", "Por favor, seleccione otro nombre..");
                setDataAlert(
                    true,
                    `Ya existe un archivo con ese título, por favor, elija otro.`,
                    "error",
                    autoHideDuration
                );
                return '';
            }
        }
        await fileStorageService
        .post(newFile).then((response)=>{
            setLoad(true);
            setDataAlert(
                true,
                "Archivo agregado.",
                "success",
                autoHideDuration
            );
            handleCleanForm();
        }).catch((e)=>{
            setDataAlert(
                true,
                "Error al agregar archivo.",
                "error",
                autoHideDuration
            );
        });
      };
    const {
        handleSubmit,
        handleChange,
        errors,
        values,
        setFieldValue,
        submitForm,
        setFieldError,
      } = useFormik({
        initialValues,
        validationSchema: yupValidationFile,
        onSubmit,
      });
    const handleCleanForm = ()=>{
        setFieldValue('fileName','');
        setFieldValue('fileExtension','');
        setFieldValue('fileBytes','');
        setFieldValue('description','');
        setFieldValue('notes','');
        setFieldError("description", "");
        setFieldError("notes", "");
        if(inputRef?.current?.value &&inputRef?.current?.value!=='')
            inputRef.current.value = '';
    };
    const handleDeleteFileClick = async (params: any) => {
        if(params?.row?.folio)
            await fileStorageService
            .deleteByFolio(params.row.folio).then((response)=>{
                setDataAlert(
                    true,
                    "El archivo ha sido eliminado.",
                    "success",
                    autoHideDuration
                );
                setLoad(true);
            }).catch((error)=>{
                setDataAlert(
                    true,
                    "Error al eliminar el archivo.",
                    "success",
                    autoHideDuration
                );
            });
    };
    const handleDownloadFileClick = (params: any) => {
        window.open(params.row.fileUrl, "_blank");
    };
    const columns: GridColDef[] = [
        {
          field: "description",
          headerName: "Nombre",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return (
              <Typography sx={TextSmallFont}>{params.row.description!==''?
                params.row.description :
                params.row.fileName
              }</Typography>
            );
          },
        },
        {
          field: "createdAt",
          headerName: "Fecha de carga",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return (
              <Typography sx={TextSmallFont}>
                {moment(params.row.createdAt).format("DD/MM/YYYY")}
              </Typography>
            );
          },
        },
        {
          field: "notes",
          headerName: "Notas",
          flex: 1,
          minWidth: 150,
          renderCell: (params: any) => (
            <Typography sx={TextSmallFont}>{params.row.notes}</Typography>
          ),
        },
        {
          field: "acciones",
          headerName: "Acciones",
          flex: 1,
          minWidth: 150,
          renderCell: (params: any) => (
            <>
              <Tooltip
                title={
                  <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                    Eliminar
                  </Typography>
                }
              >
                <IconButton onClick={() => handleDeleteFileClick(params)}>
                  <Delete color={ColorPink} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                    Descargar
                  </Typography>
                }
              >
                <IconButton onClick={() => handleDownloadFileClick(params)}>
                  <Download color={ColorPink} />
                </IconButton>
              </Tooltip>
            </>
          ),
        },
      ];
  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={1}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={4}>
                <Stack direction="column" spacing={1}>
                  <Typography sx={TextSmallFont}>Nombre del archivo</Typography>
                  <TextField
                      name='description'
                      value={values.description}
                      error={!!errors.description}
                      helperText={errors.description}
                      onChange={(e)=>{
                          const inputValue = e.target.value;//
                          const newValue = inputValue
                          .replace(/^[\W_]+|[^\w\d\s\-.()[\]]/g, '');
                          setFieldValue("description", newValue);
                          //handleChange
                      }}
                      InputProps={{
                          inputProps: {
                              maxLength:50
                          }
                      }}
                      
                  />
                </Stack>
              </Grid>
            </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
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
                    backgroundColor:values.fileName!==''? '#ececec' : '#f2f2f2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept=".pdf,  application/pdf, "
                    id="file-upload"
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={async (e: any) => {
                        await GetFileData(e.target as HTMLInputElement).then((response)=>{
                            setFieldValue('fileName',response.fileName);
                            setFieldValue('fileExtension',response.fileExtension);
                            setFieldValue('fileBytes',response.fileBytes);
                        });
                      }}
                  />
                  <Stack direction="column" spacing={1} alignItems="center">
                    <DownloadCloud color="#8f91aa" />
                    <Typography>{values.fileName!==''?values.fileName:'Seleccione Archivo'}</Typography>
                  </Stack>
                </StyledBox>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
            <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Notas</Typography>
                <TextField
                    name='notes'
                    placeholder={values.fileBytes!==''? 'Escriba una nota del archivo.':
                    'Seleccione un archivo para poder escribir una nota.'}
                    type="text"
                    value={values.notes}
                    error={!!errors.notes}
                    helperText={values.fileName!==''?errors.notes:''}
                    multiline
                    rows={3}
                    sx={{ width: '100%', height: '80px' }}
                    onChange={(e)=>{
                        const inputValue = e.target.value;//
                        const newValue = inputValue
                        .replace(/(^,)|(^[^\wñÑáéíóúÁÉÍÓÚ\s\-.])|([^,\wñÑáéíóúÁÉÍÓÚ\s\-.])/g, '');
                        setFieldValue("notes", newValue);
                        //handleChange
                    }}
                    disabled={values.fileBytes===''? true:false}
                    InputProps={{
                        inputProps: {
                            maxLength:150
                        }
                    }}
                    
                />
              </Stack>
            </Grid>
            <Grid item xs={12} lg={2} alignSelf="flex-end">
              <Button
                size="small"
                endIcon={<Refresh color={ColorPureWhite} />}
                onClick={handleCleanForm} 
                disabled={values.fileBytes===''? true:false}
                >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} lg={2} alignSelf="flex-end">
              <Button
                size="small"
                type='submit'
                endIcon={<Complete color={ColorPureWhite} />}
                onClick={()=>{
                    if(errors.notes){
                        setDataAlert(
                            true,
                            "Llenar campo de notas.",
                            "warning",
                            autoHideDuration
                        );
                    }
                }}
                disabled={values.fileBytes===''? true:false}
              >
                Guardar
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} sx={{
                    marginTop: '20px',
                  }}>
                <DataGrid
                    rows={rows ?? []}
                    columns={columns.filter((col) => col.field !== "folio")}
                    loading={load}
                      //getRowId={(row) => row.Id + ''}
                      //columns={columns}
                    getRowId={(row) => row?.folio + ""}
                    autoHeight
                />
            </Grid>

            {/* <Grid item xs={12} sm={4}>
            <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Fecha de expedición</Typography>
                <TextField
                    fullWidth
                    type="date"
                    name="issueDate"
                    value={values.issueDate}
                    onChange={(e)=>{handleChange(e);console.log(e.target.value)}}
                    disabled={values.fileBytes===''? true:false}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Tipo Documento</Typography>
                <TextField
                  type="file"
                  helperText={"Seleccione un archivo"}
                  onChange={async (e: any) => {
                    var fileData = await GetFileData(e.target as HTMLInputElement);
                    console.log('fileData ',fileData);
                  }}
                  inputProps={{
                    title: "Selecciona el archivo",
                    accept:
                      ".pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  }}
                />
              </Stack>
            </Grid> */}
            <MessageBar
            open={isSnackbarOpen}
            severity={severity}
            message={messageAlert}
            close={handleSnackbarClose}
            autoHideDuration={autoHideDuration}
            />
          </Grid> 
        </Stack>
      </Box>
    </>
  );
}
export default TabConditions;
