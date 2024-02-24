import React from "react";
import Button from "../../../OuiComponents/Inputs/Button";
import { Dialog } from "../../../OuiComponents/Feedback";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  Cancel,
  Complete,
  Delete,
  Download,
  Refresh,
} from "../../../OuiComponents/Icons";
import {
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import {
  DialogContent,
  IconButton
} from "@mui/material";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Select, TextField } from "../../../OuiComponents/Inputs";
import { Link, MenuItem } from "../../../OuiComponents/Navigation";
import { Chip, Tooltip } from "../../../OuiComponents/DataDisplay";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import Constants from "../../../../utils/Constants";
import CompaniesService from "../../../../services/companies.service";
import ModelCompany from "../../../../models/Company";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import CompaniesBranches from "../../../../models/CompaniesBranches";
import { Prospect, FileProspect } from "../../../../insuranceModels/Prospect";
import ProspectsService from "../../../../insuranceServices/prospects.service";
import FormatData from "../../../../utils/Formats.Data";


export default function ProspectsModal(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [branches, setBranches] = React.useState<any>();
  const [insurers, setInsurers] = React.useState<ModelCompany>();
  const [companyBranches, setCompanyBranches] =
    React.useState<CompaniesBranches[]>();
  const inputRefFileActAnalysis = React.useRef<HTMLInputElement>(null);
  const inputRefFileAccidentReport = React.useRef<HTMLInputElement>(null);
  const [dataProspect, setDataProspect] = React.useState<Prospect>({
    folioPerson: props.person.folio,
    trafficLights: "",
    insuranceId: "",
    branchFolio: "",
    fileActuarialAnalysis: { name: "", base64Content: "", fileExtension: "", containerName: "", categoryFile: "" },
    fileAccidentReport: { name: "", base64Content: "", fileExtension: "", containerName: "", categoryFile: "" },
    objectStatusId: 1,
  });
  const [formValid, setFormValid] = React.useState(false);
  const [prospectName, setProspectName] = React.useState('');

  const handleDownloadFileClick = async (params: any, isBoth: boolean) => {
    if (isBoth) {
      const fileAccidentReportUri = params.row.fileAccidentReport.uri.toString();
      const fileActuarialAnalysisUri = params.row.fileActuarialAnalysis.uri.toString();
      window.open(fileAccidentReportUri, "_blank");
      setTimeout(() => {
        window.open(fileActuarialAnalysisUri, "_blank");
      }, 1000);
    } else {
      window.open(params, "_blank");
    }
  };

  React.useEffect(() => {
    setOpen(props.open);
    getBranches();
    getInsurers();
    getProspectName(props.person);
    getProspects();
  }, []);

  const hadleDeleteRow = (params: any) => {
    ProspectsService.deleteProspect(params.row.folio).then((response: any) => {
      setDataAlert(true, "El prospecto se eliminó con éxito.", "success", autoHideDuration);
      getProspects();
    }).catch((e: Error) => {
      setDataAlert(true, e.message, "error", autoHideDuration);
    });
  };

  const getProspectName = async (person: any) => {
    let fullName = '';
    if (person) {
      if (person.name) {
        fullName = person.name;
        setProspectName(fullName);
      } else {
        console.log('No hay nombre');
      }

    }
  }

  const getBranches = async () => {
    CompaniesBranchesService.getAll().then((response) => {
      setBranches(response.data);
    }).catch((e: Error) => {
      setDataAlert(true, e.message, "error", autoHideDuration);
    });
  };
  const updateFormValidations = () => {
    const isFormValid = dataProspect.trafficLights !== ""
      && dataProspect.insuranceId !== ""
      && dataProspect.branchFolio !== ""
      && dataProspect.fileActuarialAnalysis.base64Content !== ""
      && dataProspect.fileAccidentReport.base64Content !== ""
      ;
    setFormValid(isFormValid);
  };
  const getInsurers = async () => {
    CompaniesService.getByCompanyType(Constants.folioInsuranceCompany)
      .then((response) => {
        setInsurers(response.data);
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const getProspects = async () => {
    await ProspectsService.getProspectsByFolioPerson(props.person.folio)
      .then((response) => {
        if (response.data.length === 0) {
          setDataAlert(true, "El prospecto no cuenta con información capturada.", "warning", autoHideDuration);
        }
        setRows(response.data)
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };


  const handleSubmit = () => {
    if (
      dataProspect.trafficLights !== ""
      && dataProspect.insuranceId !== ""
      && dataProspect.branchFolio !== ""
      && dataProspect.fileActuarialAnalysis.base64Content !== ""
      && dataProspect.fileAccidentReport.base64Content !== ""
    ) {
      ProspectsService.post(dataProspect).then((response: any) => {
        setDataAlert(true, "El prospecto se registró con éxito.", "success", autoHideDuration);
        resetForm();
        getProspects();
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
    } else {
      setDataAlert(true, "Faltan llenar campos.", "warning", autoHideDuration);
    }
  };
  const fetchBranches = (folio: any) => {
    CompaniesBranchesService.getByFolioCompany(folio).then((response) => {
      setCompanyBranches(response.data);
    });
  };
  const setBase64 = (file: any, categoryFile: string) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const readerSplit = reader.result?.toString().split(",")[1] ?? null;
      const fileName = file.name.toString().split(".")[0];
      const fileExt = "." + file.name.toString().split(".")[1];
      const fileProspect: FileProspect = {
        name: fileName,
        base64Content: readerSplit ?? "",
        fileExtension: fileExt,
        containerName: categoryFile === "fileActuarialAnalysis" ? Constants.actuarialAnalysisContainerName : Constants.accidentRateContainerName,
        categoryFile: categoryFile === "fileActuarialAnalysis" ? Constants.actuarialAnalysisContainerName : Constants.accidentRateContainerName,
      }
      if (categoryFile === "fileActuarialAnalysis") {
        setDataProspect({
          ...dataProspect,
          fileActuarialAnalysis: fileProspect
        });
      }
      else {
        setDataProspect({
          ...dataProspect,
          fileAccidentReport: fileProspect
        });
      }
    };
  };
  const handleChangeFile = (e: any) => {
    if (e.target instanceof HTMLInputElement && e.target.files?.length) {
      setBase64(e.target.files[0], e.target.name);
    }
  };

  const resetForm = () => {
    setDataProspect({
      ...dataProspect,
      trafficLights: "",
      insuranceId: "",
      branchFolio: "",
      fileActuarialAnalysis: { name: "", base64Content: "", fileExtension: "", containerName: "", categoryFile: "" },
      fileAccidentReport: { name: "", base64Content: "", fileExtension: "", containerName: "", categoryFile: "" },
      objectStatusId: 1,
    });
    if (
      inputRefFileAccidentReport &&
      inputRefFileAccidentReport.current
    ) {
      inputRefFileAccidentReport.current.value = "";
    }
    if (
      inputRefFileActAnalysis &&
      inputRefFileActAnalysis.current
    ) {
      inputRefFileActAnalysis.current.value = "";
    }

  }

  const columns: GridColDef[] = [
    {
      field: "fileActuarialAnalysis",
      headerName: "Análisis Actuarial",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        return (
          <Link href="#" onClick={() => handleDownloadFileClick(params.value.uri, false)}>
            <Typography sx={TextSmallFont}>{params.value.name + params.value.fileExtension}</Typography>
          </Link>
        );
      },
    },
    {
      field: "fileAccidentReport",
      headerName: "Reporte de Accidente",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        return (
          <Link href="#" onClick={() => handleDownloadFileClick(params.value.uri, false)}>
            <Typography sx={TextSmallFont}>{params.value.name + params.value.fileExtension}</Typography>
          </Link>
        );
      },
    },
    {
      field: "insuranceId",
      headerName: "Aseguradora",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        let corporateName = "";
        if (insurers) {
          const insurer = Object(insurers).find((item: any) => item.folio === params.value);
          corporateName = insurer?.corporateName || 'No disponible';
        }
        return (
          <Typography sx={TextSmallFont}>{corporateName}</Typography>
        );
      },
    },
    {
      field: "branchFolio",
      headerName: "Ramo",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        let branchName = "";
        if (branches) {
          const branch = Object(branches).find((item: any) => item.companyBranchFolio === params.value);
          branchName = branch?.branch.description || 'No disponible';
        }
        return (
          <Typography sx={TextSmallFont}>{branchName}</Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Fecha de Creación",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{FormatData.stringDateFormat(params.row.createdAt)}</Typography>
        );
      },
    },
    {
      field: "trafficLights",
      headerName: "Semáforo Actuarial",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Box>
            {(params.row.trafficLights == null || params.row.trafficLights === 0) && (
              <Chip
                sx={{
                  bgcolor: "rgb(24, 204, 39)",
                  color: "white",
                  px: 1,
                  overflow: "visible"
                }}
                label="1"
              />
            )}
            {params.row.trafficLights > 0 && params.row.trafficLights <= 3 && (
              <Chip
                sx={{
                  bgcolor: "rgb(24, 204, 39)",
                  color: "white",
                  px: 1,
                  overflow: "visible"
                }}
                label={params.row.trafficLights}
              />
            )}
            {params.row.trafficLights > 3 && params.row.trafficLights <= 7 && (
              <Chip
                sx={{
                  bgcolor: "rgb(24, 134, 204)",
                  color: "white",
                  px: 1,
                  overflow: "visible"
                }}
                label={params.row.trafficLights}
              />
            )}
            {params.row.trafficLights > 7 && params.row.trafficLights <= 10 && (
              <Chip
                sx={{
                  bgcolor: "rgb(204, 169, 24)",
                  color: "white",
                  px: 1,
                  overflow: "visible"
                }}
                label={params.row.trafficLights}
              />
            )}
          </Box>
        </>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => hadleDeleteRow(params)} title="Eliminar Archivos">
            <Delete color={ColorPink} />
          </IconButton>
          <IconButton onClick={() => handleDownloadFileClick(params, true)} title="Descargar Archivos">
            <Download color={ColorPink} />
          </IconButton>
        </Stack>
      ),
    },
  ];
  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Dialog
        fullWidth
        open={open}
        aria-labelledby="modal-modal-title"
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "20px", paddingTop: "20px" } }}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Cancel />
        </IconButton>
        <DialogContent>
          <Typography variant="h2" sx={{ ...LinkLargeFont, pl: 2, fontSize: '22px' }}>
            Editar prospecto
          </Typography>
          <Box component="form" height="85vh">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    ...LinkSmallFont,
                    margin: "auto",
                    pl: 2
                  }}
                >
                  Prospecto: {prospectName || ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                    Aseguradora
                  </Typography>
                  <Select
                    sx={{ width: "100%" }}
                    value={dataProspect.insuranceId}
                    defaultValue={""}
                    onChange={(e) => {
                      setDataProspect({
                        ...dataProspect,
                        insuranceId: (e?.target?.value as string) || "",
                        branchFolio: "",
                      });
                      const responsecompanyBranches = Object(
                        insurers
                      ).find(
                        (company: any) => company.folio === e.target.value
                      );
                      fetchBranches(
                        responsecompanyBranches
                          ? responsecompanyBranches.folio
                          : ""
                      );
                      updateFormValidations();
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(insurers ?? []).map((insurer: any) => (
                      <MenuItem key={insurer.folio} value={insurer.folio}>
                        {insurer.corporateName}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                    Ramo
                  </Typography>
                  <Select
                    sx={{ width: "100%" }}
                    defaultValue={""}
                    value={dataProspect.branchFolio}
                    onChange={(e) => {
                      setDataProspect({
                        ...dataProspect,
                        branchFolio: (e?.target?.value as string) || "",
                      });
                      updateFormValidations();
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(companyBranches ?? []).map(
                      (branch: CompaniesBranches) => (
                        <MenuItem
                          key={branch.companyBranchFolio}
                          value={branch.companyBranchFolio}
                        >
                          {branch.branch.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Stack>
              </Grid>
              
              
              
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Agregar análisis actuarial
                  </Typography>
                  <Tooltip title={"Agregar análisis actuarial"}>
                    <span style={{ width: '100%' }}>
                      <IconButton sx={{ width: '100%' }}>
                        <TextField
                          sx={{ width: '100%' }}
                          type="file"
                          disabled={false}
                          helperText={"Seleccione un archivo"}
                          onChange={(e) => {
                            handleChangeFile(e);
                            updateFormValidations();
                          }}
                          inputProps={{
                            title: "",
                            accept:
                              ".xml, .pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          }}
                          inputRef={inputRefFileActAnalysis}
                          name="fileActuarialAnalysis"
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Agregar reporte de siniestralidad
                  </Typography>
                  <Tooltip title={"Agregar reporte de siniestralidad"}>
                    <span style={{ width: '100%' }}>
                      <IconButton sx={{ width: '100%' }}>
                        <TextField
                          sx={{ width: '100%' }}
                          type="file"
                          disabled={false}
                          helperText={"Seleccione un archivo"}
                          onChange={(e) => {
                            handleChangeFile(e);
                            updateFormValidations();
                          }}
                          inputProps={{
                            title: "",
                            accept:
                              ".xml, .pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          }}
                          inputRef={inputRefFileAccidentReport}
                          name="fileAccidentReport"
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                    Semáforo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                      sx={{ flex: 1, marginRight: '15px' }}
                      labelId="demo-simple-select-label"
                      defaultValue={""}
                      value={dataProspect.trafficLights}
                      id="semaforo"
                      onChange={(e) => {
                        setDataProspect({
                          ...dataProspect,
                          trafficLights: (e?.target?.value as string) || "",
                        });
                        updateFormValidations();
                      }}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value={"1"}>1</MenuItem>
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"3"}>3</MenuItem>
                      <MenuItem value={"4"}>4</MenuItem>
                      <MenuItem value={"5"}>5</MenuItem>
                      <MenuItem value={"6"}>6</MenuItem>
                      <MenuItem value={"7"}>7</MenuItem>
                      <MenuItem value={"8"}>8</MenuItem>
                      <MenuItem value={"9"}>9</MenuItem>
                      <MenuItem value={"10"}>10</MenuItem>
                    </Select>
                    {parseInt(dataProspect.trafficLights) > 0 &&
                      parseInt(dataProspect.trafficLights) <= 3 && (
                        <Chip
                          sx={{
                            bgcolor: "rgb(24, 204, 39)",
                            color: "white",
                            ml: 1,
                            width: '65px',
                          }}
                          label={dataProspect.trafficLights}
                        />
                      )}
                    {parseInt(dataProspect.trafficLights) > 3 &&
                      parseInt(dataProspect.trafficLights) <= 7 && (
                        <Chip
                          sx={{
                            bgcolor: "rgb(24, 134, 204)",
                            color: "white",
                            ml: 1,
                            width: '65px',
                          }}
                          label={dataProspect.trafficLights}
                        />
                      )}
                    {parseInt(dataProspect.trafficLights) > 7 &&
                      parseInt(dataProspect.trafficLights) <= 10 && (
                        <Chip
                          sx={{
                            bgcolor: "rgb(204, 169, 24)",
                            color: "white",
                            ml: 1,
                            width: '65px',
                          }}
                          label={dataProspect.trafficLights}
                        />
                      )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ pt: 5, pb: 10 }}>
              {branches && insurers && <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.prospectId + ""}
                disableRowSelectionOnClick
              />}
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={6}>
                <Grid container justifyContent="flex-end">
                  <Button
                    sx={{ marginRight: '20px', marginBottom: '40px' }}
                    size="small"
                    endIcon={<Refresh color={ColorPureWhite} />}
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Limpiar
                  </Button>
                  <Button
                    sx={{ marginRight: '40px', marginBottom: '40px' }}
                    size="small"
                    endIcon={<Complete color={ColorPureWhite} />}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );

}
