import React, { useEffect, useRef, useState } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import {
  Button,
  InputAdornment,
  TextField,
  Select,
} from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import {
  ColorGrayDark,
  ColorGrayDark2,
  ColorPink,
  ColorPureWhite,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import {
  Complete,
  Delete,
  Download,
  Refresh,
} from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Zoom, styled } from "@mui/material";
import fileStorageService from "../../../../services/fileStorage.service";
import PeopleService from "../../../../services/people.service";
import Constants from "../../../../utils/Constants";
import FileStorage from "../../../../models/FileStorage";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CacheService from "../../../../services/cache.service";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import moment from "moment";
import TooltipMUI from "@mui/material/Tooltip";
import FormatData from "../../../../utils/Formats.Data";
import DownloadCloud from "../../../OuiComponents/Icons/DownloadCloud";

function TabFile(props: any) {

  const DateIssue = new Date().setMonth(new Date().getMonth() + 3);
  const newDateIssue = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(DateIssue);
  
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
  const [selectedFileName, setSelectedFileName] = useState('');

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [noteData, setNotesData] = React.useState<FileStorage[]>([])
  const [rows, setRows] = React.useState<FileStorage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fileForm, setFileForm] = React.useState<FileStorage | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputRefDocument = React.useRef<HTMLInputElement>(null);
  const [defaultDocumentSelect, setDefaultDocumentSelect] = React.useState('0');
  const [catalogTypeDocument, setCatalogTypeDocument] = React.useState<
    CacheCatalogValue[]
  >([]);
  const [personType, setPersonType] = useState<String | null>();
  useEffect(() => {
    setPersonType(props.typePersonId !== null ? props.typePersonId : "");
    const fetchData = async () => {
      await fileStorageService
        .getByExternalFolioContainerName(
          Constants.personContainerName,
          props.data
        )
        .then((response) => response.data)
        .then((json) => {
          setRows(json);
          if (catalogTypeDocument.length > 0) {
            const healt = calculateHealt(json.length);

            PeopleService.getById(props.data)
              .then((response) => response.data)
              .then((json) => {
                if (json.healt != healt) {
                  json.healt = healt;
                  PeopleService.put(props.data, json).then((response: any) => {
                  });
                }
              });
          }
        });

      const naturalPersonDocuments: string[] = ["ACTA DE NACIMIENTO", "IDENTIFICACIÓN OFICIAL", "CURP"];
      const juristicPersonDocuments: string[] = ["ACTA CONSTITUTIVA"];
      const resTypeDocument = await CacheService.getByFolioCatalog(props.typePersonId == Constants.folioNaturalPerson ? Constants.naturalPersonCatalogFolio : Constants.juridicalPersonCatalogFolio);
      const documentTypeList = resTypeDocument.data.values;
      let cacheDocumentTypeList: CacheCatalogValue[] = [];

      documentTypeList.map((obj: CacheCatalogValue) => {
        const natural = naturalPersonDocuments.find((typeDocument: string) => typeDocument === obj.description)
        const juristic = juristicPersonDocuments.find((typeDocument: string) => typeDocument === obj.description)

        if (natural && props.typePersonId === Constants.folioNaturalPerson) {
          cacheDocumentTypeList.push(obj)

        } else if (juristic && props.typePersonId === Constants.folioMoralPerson) {
          cacheDocumentTypeList.push(obj)

        } else if (!natural && !juristic) {
          cacheDocumentTypeList.push(obj)
        }
      })
      setCatalogTypeDocument(documentTypeList);

      setLoading(false);
    };

    fetchData();

  }, [loading]);
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
      updatedFileForm.externalFolio = props.data;
      updatedFileForm.fileName = fileName;
      updatedFileForm.notes = notes ?? "";
      updatedFileForm.fileExtension = fileExt;
      updatedFileForm.containerName = Constants.personContainerName;
      updatedFileForm.objectStatusId = 1;
      updatedFileForm.fileBytes = readerSplit ?? "";
      updatedFileForm.fileUrl = "";
      updatedFileForm.effectiveDate =  effectiveDate ?? newDateIssue;
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
  const handleDeleteFileClick = (params: any) => {
    const fetchDelete = async () => {
      fileStorageService
        .deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(
            true,
            "El archivo ha sido eliminado.",
            "success",
            autoHideDuration
          );
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    };
    fetchDelete();
  };
  const handleDownloadFileClick = (params: any) => {
    window.open(params.row.fileUrl, "_blank");
  };
  const handleSaveFileStorage = () => {
    if (fileForm?.fileBytes) {
      fileStorageService
        .post(fileForm)
        .then((response: any) => {
          if (response.message === "OK") {
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
        }).finally(()=>{
          handleCleanForm();
        });
        
    }
  };

  const handleOpen = (params: any) => {
    setNotesData(params.row.folio)
    setOpen(true);
  }

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Documento",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.description}</Typography>
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
      field: "issueDate",
      headerName: "Fecha de expedicion",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {moment(params.row.issueDate).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "effectiveDate",
      headerName: "Fecha de vigencia",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {moment(params.row.effectiveDate).format("DD/MM/YYYY")}
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
        <>
          <TooltipMUI
            title={params.row.notes}
            TransitionComponent={Zoom}
            followCursor
            placement="top"
          >
            <span style={{ color: ColorGrayDark2 }}>{params.row.notes}</span>
          </TooltipMUI>
        </>
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

  const handleChangeFile = (e: any) => {
    if (e.target instanceof HTMLInputElement && e.target.files?.length) {
      setBase64(e.target.files[0]);
    }

    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
    }
  };

  const calculateHealt = (rowLenght: any) => {
    if (rowLenght > 0 && catalogTypeDocument.length > 0) {
      return Math.round((rows.length * 100) / catalogTypeDocument.length);
    }
    return 0;
  };
  const handleCleanForm = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    if (inputRefDocument && inputRefDocument.current) {
      inputRefDocument.current.value = "";
    }
    setSelectedFileName('');
    setDefaultDocumentSelect('0');
    setFileForm(null);
  }
  
  return (
    <>
      <Box>
        <Stack direction="column" spacing={1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Tipo Documento</Typography>
                <Select
                  sx={{ width: "100%" }}
                  onChange={(event) => {
                    const selectedDescription = (
                      catalogTypeDocument ?? []
                    ).find(
                      (data) => data.folio === event.target.value
                    )?.description;
                    const updatedFileForm = { ...fileForm };
                    updatedFileForm.description = selectedDescription;
                    setFileForm(updatedFileForm);
                  }}
                  value={defaultDocumentSelect}
                >
                  <MenuItem key={'0'} value={'0'} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(catalogTypeDocument ?? []).map((data: any) => (
                    <MenuItem key={data.folio} value={data.folio} onClick={()=>setDefaultDocumentSelect(data.folio)}>
                      {data?.description}
                    </MenuItem>
                  ))}
                </Select>
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
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/*"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleChangeFile}
                    ref={inputRef}
                    disabled={
                      fileForm != null
                        ? fileForm.description
                          ? false
                          : true
                        : true
                    }
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
            <Grid item xs={12} lg={2} alignSelf="flex-end">
              <Button
                size="small"
                endIcon={<Refresh color={ColorPureWhite} />}
                onClick={handleCleanForm} >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} lg={2} alignSelf="flex-end">
              <Button
                size="small"
                endIcon={<Complete color={ColorPureWhite} />}
                onClick={handleSaveFileStorage}
              >
                Guardar
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} alignSelf="flex-end">
              <TextField
                onChange={(event: any) => {
                  const updatedFileForm = { ...fileForm };
                  updatedFileForm.notes = event.target.value
                  setFileForm(updatedFileForm)
                }}
                defaultValue=""
                placeholder={selectedFileName!==''? 'Escriba una nota del archivo.':
                'Seleccione un archivo para poder escribir una nota.'}
                type="text"
                value={fileForm?.notes ? fileForm.notes : ""}
                multiline
                rows={3}
                sx={{ width: '100%', height: '80px' }}
                disabled={selectedFileName===''? true:false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Fecha de Vigencia</Typography>
                <TextField
                onChange={(event: any) => {
                  const updatedFileForm = { ...fileForm};
                  updatedFileForm.effectiveDate = event.target.value
                  setFileForm(updatedFileForm)
                }}
                  name="EffectiveDate"
                  type="date"
                  
                  value={fileForm?.effectiveDate ? `${new Date(fileForm.effectiveDate).toISOString().split("T")[0]}`
                  : FormatData.dateFormat(new Date()).toString()}
                  disabled={
                    fileForm != null
                      ? fileForm.description
                        ? false
                        : true
                      : true
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Fecha de expedicion</Typography>
                <TextField
                onChange={(event: any) => {
                  const updatedFileForm = { ...fileForm};
                  updatedFileForm.issueDate = event.target.value
                  setFileForm(updatedFileForm)
                }}
                  name="issueDate"
                  type="date"
                  value={fileForm?.issueDate ? `${new Date(fileForm.issueDate).toISOString().split("T")[0]}`
                  : FormatData.dateFormat(new Date()).toString()}
                  disabled={
                    fileForm != null
                      ? fileForm.description
                        ? false
                        : true
                      : true
                  }
                />
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ pt: 5 }}>
            {rows ? (
              <DataGrid
                rows={rows}
                loading={loading}
                autoHeight
                columns={columns}
                getRowId={(row) => row.fileStorageId}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10, 20, 30, 40, 50]}
              />
            ) : (
              <></>
            )}
          </Box>
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
    </>
  );
}

export default TabFile;
