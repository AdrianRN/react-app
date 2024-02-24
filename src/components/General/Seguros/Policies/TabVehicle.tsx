import React from "react";
import {
  Divider,
  Tooltip,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import {
  ColorGrayDark,
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Autocomplete, Box, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText, IconButton } from "@mui/material";
import { Beneficiary, Cancel, Complete, Delete, Plus, Refresh } from "../../../OuiComponents/Icons";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import {
  CircularProgress, Dialog,
} from "../../../OuiComponents/Feedback";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { Select, Button, TextField } from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import YearCatalog from "../../../../insuranceModels/yearcatalog";
import ChubbCatalogVehicleService from "../../../../insuranceServices/chubbCatalogVehicles.service";
import VehicleCatalog from "../../../../insuranceModels/vehiclecatalog";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CacheService from "../../../../services/cache.service";
import CatalogValue from "../../../../models/CatalogValue";
import { useFormik } from "formik";
import { Entidad } from "../../../../models/Entidad";
import LocationService from "../../../../services/location.service";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import VehicleBeneficiaryModal from "./VehicleBeneficiaryModal";
import Constants from "../../../../utils/Constants";
import PolicyService from "../../../../insuranceServices/policies.service";
import Policie from "../../../../insuranceModels/policies";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import policyHooks from "../../../../hooks/policyHooks";
import policySumary from "../../../../models/PolicySumary";
import { getCatalogValueFolio } from "../../../../services/catalogvalue.service";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import receiptsGenerator from "./ReceiptsGenerator";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface policieVehcicleData {
  insurancePolicy: Policie,
  Years: YearCatalog[],
  Uses: CacheCatalogValue,
  Services: CacheCatalogValue,
  Entidad: Entidad[],
  Policy: any
}

interface policyDoneData {
  message: string;
  done: boolean;
}

function TabVehicle(props: any) {
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
  const [loading, setLoading] = React.useState(true);
  const [waiting, setWaiting] = React.useState(true);
  const [loadingVehicle, setLoadingVehicle] = React.useState(false);
  const [loadingYear, setLoadingYear] = React.useState(true);
  const [valuesData, setValuesData] = React.useState<policieVehcicleData>();
  const [vehicleCatalog, setVehicleCatalog] = React.useState<VehicleCatalog[]>();
  const [showModal, setShowModal] = React.useState(false);
  const [vehicleFolio, setVehicleFolio] = React.useState();
  const [disabled, setDisabled] = React.useState(false);
  const [vehicle, setVehicle] = React.useState(false);
  //Este hook desactiva todo para que no se puedan agregar mas autos
  //si es que existe uno en ROWS, manejarlo si se requiere edicion del vehiculo
  const [disableDueVehicle, setDisableDueVehicle] = React.useState(false);
  //Este hook activa el modo edicion de vehiculo si seleccionas uno
  const [editionMode, setEditionMode] = React.useState(false);
  //Este hook guarda los anios indexados
  const [yearsIndex, setYearsIndex] = React.useState<any[]>([]);////----------------------> Cambio para renderizar vehiculos
  const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
  const [confirmContent, setConfirmContent] = React.useState("");
  const [openContent, setOpenContent] = React.useState(false);
  const [descriptionVehicle, setDescriptionVehicle] = React.useState('');
  ////----------------------> Cambio para renderizar vehiculos
  //Este hook almacena la cadena del vehiculo seleccionado
  const [DefaultValueVehicle, setDefaultValueVehicle] = React.useState<any | null>(null);
  //Este hook guarda el anio para seleccionar el catalogo
  const [yearCatalog, setYearCatalog] = React.useState<any | null>(null)

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      await fetchData();
      await fetchVehiclesGrid();
      await fetchValidateStatusPoliciy();
    } finally {
      setWaiting(false);
    }
  };

  const fetchData = async () => {
    const responsePolicyData = await PolicyService.getPoliciesByFolio(
      props.data
    );
    const responseInsurancePolicy = await PolicyService.getPoliciesByFolio(
      props.data
    );
    const yearCatalog = await ChubbCatalogVehicleService.getYearsCatalog();
    ////----------------------> Cambio para renderizar vehiculos
    const tempIndexYear = yearCatalog.data.reduce((acc: any, el: any) => {
      acc[el.year] = el
      return acc
    }, {});
    setYearsIndex(tempIndexYear);
    //;-------------------------------------------------------------------------
    const useCatalog = await CacheService.getByFolioCatalog(
      Constants.useCatalogFolio
    );
    const serviceCatalog = await CacheService.getByFolioCatalog(
      Constants.serviceCatalogFolio
    );
    const entidadCatalog = await LocationService.getStates();

    if (responsePolicyData.data) {
      const responsePolicyDone = await policyHooks.getPolicyDone(responsePolicyData.data)
      setPolicyDone(responsePolicyDone)
      setFieldValue('noPolicy', responsePolicyData.data.noPolicy)
    }

    setValuesData({
      insurancePolicy: responseInsurancePolicy.data,
      Years: yearCatalog.data,
      Uses: useCatalog.data,
      Services: serviceCatalog.data,
      Entidad: entidadCatalog.data,
      Policy: responsePolicyData.data ?? undefined
    });

    setLoadingYear(false);
  };

  const handleClose = () => {
    setOpenContent(false);
  };

  const fetchVehiclesGrid = async () => {
    const vehiclePolicy = await VehiclePolicy.getVehiclePolicy(props.data);
    setRows(vehiclePolicy.data);

    if (vehiclePolicy.data.length > 0) {
      setVehicle(rows.length === 1 &&
        props.data.folioBranch === Constants.folioCarBranch)
      setDisableDueVehicle(true);
    } else {
      setVehicle(false)
      setDisableDueVehicle(false);
    }

    setLoading(false);
  };

  const fetchVehicleCatalogs = async (year: any, brand: any) => {
    const vehicleCat = await CacheService.getChubbVehicleByYear(year, brand);
    setVehicleCatalog(vehicleCat.data);
    setLoadingVehicle(false);
  };

  const fetchValidateStatusPoliciy = async () => {
    const policieResponse = await PolicyService.getPoliciesByFolio(props.data);

    if (policieResponse.data) {
      setDisabled(policieResponse.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)
    }

  };

  const handleYearSelect = (year: any) => {
    setLoadingVehicle(true);
    fetchVehicleCatalogs(year, '');
  };

  const resetVehicleForm = () => {
    setEditionMode(false);
    setDisableDueVehicle(true);
    setYearCatalog(null)
    setDefaultValueVehicle(null)
    resetForm()
  }

  const handleRowClick: GridEventListener<'rowClick'> = (params: any) => {
    setWaiting(true)
    setEditionMode(true);
    setDisableDueVehicle(false)
    setYearCatalog(yearsIndex[params.row.vehicle.model]);
    setDescriptionVehicle(params.row.vehicle.description)
    setValues({
      folio: params.row.folio,
      policyFolio: props.data,
      noPolicy: valuesData?.Policy.noPolicy,
      vehicleFolio: params.row.vehicleFolio,
      noSerie: params.row.noSerie,
      motor: params.row.motor,
      useFolio: params.row.useFolio,
      serviceFolio: params.row.serviceFolio,
      state: params.row.state,
      plates: params.row.plates,
      beneficiaryFolio: params.row.beneficiaryFolio,
    })
    setWaiting(false)
  };

  const changeVehicle = async (folio: any, brand: any) => {
    setDefaultValueVehicle(Object(vehicleCatalog ?? [])
      .find((option: any) => option.folio === folio && option.brand === brand) ?? null);
  };

  const changeYear = (data: any) => {
    if (data !== 0) {
      setYearCatalog(yearsIndex[data]);
    }
  };

  const validateSave = (values: any) => {
    if (!values.vehicleFolio) {
      errors.vehicleFolio = "Este campo es requerido."
      setFieldTouched('vehicleFolio', true, false)
      return
    } else if (!values.useFolio) {
      errors.useFolio = "Este campo es requerido."
      setFieldTouched('useFolio', true, false)
      return
    } else if (!values.serviceFolio) {
      errors.serviceFolio = "Este campo es requerido."
      setFieldTouched('serviceFolio', true, false)
      return
    } else if (!values.state) {
      errors.state = "Este campo es requerido."
      setFieldTouched('state', true, false)
      return
    } else if (!values.noSerie) {
      errors.noSerie = "Este campo es requerido."
      setFieldTouched('noSerie', true, false)
      return
    } else if (Object(values.noSerie).length < 8 || Object(values.noSerie).length > 17) {
      errors.noSerie = "Debe tener entre 8 y 17 dígitos"
      setFieldTouched('noSerie', true, false)
      return
    } else {
      submitForm()
    }
  }

  const handleAddBeneficiaryClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, params: any) => {
    event.stopPropagation()
    setVehicleFolio(params);
    setShowModal(true);
  };

  const handleVehicleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, folio: string) => {
    event.stopPropagation()
    VehiclePolicy.deleteByFolio(folio)
      .then((response: any) => {
        setDataAlert(true, "El vehículo ha sido eliminado.", "success", autoHideDuration);
        props.onDataChange(response.data.policyFolio);
        setLoading(true);
        fetchVehiclesGrid();
        fetchData();
        resetVehicleForm();
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const onSubmit = (data: any) => {
    if (data.folio) {
      const request = {
        folio: data.folio,
        policyFolio: data.policyFolio,
        noPolicy: data.noPolicy,
        noSerie: data.noSerie,
        motor: data.motor,
        useFolio: data.useFolio,
        serviceFolio: data.serviceFolio,
        plates: data.plates,
        state: data.state
      }

      VehiclePolicy.putVehiclePolicy(request)
        .then((response: any) => {
          setDataAlert(true, "El vehículo se actualizó con éxito.", "success", autoHideDuration);
          setLoading(true);
          props.onDataChange(props.data);
          fetchVehiclesGrid();
          fetchData();
          resetVehicleForm();
        }).catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });

    } else {
      VehiclePolicy.postVehiclePolicy(data)
        .then((response: any) => {
          setDataAlert(true, "El vehículo se registró con éxito.", "success", autoHideDuration);
          setLoading(true);
          props.onDataChange(props.data);
          fetchVehiclesGrid();
          fetchData();
          resetVehicleForm();
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });

    }
  };

  const validateIssue = () => {
    PolicyService.checkIssuanceStatus(props.data)
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
    PolicyService.issuancePolicy(props.data)
      .then(async (response: any) => {
        setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
        props.onDataChange(props.data);
        await createReceipts(response.data);//===============================================================;
        fetchValidateStatusPoliciy();
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }).finally(() => {
        setOpenContent(false);
      });
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
    let branchName = valuesDataIndex[policy?.branchId]?.branch?.description ?? '';
    //Obtenemos la comision
    let branchCommission = Number(valuesDataIndex[policy?.branchId]?.branch?.commissionPercentage) ?? 0;
    const sumary: policySumary = {
      policyFolio: policy.folio ?? props?.data ?? "",
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
      branch: branchName, //'',
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
      field: "folio",
      headerName: "Auto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.vehicle.brand +
              " " +
              params.row.vehicle.shortDescription}
          </Typography>
        );
      },
    },
    {
      field: "year",
      headerName: "Año",
      flex: 1,
      minWidth: 150,

      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.vehicle.model}</Typography>
        );
      },
    },
    {
      field: "serie",
      headerName: "Núm. Serie",
      flex: 1,
      minWidth: 150,

      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.noSerie}</Typography>;
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 100,

      renderCell: (params: any) => (
        <>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Eliminar
              </Typography>
            }
          >
            <Box>
              <IconButton
                disabled={disabled}
                onClick={(e) => {
                  handleVehicleDelete(e, params.row.folio)
                }}
              >
                <Delete color={ColorPink} />
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Beneficiario
              </Typography>
            }
          >
            <Box>
              <IconButton
                disabled={disabled}
                onClick={(e) => {
                  handleAddBeneficiaryClick(e, params.row)
                }}
              >
                <Beneficiary
                  color={params.row.beneficiaryFolio ? ColorPink : ColorGrayDark}
                />
              </IconButton>
            </Box>
          </Tooltip>
        </>
      ),
    },
  ];

  const initialValues = {
    folio: "",
    policyFolio: props.data ?? "",
    noPolicy: "",
    vehicleFolio: "",
    noSerie: "",
    motor: "",
    useFolio: "",
    serviceFolio: "",
    state: 0,
    plates: "",
    beneficiaryFolio: "",
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    submitForm,
    setFieldTouched,
    touched,
    handleBlur,
    resetForm,
    setValues
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true
  });
  //;---------------------------------------------------------------------------------------

  return (
    <>
      {showModal ? (
        <VehicleBeneficiaryModal
          data={vehicleFolio}
          open={showModal}
          close={() => {
            setShowModal(false);
            setLoading(true);
            getData();
          }}
        />
      ) : (
        <></>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Typography sx={LinkLargeFont}>Datos del Vehículo</Typography>
        <Stack direction="column" spacing={6}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Año</Typography>
                <Autocomplete
                  disabled={(disabledHypertext ? disabledHypertext : disabled ||
                    (editionMode || disableDueVehicle))}
                  fullWidth
                  disableClearable
                  isOptionEqualToValue={(option, value) =>
                    option.yearId === value.yearId
                  }
                  getOptionLabel={(option) => option.year.toString()}
                  options={valuesData?.Years ?? []}
                  loading={loadingYear}
                  noOptionsText="No se encontraron coincidencias"
                  loadingText="Buscando..."
                  renderOption={(props, option) => (
                    <li {...props} key={option.yearId}>
                      {option.year.toString()}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      placeholder="  Elige"
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingYear ? (
                              <CircularProgress
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
                  onChange={(event, value) => {
                    if (value) {
                      handleYearSelect(value?.year);
                      changeYear(value?.year)////----------------------> Cambio para renderizar vehiculos
                    } else {
                      setVehicleCatalog([]);
                    }
                  }}
                  value={yearCatalog}////----------------------> Cambio para renderizar vehiculos
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === "Tab" ||
                      e.key === "Backspace"
                    )
                      e.preventDefault();
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Auto</Typography>
                {editionMode ?
                  <TextField
                    disabled
                    value={descriptionVehicle}
                    InputProps={{
                      endAdornment: (
                        <>
                          <ArrowDropDownIcon />
                        </>
                      ),
                    }}
                  /> :
                  <Autocomplete
                    disabled={(disabledHypertext ? disabledHypertext : disabled) ||
                      (editionMode || disableDueVehicle)}
                    fullWidth
                    getOptionLabel={(option) =>
                      option.brand + " " + option.description
                    }
                    options={vehicleCatalog ?? []}
                    loading={loadingVehicle}
                    noOptionsText="No se encontraron coincidencias"
                    loadingText="Buscando..."
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.vehicle}>
                        {option.brand + " " + option.description}
                      </Box>
                    )}
                    onChange={(event, value) => {
                      if (value) {
                        setFieldValue("vehicleFolio", value.folio);
                        changeVehicle(value.folio, value.brand);////----------------------> Cambio para renderizar vehiculos
                      } else {
                        setFieldValue("vehicleFolio", '');
                        setDefaultValueVehicle(null)
                      }
                    }}
                    value={DefaultValueVehicle}////----------------------> Cambio para renderizar vehiculos
                    renderInput={(params) => (
                      <TextField
                        name="vehicleFolio"
                        error={touched.vehicleFolio && !!errors.vehicleFolio}
                        helperText={touched.vehicleFolio && errors.vehicleFolio}
                        onBlur={handleBlur}
                        placeholder="  Busca tu vehículo"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingVehicle ? (
                                <CircularProgress
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
                }
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Uso</Typography>
                <Select
                  sx={{ width: "100%" }}
                  name="useFolio"
                  value={values.useFolio ? values.useFolio : 0}
                  onChange={handleChange}
                  error={touched.useFolio && !!errors.useFolio}
                  disabled={(disabledHypertext ? disabledHypertext : disabled) || disableDueVehicle}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(valuesData?.Uses.values ?? []).map(
                    (data: CatalogValue) => (
                      <MenuItem key={data.folio} value={data.folio}>
                        {data.description}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: "#d22e2e" }}>
                  {touched.useFolio && errors.useFolio}
                </FormHelperText>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Servicio</Typography>
                <Select
                  sx={{ width: "100%" }}
                  name="serviceFolio"
                  value={values.serviceFolio ? values.serviceFolio : 0}
                  onChange={handleChange}
                  error={touched.serviceFolio && !!errors.serviceFolio}
                  disabled={(disabledHypertext ? disabledHypertext : disabled) || disableDueVehicle}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(valuesData?.Services.values ?? []).map(
                    (data: CatalogValue) => (
                      <MenuItem key={data.folio} value={data.folio}>
                        {data.description}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: "#d22e2e" }}>
                  {touched.serviceFolio && errors.serviceFolio}
                </FormHelperText>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>
                  Estado de Circulación
                </Typography>
                <Select
                  sx={{ width: "100%" }}
                  name="state"
                  value={values.state ? values.state : 0}
                  onChange={handleChange}
                  error={touched.state && !!errors.state}
                  disabled={(disabledHypertext ? disabledHypertext : disabled) || disableDueVehicle}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(valuesData?.Entidad ?? []).map((data: Entidad) => (
                    <MenuItem key={data.cvE_ENT} value={data.cvE_ENT}>
                      {data.noM_ENT}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#d22e2e" }}>
                  {touched.state && errors.state}
                </FormHelperText>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>No de Serie</Typography>
                <TextField
                  placeholder="No de Serie"
                  name="noSerie"
                  value={values.noSerie}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.noSerie && errors.noSerie}
                  error={touched.noSerie && !!errors.noSerie}
                  disabled={(disabledHypertext ?? disabled) || disableDueVehicle}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Motor</Typography>
                <TextField
                  placeholder="Motor"
                  name="motor"
                  value={values.motor}
                  onChange={handleChange}
                  disabled={(disabledHypertext ?? disabled) || disableDueVehicle}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont }}>Placa</Typography>
                <TextField
                  placeholder="Placa"
                  name="plates"
                  value={values.plates}
                  onChange={handleChange}
                  disabled={(disabledHypertext ?? disabled) || (disableDueVehicle)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} />
            <Grid item xs={12} md={12} alignSelf="flex-end" textAlign="end" padding={1}>
              {(disableDueVehicle !== true) && editionMode !== true ? (<Button
                onClick={() => { validateSave(values) }}
                size="small"
                endIcon={<Plus color={ColorPureWhite} />}
                disabled={(disabledHypertext ? disabledHypertext : (vehicle || disabled) || disableDueVehicle)}
              >
                Agregar Auto
              </Button>) : (<></>)}

              {editionMode ? (<><Button
                variant="outlined"
                size="small"
                endIcon={<Cancel />}
                onClick={resetVehicleForm}
              >
                Cancelar
              </Button>
                <>   </>
                <Button
                  size="small"
                  endIcon={<Refresh color={ColorPureWhite} />}
                  onClick={() => { validateSave(values) }}
                >
                  Actualizar Auto
                </Button></>) : (<></>)}

            </Grid>
          </Grid>
          <Divider />
          <DataGrid
            sx={{ borderRadius: 4 }}
            loading={loading}
            rows={rows}
            autoHeight
            columns={columns}
            getRowId={(row) => row.vehicleFolio}
            onRowClick={handleRowClick}
          />
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
      <Box paddingTop={3}>
        <Stack direction="row" spacing={1} justifyContent="end">
          <Button
            disabled={!props.data || disabled || disabledHypertext}
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
          {props.data && policyDone?.done ? (
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
      {(waiting !== false) ? <LoadingScreen message='Cargando' /> : <></>}
    </>
  );
}

export default TabVehicle;
