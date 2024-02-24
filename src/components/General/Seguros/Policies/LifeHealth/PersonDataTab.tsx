import React from "react";
import { Typography } from "../../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
} from "../../../../OuiComponents/Theme";
import { GridColDef } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Tooltip,
  Zoom,
  styled,
} from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Beneficiary, Complete, Delete } from "../../../../OuiComponents/Icons";
import { Grid, Stack } from "../../../../OuiComponents/Layout";
import {
  Alert,
  Skeleton,
  CircularProgress,
  Snackbar,
  Dialog,
} from "../../../../OuiComponents/Feedback";
import { DataGrid } from "../../../../OuiComponents/DataGrid";
import {
  Select,
  Button,
  TextField,
  Checkbox,
} from "../../../../OuiComponents/Inputs";
import { MenuItem } from "../../../../OuiComponents/Navigation";
import CacheCatalogValue from "../../../../../models/CacheCatalogValue";
import CacheService from "../../../../../services/cache.service";
import * as Yup from "yup";
import LocationService from "../../../../../services/location.service";
import Constants from "../../../../../utils/Constants";
import PolicyService from "../../../../../insuranceServices/policies.service";
import NewContactModal from "./NewContactModal";
import ModelPolicy from "../../../../../insuranceModels/policies";
import { Entidad } from "../../../../../models/Entidad";
import CatalogValue from "../../../../../models/CatalogValue";
import { useAlertContext } from "../../../../../context/alert-context";
import LoadingScreen from "../../../../OuiComponents/Utils/LoadingScreen";
import policyHooks from "../../../../../hooks/policyHooks";
import { useFormik } from "formik";
import policySumary from "../../../../../models/PolicySumary";
import { getCatalogValueFolio } from "../../../../../services/catalogvalue.service";
import CompaniesBranchesService from "../../../../../services/companiesbranches.service";
import receiptsGenerator from "../ReceiptsGenerator";
import MessageBar from "../../../../OuiComponents/Feedback/MessageBar";

interface PersonData {
  Policy: ModelPolicy;
  Entity: Entidad[];
  countryCatalog: CacheCatalogValue;
  clasificationCatalog: CacheCatalogValue;
}

interface policyDoneData {
  message: string;
  done: boolean;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function TabPerson(props: any) {
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
  const [rows, setRows] = React.useState([]);
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [valuesData, setValuesData] = React.useState<PersonData>();
  const [municipalities, setMunicipalities] = React.useState<any[]>();
  const [locations, setLocations] = React.useState<any[]>();
  const [contractor, setContractor] = React.useState(false);
  const [personFolio, setPersonFolio] = React.useState<string>();

  //MODAL
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [person, setPerson] = React.useState(false);
  //AutoComplete Titular
  const [titular, setTitular] = React.useState([]);
  const [loadingTitular, setLoadingTitular] = React.useState(false);
  const [valueTitular, setValueTitular] = React.useState<any | null>(null);
  const [searchByZipCode, setSearchByZipCode] = React.useState(false);

  //este hook verifica si ya se agrego una persona, 
  //en ese caso se desactiva el poder agregar a un sujeto
  const [existPerson, setExistPerson] = React.useState(false);
  //Este hook activa o desactiva la pantalla de carga
  const [waiting, setWaiting] = React.useState(true);
  const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
  const [confirmContent, setConfirmContent] = React.useState("");
  const [openContent, setOpenContent] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingTitular(true);
    const responsePolicyData = await PolicyService.getPoliciesByFolio(
      props.policy
    );
    const responseEntityCatalog = await LocationService.getStates();
    const responseCountriesCatalog = await CacheService.getByFolioCatalog(
      Constants.countriesCatalogFolio
    );
    const statusResponse = await CacheService.getByFolioCatalog(
      Constants.statusCatalogFolio
    );
    const responseClasificationCatalog = await CacheService.getByFolioCatalog(
      Constants.clasificationSubsectionFolio
    );

    setTitular(responsePolicyData.data.personPolicie !== null ? Object(responsePolicyData.data.personPolicie).filter((item: any) => item.parentId === null) : []);
    setLoadingTitular(false);
    setValuesData({
      Policy: responsePolicyData.data,
      Entity: responseEntityCatalog.data,
      countryCatalog: responseCountriesCatalog.data,
      clasificationCatalog: responseClasificationCatalog.data,
    });

    if (responsePolicyData) {
      setRows(responsePolicyData.data.personPolicie ?? []);
      if (responsePolicyData.data.personPolicie) {
        setPerson(
          responsePolicyData.data.personPolicie.length === 1 &&
          (props.data.folioBranch === Constants.folioIndividualHealthBranch ||
            props.data.folioBranch === Constants.folioIndividualLifeBranch ||
            props.data.folioBranch === Constants.folioPersonalAccidentsBranch)
        );
        if (person) {
          return
        }
      }
      handleStateMunicipalities(responsePolicyData.data.state);
      handleMunicipalitie(
        responsePolicyData.data.state,
        responsePolicyData.data.municipality
      );

      setDisabled(responsePolicyData.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)

      const responsePolicyDone = await policyHooks.getPolicyDone(responsePolicyData.data)
      setPolicyDone(responsePolicyDone)
    }

    setWaiting(false);
    setExpanded('DP')
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleClose = () => {
    setOpenContent(false);
  };

  const handleStateMunicipalities = async (cvE_ENT: number) => {
    if (cvE_ENT > 0) {
      LocationService.getMunicipalitiesByStateId(cvE_ENT).then((response) => {
        setMunicipalities(response.data[0].municipalitiesList);

      });
    }
  };

  const handleMunicipalitie = async (cvE_ENT: number, cvE_MUN: number) => {
    if (cvE_ENT > 0 || cvE_MUN > 0) {
      LocationService.getColoniesByStateIdMunicipalityId(cvE_ENT, cvE_MUN).then((response) => {
        setLocations(response.data[0].coloniesList);
      });
    }
  };

  const handleDeletePersonClick = (params: any) => {
    PolicyService.deletePolicyPerson(props.policy, params.row.folio)
      .then((response: any) => {
        setAlertContent("La persona ha sido eliminada.");
        setAlert(true);
        fetchData();
      })
      .catch((e: Error) => {
        setAlertContent(e.message);
        setAlert(true);
      });
  };

  const handleNewContact = (params: any) => {
    setOpen(true);
    setPersonFolio(params.row.folio);
  };

  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchByZipCode(true)
    let state: number = 0;
    let city: number = 0;

    LocationService.getZipCodeInfo(zipCode)
      .then((response: any) => {
        state = response.data[0].estadoId
        city = response.data[0].municipioId;
        setFieldValue('state', state.toString())

        LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            setMunicipalities(response.data[0].municipalitiesList)

            LocationService.getColoniesByStateIdMunicipalityId(state, city)
              .then((response: any) => {
                setLocations(response.data[0].coloniesList)

                //set values form
                setFieldValue('municipality', city.toString())
                setFieldValue('cologne', 0)
                setFieldValue('country', Constants.folioMexico)
              })
              .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
              })
              .finally(() => {
                setSearchByZipCode(false)
              });
          })
          .catch((e: Error) => {
            setSearchByZipCode(false)
            setDataAlert(true, e.message, "error", autoHideDuration);
          })
      })
      .catch((e: Error) => {
        setSearchByZipCode(false)
        setDataAlert(true, e.message, "error", autoHideDuration);
      })
  }

  const handleSetContractor = (showContractor: boolean) => {
    setContractor(true)

    if (showContractor) {
      if (Number(valuesData?.Policy.state ?? 0) > 0 && Number(valuesData?.Policy.municipality ?? 0) > 0) {
        LocationService.getMunicipalitiesByStateId(valuesData?.Policy.state ?? 0)
          .then((response) => {
            setMunicipalities(response.data[0].municipalitiesList);

            LocationService.getColoniesByStateIdMunicipalityId(valuesData?.Policy.state ?? 0, valuesData?.Policy.municipality ?? 0)
              .then((response) => {
                setLocations(response.data[0].coloniesList);

                setValues({
                  folio: "",
                  name: valuesData?.Policy.clientName ?? "",
                  rfc: valuesData?.Policy.rfc ?? "",
                  street: valuesData?.Policy.street ?? "",
                  state: valuesData?.Policy.state ?? 0,
                  municipality: valuesData?.Policy.municipality ?? 0,
                  cologne: valuesData?.Policy.locality ?? 0,
                  country: valuesData?.Policy.country ?? "",
                  postPerson: valuesData?.Policy.zip ?? 0,
                  classification: valuesData?.Policy.classification ?? Constants.folioTitular,
                  contacts: null,
                  parentId: null,
                  inciso: 0,
                })
              })
              .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
              })
              .finally(() => {
                setContractor(false)
              });
          })
          .catch((e: Error) => {
            setContractor(false)
            setDataAlert(true, e.message, "error", autoHideDuration);
          })
      } else {
        setValues({
          folio: "",
          name: valuesData?.Policy.clientName ?? "",
          rfc: valuesData?.Policy.rfc ?? "",
          street: valuesData?.Policy.street ?? "",
          state: valuesData?.Policy.state ?? 0,
          municipality: valuesData?.Policy.municipality ?? 0,
          cologne: valuesData?.Policy.locality ?? 0,
          country: valuesData?.Policy.country ?? "",
          postPerson: valuesData?.Policy.zip ?? 0,
          classification: valuesData?.Policy.classification ?? Constants.folioTitular,
          contacts: null,
          parentId: null,
          inciso: 0,
        })
        setContractor(false)
      }
    } else {
      setContractor(false)
      resetForm()
    }
  }

  const onSubmit = async (data: any) => {
    if (data) {
      if (data.classification === Constants.folioTitular) {
        await PolicyService.postPolicyPerson(props.policy, [data]).then(
          (response: any) => {
            setAlertContent("La persona se registro con éxito.");
            setAlert(true);
            fetchData();
            props.onDataChange(props.policy);
            setPersonFolio(response.data[0].folio);
          }
        );
      } else {
        data.inciso = valueTitular.inciso;
        data.parentId = valueTitular.folio;
        await PolicyService.postPolicyPerson(props.policy, [data]).then(
          (response: any) => {
            setAlertContent("La persona se registro con éxito.");
            setAlert(true);
            fetchData();
            props.onDataChange(props.policy);
            setPersonFolio(response.data[0].folio);
          }
        );

      }
    }
  };

  const validateIssue = () => {
    PolicyService.checkIssuanceStatus(props.policy)
      .then((response: any) => {
        setConfirmContent(policyDone ? policyDone.message : "");
      })
      .catch((error) => {
        setPolicyDone({ done: false, message: '' })
        setConfirmContent(error.response.data.error.message);
      })
      .finally(() => {
        setOpenContent(true);
      })
  }

  const handleIssue = () => {
    PolicyService.issuancePolicy(props.policy)
      .then(async (response: any) => {
        setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
        await createReceipts(response.data);//===============================================================;
        props.onDataChange(props.policy);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }).finally(() => {
        setOpenContent(false);
      })
  }
//===============================================================;
const createReceipts = async (policy: any) => {
  let fullname = policy?.clientName ?? 'NAME';
  //Obtenemos nombre del grupo
  const groupData = await getCatalogValueFolio(policy?.groups);
  let groupName = groupData?.data?.description ?? '';
  //Obtenemos los branches de la compania
  const companiData = await CompaniesBranchesService.getBranchesByCompanyFolio(policy?.insuranceId);
  const valuesDataIndex = companiData.data.reduce((acc: any, el: any) => {
    acc[el.branchId] = el;
    return acc;
  }, {});
  //Obtenemos el nombre del branch
  let branchName = valuesDataIndex[policy?.branchId]?.branch?.description??'';
  //Obtenemos la comision
  let branchCommission = Number(valuesDataIndex[policy?.branchId]?.branch?.commissionPercentage)??0;
  const sumary: policySumary = {
    policyFolio: policy.folio ?? props?.policy ?? "",
    createdAt: policy.issuanceDate, //Emisión
    startValidity: policy.startValidity, //Vigencia De
    endValidity: policy.endValidity, //Vigencia Hasta
    paymentMethod: policy.paymentFrequency, //Pago Anual CATALOG
    netPremium: policy.netPremium, //Prima Neta
    additionalCharge: policy.additionalCharge, //Recargo Monto
    surcharge: policy.financing, //surcharge, //Recargo %
    iva: policy.iva, //iva,                //Iva Monto
    rights: policy.rights, //Derecho Monto/GastoExpedicion
    settingOne: policy.settingOne ?? 0,
    settingTwo: policy.settingTwo ?? 0,
    //compania
    insuranceId: policy.insuranceId,
    insuranceCompany: policy.insuranceCompany,
    //grupo
    groups: policy.groups, //policyDataHook?.groups,
    groupsDescription: groupName,
    //cliente
    clientId: policy.clientId,
    clientName: fullname,//policy.clientName,
    //ramo
    branchId: policy.branchId,
    branch:   branchName, //'',
    totalPremium: policy.totalPremium, //Prima Total
    payReceipt: "",
    currency: policy.currency,
    policyType: "Seguros",
    sellerFolio: policy.salesPerson,
    noPolicy: policy.noPolicy,
    commissions: (policy.netPremium - (policy.settingOne + policy.settingTwo)) * (branchCommission ?? 0 / 100),
  };
  receiptsGenerator(sumary);
};
//===============================================================;
  const columns: GridColDef[] = [
    {
      field: "inciso",
      headerName: "Inciso",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}> Inciso {params.row.inciso}</Typography>;
      },
    },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.name}</Typography>;
      },
    },
    {
      field: "rfc",
      headerName: "RFC",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.rfc}</Typography>;
      },
    },
    {
      field: "classification",
      headerName: "Clasificacion",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {
              Object(valuesData?.clasificationCatalog.values ?? []).filter(
                (b: CatalogValue) => b.folio === params.row.classification
              )[0].description
            }
          </Typography>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1, // Set default flex value
      minWidth: 150,
      renderCell: (params: any) => (
        <>
        <Tooltip title="Eliminar" TransitionComponent={Zoom}>
        <IconButton
            disabled={disabled}
            onClick={() => handleDeletePersonClick(params)}
          >
            <Delete color={ColorPink} />
          </IconButton>
        </Tooltip>
         
          <Tooltip title="Contactos" TransitionComponent={Zoom}>
          <IconButton
            disabled={disabled}
            onClick={() => {
              handleNewContact(params);
            }}
          >
            <Beneficiary color={ColorPink} />
          </IconButton>
          </Tooltip>
          
        </>
      ),
    },
  ];

  const initialValues = {
    folio: "",
    name: "",
    rfc: "",
    street: "",
    state: 0,
    municipality: 0,
    cologne: 0,
    country: "",
    postPerson: 0,
    classification: Constants.folioTitular,
    contacts: null,
    parentId: null,
    inciso: 0,
  };

  const validationSchema = new Yup.ObjectSchema({
    name: Yup.string().required("Este campo es requerido."),
    rfc: Yup.string().required("Este campo es requerido."),
    street: Yup.string().required("Este campo es requerido."),
    state: Yup.string().required("Este campo es requerido."),
    municipality: Yup.string().required("Este campo es requerido."),
    cologne: Yup.string().required("Este campo es requerido."),
    country: Yup.string().required("Este campo es requerido."),
    postPerson: Yup.string()
      .required("Este campo es requerido.")
      .min(5, "El formato es incorrecto"),
  })

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    resetForm,
    setValues,
    handleBlur,
    touched
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: false,
  });
  return (
    <>
      <Stack direction="column" spacing={3}>
        <Box>
          <Accordion expanded={expanded === "DP"}
            onChange={handleAccordionChange("DP")}
          >
            <AccordionSummary>
              <Typography sx={{ ...LinkLargeFont }}>
                DATOS DE LA PERSONA
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="form" onSubmit={handleSubmit} padding={1}>
                {person || (municipalities && locations) || valuesData?.Policy ? (
                  <Stack direction='row' spacing={5}>
                    <FormControlLabel
                      disabled={disabled || disabledHypertext || person}
                      control={
                        <Checkbox
                          onChange={(e, Checkbox) => handleSetContractor(Checkbox)}
                        />
                      }
                      label="Mismo al contratante"
                    />
                    <React.Fragment>
                      <Box>
                        {contractor ?
                          <Stack direction='column' spacing={1} alignItems='center'>
                            <CircularProgress sx={{ color: "#E5105D" }} size={25} />
                            <Typography sx={{ color: "#E5105D" }}>Cargando contratante...</Typography>
                          </Stack>
                          :
                          null
                        }
                      </Box>
                    </React.Fragment>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="rectangular" width={150} height={20} />
                  </Stack>
                )}
                <Stack direction="column" spacing={1}>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 2 }}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Nombre</Typography>
                        <TextField
                          disabled={disabled || disabledHypertext || person}
                          placeholder="Nombre"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && !!errors.name}
                        />
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {touched.name && errors.name}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                        <TextField
                          disabled={disabled || disabledHypertext || person}
                          placeholder="RFC"
                          name="rfc"
                          value={values.rfc}
                          onChange={handleChange}
                          error={!!errors.rfc}
                        />
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.rfc}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Calle</Typography>
                        <TextField
                          disabled={disabled || disabledHypertext || person}
                          placeholder="Calle"
                          name="street"
                          value={values.street}
                          onChange={handleChange}
                          error={!!errors.street}
                        />
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.street}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Estado</Typography>
                        <Select
                          disabled={disabled || disabledHypertext || person}
                          sx={{ width: "100%" }}
                          name="state"
                          defaultValue={0}
                          value={values.state}
                          onChange={handleChange}
                          error={!!errors.state}
                        >
                          <MenuItem key={"0"} value={"0"} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.Entity ?? []).map((data: Entidad) => (
                            <MenuItem
                              onClick={() => {
                                setFieldValue("municipality", 0);
                                setFieldValue("cologne", 0);
                                handleStateMunicipalities(data.cvE_ENT);
                              }}
                              key={data.cvE_ENT}
                              value={data.cvE_ENT}
                            >
                              {data.noM_ENT}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.state}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Municipio</Typography>
                        <Select
                          disabled={disabled || disabledHypertext || person}
                          sx={{ width: "100%" }}
                          name="municipality"
                          defaultValue={0}
                          value={values.municipality}
                          onChange={handleChange}
                          error={!!errors.municipality}
                        >
                          <MenuItem key={"0"} value={"0"} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(municipalities ?? []).map((data: any) => (
                            <MenuItem
                              onClick={() => {
                                setFieldValue("cologne", 0);
                                handleMunicipalitie(values.state, data.municipalityId);
                              }}
                              key={data.municipalityId}
                              value={data.municipalityId}
                            >
                              {data.municipalityName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.municipality}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Colonia</Typography>
                        <Select
                          disabled={disabled || disabledHypertext || person}
                          sx={{ width: "100%" }}
                          name="cologne"
                          defaultValue={0}
                          value={values.cologne}
                          onChange={handleChange}
                          error={!!errors.cologne}
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(locations ?? []).map((data: any) => (
                            <MenuItem key={data.colonyId} value={data.colonyId}>
                              {data.colonyName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.cologne}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>CP</Typography>
                        <TextField
                          disabled={disabled || disabledHypertext || person}
                          type="text"
                          placeholder="Código Postal"
                          name="postPerson"
                          value={values.postPerson === 0 ? "" : values.postPerson}
                          onChange={(e) => {
                            setFieldValue('postPerson', e.target.value);
                            if ((e.target.value).length == 5) {
                              fetchLocationDataByZipCode(e.target.value)
                            } else {
                              setSearchByZipCode(false)
                            }
                          }}
                          helperText={errors.postPerson?.toString()}
                          error={!!errors.postPerson}
                          InputProps={{
                            readOnly: searchByZipCode,
                            endAdornment: (
                              <React.Fragment>
                                {searchByZipCode ? <CircularProgress sx={{ color: "#E5105D" }} size={20} /> : null}
                              </React.Fragment>
                            ),
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>País</Typography>
                        <Select
                          disabled={disabled || disabledHypertext || person}
                          sx={{ width: "100%" }}
                          name="country"
                          defaultValue={0}
                          value={values.country === "" ? 0 : values.country}
                          onChange={handleChange}
                          error={!!errors.country}
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.countryCatalog.values ?? []).map(
                            (data: CatalogValue) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data.description}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.country}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Clasificación</Typography>
                        <Select
                          disabled={disabled || disabledHypertext || person}
                          sx={{ width: "100%" }}
                          name="classification"
                          defaultValue={0}
                          value={values.classification ? values.classification : 0}
                          onChange={(e: any) => {
                            //handleChange(e);
                            if(titular.length === 0 && e.target.value !== Constants.folioTitular ){
                              setDataAlert(true, "Deberá agregar un titular", "error",3000);
                              setFieldValue("classification", "");
                            }else{
                              setFieldValue("classification", e.target.value);
                            }
                          }}
                          error={!!errors.classification}
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.clasificationCatalog.values ?? []).map(
                            (data: CatalogValue) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data.description}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.classification}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                    {(values.classification !== Constants.folioTitular) &&   titular.length > 0 && (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Titular</Typography>
                          <Autocomplete
                            disabled={disabledHypertext || person}
                            noOptionsText="No se encontraron coincidencias"
                            loadingText="Buscando..."
                            options={titular ?? []}
                            getOptionLabel={(option: any) => `${option.name}`}
                            isOptionEqualToValue={(option, value) =>
                              option.name === value.name
                            }
                            onChange={(e, value) => {
                              setValueTitular(value);
                            }}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loadingTitular ? (
                                        <CircularProgress
                                          color="inherit"
                                          sx={{ color: "#E5105D" }}
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.classification}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={12} md={6} lg={8} />
                    <Grid item xs={12} sm={12} md={6} lg={8} />
                    {person !== true ?
                      (<><Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        textAlign="center"
                        padding={1}
                      >
                        <Button
                          disabled={disabled || disabledHypertext}
                          size="small"
                          endIcon={<Complete color={ColorPureWhite} />}
                          onClick={() => {
                            resetForm();
                          }}
                        >
                          Limpiar
                        </Button>
                      </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={3}
                          lg={2}
                          textAlign="center"
                          padding={1}
                        >
                          <Button
                            disabled={disabledHypertext}
                            size="small"
                            type="submit"
                            endIcon={<Complete color={ColorPureWhite} />}
                          >
                            Guardar
                          </Button>
                        </Grid></>) : (<></>)}
                  </Grid>
                </Stack>
                <DataGrid
                  rows={rows}
                  sx={{
                    // disable cell selection style
                    ".MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    // pointer cursor on ALL rows
                    "& .MuiDataGrid-row:hover": {
                      cursor: "pointer",
                    },
                    mt: 5,
                  }}
                  columns={columns}
                  getRowId={(row) => row.folio + ""}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}


                  slots={{
                    noRowsOverlay: () => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <Typography>No se encontraron registros</Typography>
                        </Box>
                      );
                    },
                  }}
                  pageSizeOptions={[10, 20, 30]}
                  disableRowSelectionOnClick
                  isRowSelectable={(params) => params.row.beneficiaries !== null}

                //getDetailPanelContent={getDetailPanelContent}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              disabled={!props.policy || disabled || disabledHypertext}
              endIcon={<Complete color={ColorPureWhite} />}
              onClick={validateIssue}
            >
              Emitir Póliza
            </Button>
          </Stack>
        </Box>
        <Dialog open={openContent} onClose={handleClose}>
          <DialogTitle>Confirmar</DialogTitle>
          <DialogContent>
            <DialogContentText>{confirmContent}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {props.policy && policyDone?.done ? (
              <>
                <Button size="small" variant="text" onClick={handleClose}>
                  No
                </Button>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleIssue}
                >
                  Si
                </Button>
              </>
            ) : (
              <Button size="small" variant="text" onClick={handleClose}>
                Regresar
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Stack>
      {open && (
        <NewContactModal
          open={open}
          policy={props.policy}
          person={personFolio}
          close={() => {
            setOpen(false);
          }}
        />
      )}
      <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      {waiting !== false ? <LoadingScreen message="Cargando" /> : <></>}
    </>
  );
}

export default TabPerson;
