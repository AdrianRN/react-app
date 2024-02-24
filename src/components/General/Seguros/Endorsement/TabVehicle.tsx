import { Autocomplete, Box, FormHelperText, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useFormik } from "formik";
import React from "react";
import { useAlertContext } from "../../../../context/alert-context";
import VehicleCatalog from "../../../../insuranceModels/vehiclecatalog";
import YearCatalog from "../../../../insuranceModels/yearcatalog";
import ChubbCatalogVehicleService from "../../../../insuranceServices/chubbCatalogVehicles.service";
import PolicyService from "../../../../insuranceServices/policies.service";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CatalogValue from "../../../../models/CatalogValue";
import { Entidad } from "../../../../models/Entidad";
import CacheService from "../../../../services/cache.service";
import { endorsementService } from "../../../../services/endorsement.service";
import LocationService from "../../../../services/location.service";
import Constants from "../../../../utils/Constants";
import {
  Divider,
  Tooltip,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Beneficiary, Delete, Plus } from "../../../OuiComponents/Icons";
import { Button, Select, TextField } from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import {
  ColorGrayDark,
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import VehicleBeneficiaryModal from "./VehicleBeneficiaryModal";

interface policieVehcicleData {
  Years: YearCatalog[];
  Uses: CacheCatalogValue;
  Services: CacheCatalogValue;
  Entidad: Entidad[];
}

function TabVehicle(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [rows, setRows] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingVehicle, setLoadingVehicle] = React.useState(false);
  const [loadingYear, setLoadingYear] = React.useState(true);
  const [valuesData, setValuesData] = React.useState<policieVehcicleData>();
  const [vehicleCatalog, setVehicleCatalog] =
    React.useState<VehicleCatalog[]>();
  const [showModal, setShowModal] = React.useState(false);
  const [vehicleFolio, setVehicleFolio] = React.useState();
  const [disabled, setDisabled] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<any>();
  //Este hook verifica si el tipo de endoso es el adecuado para poder realizar una operacion.
  const [transaction, setTransaction] = React.useState("");
  //Este hook se encarga de revisar si un vehiculo fue seleccionado para actualizar
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>(null);

  React.useEffect(() => {
    const getData = async () => {
      await fetchData();
      await fetchVehiclesGrid();
      if (!props.endorsement) {
        await fetchValidateStatusPoliciy();
      }
      await getVehicleInfo();
    };
    getData();
  }, []);

  const fetchData = async () => {
    const yearCatalog = await ChubbCatalogVehicleService.getYearsCatalog();
    const useCatalog = await CacheService.getByFolioCatalog(
      Constants.useCatalogFolio
    );
    const serviceCatalog = await CacheService.getByFolioCatalog(
      Constants.serviceCatalogFolio
    );
    const entidadCatalog = await LocationService.getStates();

    setValuesData({
      Years: yearCatalog.data,
      Uses: useCatalog.data,
      Services: serviceCatalog.data,
      Entidad: entidadCatalog.data,
    });

    setLoadingYear(false);
  };

  const getVehicleInfo = async () => { };

  const [endorsementFolio, setEndorsmentFolio] = React.useState("");
  const [endorsementFolioEndo, setEndorsmentFolioEndo] = React.useState("");
  const [policyFolio, setPolicyFolio] = React.useState("");

  const fetchVehiclesGrid = async () => {
    //Guardamos el folio del endoso:
    setEndorsmentFolio(props.endorsement.folio);
    //Guardamos el folioEndo del endoso
    setEndorsmentFolioEndo(props.endorsement.endorsement[0].folioEndo);
    //Guardamos el folio de la poliza:
    setPolicyFolio(props.endorsement.endorsement[0].policies[0].folio);

    //Asignamos el tipo de transaccion al endoso:
    setTransaction(props.endorsement.endorsement?.[0].transactions);
    if (
      props.endorsement.endorsement?.[0].transactions ==
      Constants.endorsementTransactions.modify
    ) {
      const vehicleTEMP =
        props.endorsement.endorsement?.[0].policies[0].vehiclePolicy[0];
      setSelectedVehicle(vehicleTEMP);
      setFieldValue("yearVehicle", vehicleTEMP.yearVehicle);
      setFieldValue("vehicleFolio", vehicleTEMP.vehicleFolio);

      setFieldValue("useFolio", vehicleTEMP.useFolio);
      setFieldValue("serviceFolio", vehicleTEMP.serviceFolio);
      setFieldValue("state", vehicleTEMP.state);

      setFieldValue("noSerie", vehicleTEMP.noSerie);
      setFieldValue("motor", vehicleTEMP.motor);
      setFieldValue("plates", vehicleTEMP.plates);
    }

    const endorsement = await endorsementService.getEndorsementFolio(
      props.endorsement.folio
    );

    //Obtenemos los vehiculos agregados al endoso en caso de existir alguno.
    let vehicleData =
      endorsement.data?.endorsement?.[0].policies?.[0].vehiclePolicy;
    setRows(vehicleData);
    setLoading(false);
  };

  const fetchVehicleCatalogs = async (year: any) => {
    const vehicleCat = await CacheService.getChubbVehicleByYear(year, '');
    setVehicleCatalog(vehicleCat.data);
    setLoadingVehicle(false);
  };

  const fetchValidateStatusPoliciy = async () => {
    const policieResponse = await PolicyService.getPoliciesByFolio(props.data);
    const statusResponse = await CacheService.getByFolioCatalog(
      Constants.statusCatalogFolio
    );

    if (statusResponse.data) {
      Object(statusResponse.data.values)
        .filter((s: CatalogValue) => s.description === Constants.statusActive)
        .map((status: any) => {
          if (status.folio === policieResponse.data.policyStatus) {
            setDisabled(true);
          }
        });
    }
  };

  const handleYearSelect = (year: any) => {
    setLoadingVehicle(true);
    fetchVehicleCatalogs(year);
  };

  const onSubmit = (data: any) => {
    data.state = Number(data.state); //selectedVehicle
    if (selectedVehicle) {
      patchVehicle(data);
    } else {
      //Si se desea hacer un post
      postVehicle(data);
    }
  };
  const postVehicle = (data: any) => {
    endorsementService
      .postEndorsementVehicle(
        endorsementFolio, //props.endorsement.folio,
        endorsementFolioEndo, //props.endorsement.endorsement[0].folioEndo,
        policyFolio, //props.endorsement.endorsement[0].policies[0].folio,
        data
      )
      .then(async (response: any) => {
        props.onDataChange(response.data);
        setDataAlert(
          true,
          "El vehículo se registró con éxito.",
          "success",
          autoHideDuration
        );
        setLoading(true);
        await fetchVehiclesGrid();
        fetchData();
        resetForm();
        // props.tabChange(2);
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };
  const patchVehicle = (data: any) => {
    endorsementService
      .putEndorSementVehicle(
        endorsementFolio,
        endorsementFolioEndo,
        data?.vehicleFolio,
        policyFolio,
        data
      )
      .then(async (response: any) => {
        props.onDataChange(response.data);
        setDataAlert(
          true,
          "El vehículo se actualizo con éxito.",
          "success",
          autoHideDuration
        );
        setLoading(true);
        await fetchVehiclesGrid();
        fetchData();
        resetForm();
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
    cleanForm();
  };
  const cleanForm = () => {
    try {
      //await handleYearSelect(Number(e.row?.yearVehicle));
      //await setSelectedYear(Number(e.row?.yearVehicle));

      setFieldValue("yearVehicle", "");
      setFieldValue("vehicleFolio", "");

      setFieldValue("useFolio", "");
      setFieldValue("serviceFolio", "");
      setFieldValue("state", "");

      setFieldValue("noSerie", "");
      setFieldValue("motor", "");
      setFieldValue("plates", "");
      setFieldValue("beneficiaryFolio", "");
      setFieldValue("chubVehicles", null);

      setSelectedVehicle(null);
    } catch (e) { }
  };

  const handleAddBeneficiaryClick = (params: any) => {
    setVehicleFolio(params);
    setShowModal(true);
  };

  const handleVehicleDelete = (folio: string) => {
    //VehiclePolicy.deleteByFolio(folio)
    endorsementService
      .deleteEndorsementVehicle(
        endorsementFolio, //props.endorsement.folio,
        endorsementFolioEndo, //props.endorsement.endorsement[0].folioEndo,
        policyFolio, //props.endorsement.endorsement[0].policies[0].folio,
        folio
      )
      .then((response: any) => {
        setDataAlert(
          true,
          "El vehículo ha sido eliminado.",
          "success",
          autoHideDuration
        );
        setLoading(true);
        fetchVehiclesGrid();
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const columns: GridColDef[] = [
    {
      field: "vehicleFolio", //"folio",
      headerName: "Auto",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        //return(<>{params.row.vehicle.brand+" - "+ params.row.vehicle.description}</>);
        return (
          <>
            {params.row.chubVehicles?.[0].brand +
              " - " +
              params.row.chubVehicles?.[0].shortDescription}
          </>
        );
      },
    },
    {
      field: "yearVehicle", //"year",
      headerName: "Año",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        return <>{params.row.chubVehicles?.[0].model}</>;
      },
    },
    {
      field: "noSerie", //"serie",
      headerName: "Núm. Serie",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 100,
      renderCell: (params: any) => {
        return (
          <>
            <>
              {params.row?.folio ? (
                <></>
              ) : transaction == Constants.endorsementTransactions.addEntity ? (
                <>
                  <Tooltip
                    title={
                      <Typography
                        sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                      >
                        Eliminar
                      </Typography>
                    }
                  >
                    <IconButton
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      onClick={() =>
                        handleVehicleDelete(params.row.vehicleFolio)
                      }
                    >
                      <Delete color={ColorPink} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      <Typography
                        sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                      >
                        Beneficiario
                      </Typography>
                    }
                  >
                    <IconButton
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      onClick={() =>
                        handleAddBeneficiaryClick(
                          //params.row.vehicleFolio
                          {
                            endorsementFolio: endorsementFolio,
                            endorsementFolioEndo: endorsementFolioEndo,
                            policyFolio: policyFolio,
                            vehicleFolio: params.row.vehicleFolio,
                          }
                        )
                      } //folio)}
                    >
                      <Beneficiary
                        color={
                          params.row.beneficiaryFolio
                            ? ColorPink
                            : ColorGrayDark
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              {
                //En caso de ser un endoso tipo D - BAJA DE ASEGURADO UNIDAD
                //Solo se contara con la accion de dar de baja el vehiculo
                transaction ==
                  Constants.endorsementTransactions.removeEntity ? (
                  <>
                    <Tooltip
                      title={
                        <Typography
                          sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                        >
                          Eliminar
                        </Typography>
                      }
                    >
                      <IconButton
                        disabled={disabled ||
                          (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                        onClick={() => {
                          handleVehicleDelete(params.row.vehicleFolio)
                        }}
                      >
                        <Delete color={ColorPink} />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <></>
                )
              }
            </>
          </>
        );
      },
    },
  ];
  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      policyFolio: policyFolio, //props.endorsement.policy,
      noPolicy: policyFolio, //props.endorsement.policy,
      vehicleFolio:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.vehicleFolio
          : "", //props.endorsement.endorsement?.[0].policies?.[0].vehiclePolicy?.[0].vehicleFolio,
      noSerie:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.noSerie
          : "",
      yearVehicle: selectedYear,
      motor:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.motor
          : "",
      useFolio:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.useFolio
          : "",
      serviceFolio:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.serviceFolio
          : "",
      state:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.state
          : "",
      plates:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.plates
          : "",
      beneficiaryFolio:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.beneficiaryFolio
          : "", //props.endorsement.endorsement?.[0].policies?.[0].vehiclePolicy?.[0].beneficiaryFolio,
      objectStatusId: 1,
      chubVehicles:
        props.endorsement.endorsement?.[0].transactions ==
          Constants.endorsementTransactions.modify
          ? selectedVehicle?.chubVehicles
          : null,
    },
    onSubmit,
    enableReinitialize: true,
  });

  // prueba();
  return (
    <>
      {showModal ? (
        <VehicleBeneficiaryModal
          data={vehicleFolio}
          open={showModal}
          close={() => {
            fetchVehiclesGrid();
            setLoading(true);
            setShowModal(false);
          }}
        />
      ) : (
        <></>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Typography sx={LinkLargeFont}>Datos del Vehículo</Typography>
        <Stack direction="column" spacing={6}>
          {
            //Aqui validamos cuando se puede mostrar el formulario segun el tipo de endoso
            //Si es un endoso tipo A ALTA DE ASEGURADO/ UNIDAD
            transaction == Constants.endorsementTransactions.addEntity ||
              //Si es un endoso tipo B MODIFICAR ENDOSO GENERAL
              transaction == Constants.endorsementTransactions.modify ? (
              <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>Año</Typography>
                    <Autocomplete
                      disabled={
                        (transaction == Constants.endorsementTransactions.modify
                          ? true
                          : disabled) ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                      }
                      fullWidth
                      disableClearable
                      isOptionEqualToValue={(option, value) =>
                        option.year === value.year
                      }
                      getOptionLabel={(option) => option.year.toString()}
                      options={valuesData?.Years ?? []}
                      loading={loadingYear}
                      noOptionsText="No se encontraron coincidencias"
                      loadingText="Buscando..."
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.yearId}>
                          {option.year.toString()}
                        </Box>
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
                          setSelectedYear(value?.year); // Actualiza el estado con el año seleccionado
                        } else {
                          setVehicleCatalog([]);
                          setSelectedYear(null); // Puedes restablecer el estado si es necesario
                        }
                      }}
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
                    <Autocomplete
                      disabled={
                        (transaction == Constants.endorsementTransactions.modify
                          ? true
                          : disabled) ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                      }
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
                      renderInput={(params) => (
                        <TextField
                          error={!!errors.vehicleFolio}
                          // helperText={errors.vehicleFolio}
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
                      onChange={(event, value) => {
                        setFieldValue("vehicleFolio", value?.folio);
                      }}
                    />
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
                      error={!!errors.useFolio}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
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
                    {/* <FormHelperText sx={{ color: "#d22e2e" }}> */}
                    {/* {errors.useFolio} */}
                    {/* </FormHelperText> */}
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
                      error={!!errors.serviceFolio}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
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
                    {/* <FormHelperText sx={{ color: "#d22e2e" }}> */}
                    {/* {errors.serviceFolio} */}
                    {/* </FormHelperText> */}
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
                      value={values?.state ? values?.state : 0}
                      onChange={handleChange}
                      error={!!errors.state}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.Entidad ?? []).map(
                        (data: Entidad) => (
                          <MenuItem
                            key={data.cvE_ENT}
                            value={data.cvE_ENT.toString()}
                          >
                            {data.noM_ENT}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {/* <FormHelperText sx={{ color: "#d22e2e" }}> */}
                    {/* {errors.state} */}
                    {/* </FormHelperText> */}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>
                      No de Serie
                    </Typography>
                    <TextField
                      placeholder="No de Serie"
                      name="noSerie"
                      value={values?.noSerie}
                      onChange={handleChange}
                      // helperText={errors.noSerie}
                      error={!!errors.noSerie}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    />
                    <FormHelperText sx={{ color: "#d22e2e" }}></FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>Motor</Typography>
                    <TextField
                      placeholder="Motor"
                      name="motor"
                      value={values?.motor}
                      onChange={handleChange}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    />
                    <FormHelperText sx={{ color: "#d22e2e" }}></FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>Placa</Typography>
                    <TextField
                      placeholder="Placa"
                      name="plates"
                      value={values?.plates}
                      onChange={handleChange}
                      disabled={disabled ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    />
                    <FormHelperText sx={{ color: "#d22e2e" }}></FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} />
                <Grid item xs={12} md={4} alignSelf="flex-end" textAlign="end">
                  {selectedVehicle &&
                    props.endorsement.endorsement?.[0].transactions !=
                    Constants.endorsementTransactions.modify ? (
                    <>
                      <Button
                        //type="submit"
                        variant="outlined"
                        size="small"
                        endIcon={
                          selectedVehicle ? (
                            <></>
                          ) : (
                            <Plus color={ColorPureWhite} />
                          )
                        }
                        onClick={() => cleanForm()}
                        disabled={(props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}//{disabled}
                      >
                        Cancelar
                      </Button>{" "}
                    </>
                  ) : (
                    <></>
                  )}
                  <Button
                    type="submit"
                    size="small"
                    endIcon={
                      selectedVehicle ? <></> : <Plus color={ColorPureWhite} />
                    }
                    disabled={disabled ||
                      (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                  >
                    {selectedVehicle ? "Actualizar auto" : "Agregar Auto"}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <></>
            )
          }
          <Divider />
          <DataGrid
            sx={{ borderRadius: 4 }}
            loading={loading}
            rows={rows}
            autoHeight
            columns={columns}
            getRowId={(row) => row.vehicleFolio + ""}
            onCellClick={async (e) => {

              try {
                //await handleYearSelect(Number(e.row?.yearVehicle));
                //await setSelectedYear(Number(e.row?.yearVehicle));

                setFieldValue("yearVehicle", e.row?.yearVehicle);
                setFieldValue("vehicleFolio", e.row?.vehicleFolio);

                setFieldValue("useFolio", e.row?.useFolio);
                setFieldValue("serviceFolio", e.row?.serviceFolio);
                setFieldValue("state", e.row?.state);

                setFieldValue("noSerie", e.row?.noSerie);
                setFieldValue("motor", e.row?.motor);
                setFieldValue("plates", e.row?.plates);

                setFieldValue("beneficiaryFolio", e.row?.beneficiaryFolio);
                setFieldValue("chubVehicles", e.row?.chubVehicles);

                setSelectedVehicle(e.row);
              } catch (e) { }
            }}
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
    </>
  );
}

export default TabVehicle;
