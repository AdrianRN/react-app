import React from "react";
import { Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import { GridColDef } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { Beneficiary, Complete, Delete } from "../../../OuiComponents/Icons";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import {
  Alert,
  Skeleton,
  CircularProgress,
  Snackbar,
} from "../../../OuiComponents/Feedback";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import {
  Select,
  Button,
  TextField,
  Checkbox,
} from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CacheService from "../../../../services/cache.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import LocationService from "../../../../services/location.service";
import Constants from "../../../../utils/Constants";
import { Location } from "../../../../models/Location";
import NewContactModal from "../Policies/LifeHealth/NewContactModal";
import ModelPolicy from "../../../../insuranceModels/policies";
import { Entidad } from "../../../../models/Entidad";
import Municipalitie from "../../../../models/Municipalitie";
import ModelLocation from "../../../../models/Location";
import CatalogValue from "../../../../models/CatalogValue";
import { endorsementService } from "../../../../services/endorsement.service";
import { useAlertContext } from "../../../../context/alert-context";

interface PersonData {
  Policy: ModelPolicy;
  Entity: Entidad[];
  countryCatalog: CacheCatalogValue;
  clasificationCatalog: CacheCatalogValue;
}

function TabPerson(props: any) {
  let disabledHypertext = true;
  //Desbloqueamos los campos de edicion dependiendo de la transaccion
  if (
    props.endorsement.endorsement?.[0]?.transactions ===
      Constants.endorsementTransactions.addEntity || //ALTA DE ASEGURADO/ UNIDAD
    props.endorsement.endorsement?.[0]?.transactions ===
      Constants.endorsementTransactions.addPolicyholder || //BENEFICIARIO PREFERETE
    // props.endorsement.endorsement?.[0]?.transactions ===
    //   Constants.endorsementTransactions.modify || //MODIFICAR ENDOSO GENERAL
    props.endorsement.endorsement?.[0]?.transactions ===
      Constants.endorsementTransactions
        .removeEntity /*BAJA DE ASEGURADO/ UNIDAD*/
  ) {
    disabledHypertext = false;
  }
  const [rows, setRows] = React.useState([]);
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState("");
  const [valuesData, setValuesData] = React.useState<PersonData>();
  const [showContractor, setShowContractor] = React.useState(false);
  const [municipalities, setMunicipalities] = React.useState<Municipalitie[]>();
  const [locations, setLocations] = React.useState<any[]>();
  const [personFolio, setPersonFolio] = React.useState<string>();

  //MODAL
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [person, setPerson] = React.useState(false);
  //AutoComplete Titular
  const [titular, setTitular] = React.useState([]);
  const [loadingTitular, setLoadingTitular] = React.useState(false);
  const [valueTitular, setValueTitular] = React.useState<any | null>(null);
  //Hook para operar la busqueda por codigo postal
  const [searchZipCode, setSearchZipCode] = React.useState(false);

  //Este hook almacena datos de la poliza
  const [policyData, setPolicyData] = React.useState({
    policyFolio: props.policyId,
    branch: props.endorsement.endorsement?.[0]?.policies?.[0]?.branchId,
    policy: props.endorsement.endorsement?.[0]?.policies?.[0],
  });
  const [endorsementData, setEndorsementData] = React.useState({
    folioEndo: props.endorsement.folio,
    folioEndorsement: props.endorsement.endorsement?.[0]?.folioEndo,
    folioPolicies: props.endorsement.endorsement?.[0]?.policies?.[0]?.folio,
  });
  //Esta constante almacena la transaccion actual de la poliza
  const currentTransaction = props.endorsement.endorsement?.[0]?.transactions;
  //Este hook almacena el folio de la persona seleccionada para edicion
  const [folio, setFolio] = React.useState<any>(null);
  //Constante para guardar la poliza
  let policyTemp =
    policyData.policy ?? props.endorsement.endorsement?.[0]?.policies?.[0];
  //PErsona por defaul si se define una transaccion directa
  const [defaultPerson, setDefaultPerson] = React.useState<any>(null);
  React.useEffect(() => {
    if (props.policyId) 
      fetchData().finally(()=>{
        validateForm();
    });
  }, []);

  const fetchData = async () => {
    //console.log('propo:',props)  
    //Constante para obtener el branch de la poliza
    const branchPolicy = policyData.branch ?? policyTemp?.branchId;
    //Validamos si es un tipo de endoso general:
    if (currentTransaction === Constants.endorsementTransactions.modify) {
      setDefaultPerson(policyTemp?.personPolicie?.[0]);
      setFields(policyTemp?.personPolicie?.[0]); //defaultPerson
      setFolio(policyTemp?.personPolicie?.[0]?.folio);
    }
    setLoadingTitular(true);
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
    setTitular(
      policyTemp.personPolicie !== null
        ? Object(policyTemp.personPolicie).filter(
            (item: any) => item.parentId === null
          )
        : []
    );
    setLoadingTitular(false);
    setValuesData({
      Policy: policyTemp,
      Entity: responseEntityCatalog.data,
      countryCatalog: responseCountriesCatalog.data,
      clasificationCatalog: responseClasificationCatalog.data,
    });

    if (policyTemp) {
      const filteredRows = 
        (policyTemp?.personPolicie)
        .filter((row:any) => row.objectStatusId === 1);
      setRows(filteredRows ?? []);
      //setRows(policyTemp?.personPolicie ?? []);
      await handleStateMunicipalities(policyTemp?.state);
      handleMunicipalitie(policyTemp?.state, policyTemp?.municipality);
      Object(statusResponse.data.values)
        .filter((s: CatalogValue) => s.description === Constants.statusActive)
        .map((status: any) => {
          if (status.folio === policyTemp?.policyStatusFolio) {
            setDisabled(true);
          }
        });
      if (policyTemp?.personPolicie) {
        setPerson(
          policyTemp?.personPolicie.length === 1 &&
            (branchPolicy === Constants.folioIndividualHealthBranch ||
              branchPolicy === Constants.folioIndividualLifeBranch ||
              branchPolicy === Constants.folioPersonalAccidentsBranch) //props.data.folioBranch
        );
      }
    }
  };

  const handleStateMunicipalities = async (cvE_ENT: number) => {
    if (cvE_ENT > 0) {
      await LocationService.getMunicipalitiesByStateId(cvE_ENT)
        .then((response) => {
          setMunicipalities(response.data[0].municipalitiesList);
        });
    }
  };

  const handleMunicipalitie = async (cvE_ENT: number, cvE_MUN: number) => {
    if (cvE_ENT > 0 && cvE_MUN > 0) {
      await LocationService.getColoniesByStateIdMunicipalityId(cvE_ENT, cvE_MUN)
        .then((response) => {
          setLocations(response.data[0].coloniesList);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  
  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchZipCode(true);

    let state: number = 0;
    let city: number = 0;

    await LocationService.getZipCodeInfo(zipCode)
      .then(async (response: any) => {
        //Se obtienen los id´s
        state = response.data[0].estadoId;
        city = response.data[0].municipioId;

        //Llenado de colonias
        //setLocations(response.data[0].chubbColonies);
        await handleMunicipalitie(state,city);
        await LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            //Llenado de municipios
            setMunicipalities(response.data[0].municipalitiesList);

            //Se mapean campos
            setFieldValue("state", state.toString());
            setFieldValue("municipality", city.toString());
            setFieldValue("country", Constants.folioMexico);
          })
          .catch((e: Error) => {
            setDataAlert(
              true,
              "Error, no se encontraron municipios.",
              "error",
              autoHideDuration
            );
            return;
          })
          .finally(() => {
            setSearchZipCode(false);
          });
      })
      .catch((e: Error) => {
        setDataAlert(
          true,
          "Error, no existe el CP buscado.",
          "error",
          autoHideDuration
        );
        setSearchZipCode(false);
        return;
      });
  };
  const handleDeletePersonClick = async (params: any) => {
    await endorsementService
      .deleteEndorsementPerson(
        endorsementData.folioEndo,
        endorsementData.folioEndorsement,
        endorsementData.folioPolicies,
        params.row.policiePersonId
      )
      //(policyData.policyFolio, params.row.folio)
      .then(async (response: any) => {
        //Asignamos la respuesta de las personas agregadas al
        policyTemp =
          response.data.endorsement?.[0]?.policies[0];
        props.onDataChange(response.data); 
        setAlertContent("Persona eliminada.");
        setAlert(true);
        setShowContractor(false);
        resetForm();
        setFolio(null);
        fetchData();
        const filteredRows = 
        (response.data.endorsement?.[0]?.policies?.[0].personPolicie)
        .filter((row:any) => row.objectStatusId === 1);
        setRows(filteredRows);
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

  const columns: GridColDef[] = [
    {
      field: "inciso",
      headerName: "Inciso",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {" "}
            Inciso {params.row.inciso}
          </Typography>
        );
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
          {(currentTransaction ===
            Constants.endorsementTransactions.addEntity || //ALTA DE ASEGURADO/ UNIDAD
            currentTransaction ===
              Constants.endorsementTransactions.addPolicyholder || //BENEFICIARIO PREFERETE
            currentTransaction ===
              Constants.endorsementTransactions.removeEntity) && //BAJA DE ASEGURADO/ UNIDAD
          currentTransaction !== Constants.endorsementTransactions.modify ? ( //MODIFICAR ENDOSO GENERAL
            <IconButton
              disabled={disabled || 
                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
              onClick={async () => await handleDeletePersonClick(params)}
            >
              <Delete color={ColorPink} />
            </IconButton>
          ) : (
            <></>
          )}
          <IconButton
            disabled={disabled || 
              (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
            onClick={() => {
              handleNewContact(params);
            }}
          >
            <Beneficiary color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];

  //FORM
  const onSubmit = async (data: any) => {
    if (data) {
      if (folio != null) {
        putPersonPolicy(data);
      } else {
        postPersonPolicy(data);
      }
    }
  };
  const postPersonPolicy = async (data: any) => {
    if (data.classification === Constants.folioTitular) {
      //Si persona es el mismo al contratante
      //Manejar con endoso
      await endorsementService
        .postEndorsementPerson(
          endorsementData.folioEndo,
          endorsementData.folioEndorsement,
          endorsementData.folioPolicies,
          data
        )
        .then((response: any) => {
          //Asignamos la respuesta de las personas agregadas al
          policyTemp =
            response.data.endorsement?.[0]?.policies[0];
          props.onDataChange(response.data);
          setAlertContent("La persona se registro con éxito.");
          setAlert(true);
          fetchData();
          setShowContractor(false);
          setPersonFolio(
            response.data.endorsement?.[0]?.policies?.[0].personPolicie[0]
              ?.folio
          );
          const filteredRows = 
          (response.data.endorsement?.[0]?.policies?.[0].personPolicie)
          .filter((row:any) => row.objectStatusId === 1);
          setRows(filteredRows);
          //setRows(response.data.endorsement?.[0]?.policies?.[0].personPolicie);
        });
    } else {
      //Persona diferente
      data.inciso = valueTitular.inciso;
      data.parentId = valueTitular.folio;
      await endorsementService
        .postEndorsementPerson(
          endorsementData.folioEndo,
          endorsementData.folioEndorsement,
          endorsementData.folioPolicies,
          data
        )
        .then((response: any) => {
          //Asignamos la respuesta de las personas agregadas al
          policyTemp.personPolicie =
            response.data.endorsement?.[0]?.policies?.[0].personPolicie;
          props.onDataChange(response.data);
          setAlertContent("La persona se registro con éxito.");
          setAlert(true);
          fetchData();
          setShowContractor(false);
          setPersonFolio(
            response.data.endorsement?.[0]?.policies?.[0].personPolicie[0]
              ?.folio
          );
          const filteredRows = 
          (response.data.endorsement?.[0]?.policies?.[0].personPolicie)
          .filter((row:any) => row.objectStatusId === 1);
          setRows(filteredRows);
          //setRows(response.data.endorsement?.[0]?.policies?.[0].personPolicie);
        });
    }
  };
  const putPersonPolicy = async (data: any) => {
    if (data) {
      await endorsementService
        .putEndorsementPerson(
          endorsementData.folioEndo,
          endorsementData.folioEndorsement,
          endorsementData.folioPolicies,
          folio,
          data
        )
        .then((response) => {
          //Asignamos la respuesta de las personas agregadas al
          policyTemp.personPolicie =
            response.data.endorsement?.[0]?.policies?.[0].personPolicie;
          props.onDataChange(response.data);
          setAlertContent("La persona se actualizo con éxito.");
          setAlert(true);
          fetchData();
          setShowContractor(false);
          setPersonFolio(
            response.data.endorsement?.[0]?.policies?.[0].personPolicie[0]
              ?.folio
          );
          const filteredRows = 
          (response.data.endorsement?.[0]?.policies?.[0].personPolicie)
          .filter((row:any) => row.objectStatusId === 1);
          setRows(filteredRows);
          //setRows(response.data.endorsement?.[0]?.policies?.[0].personPolicie);
        })
        .catch((e: Error) => {
          setAlertContent(e.message);
          setAlert(true);
        });
    }
  };
  const setFields = async (data: any) => {
    if (data) {
      if (data !== "") {
        setFieldValue("folio", data.folio ?? "");
        setFieldValue("name", data.name);
        setFieldValue("rfc", data.rfc);
        setFieldValue("street", data.street);
        setFieldValue("state", data.state);
        setFieldValue("municipality", data.municipality);
        setFieldValue("cologne", data.cologne);
        setFieldValue("country", data.country);
        setFieldValue("postPerson", data.postPerson);
        setFieldValue("classification", data.classification);
        setFieldValue("contacts", data.contacts);
        setFieldValue("inciso", data.inciso);
        setFieldValue("parentId", data.parentId);
      } else {
        setShowContractor(false);
        resetForm();
      }
    }
  };
  const initialValues = {
    folio: "",
    name:
      showContractor && valuesData?.Policy ? valuesData.Policy.clientName : "",
    rfc: showContractor && valuesData?.Policy ? valuesData.Policy.rfc : "",
    street:
      showContractor && valuesData?.Policy ? valuesData.Policy.street : "",
    state: showContractor && valuesData?.Policy ? valuesData.Policy.state : 0,
    municipality:
      showContractor && valuesData?.Policy ? valuesData.Policy.municipality : 0,
    cologne:
      showContractor && valuesData?.Policy ? valuesData.Policy.locality : 0,
    country:
      showContractor && valuesData?.Policy ? valuesData.Policy.country : "",
    postPerson:
      showContractor && valuesData?.Policy ? valuesData.Policy.zip : 0,
    classification:
      showContractor && valuesData?.Policy
        ? valuesData.Policy.classification
          ? valuesData.Policy.classification
          : Constants.folioTitular
        : 0,
    contacts: null,
    parentId: null,
    inciso: 0,
    neighborhood: showContractor && valuesData?.Policy ? valuesData.Policy.neighborhood : 0,
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    resetForm,
    validateForm
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Este campo es requerido."),
      rfc: Yup.string().required("Este campo es requerido."),
      street: Yup.string().required("Este campo es requerido."),
      state: Yup.number()
        .required("Este campo es requerido.")
        .min(1, "Este campo es requerido"),
      municipality: Yup.number()
        .required("Este campo es requerido.")
        .min(1, "Este campo es requerido"),
      cologne: Yup.number()
        .required("Este campo es requerido.")
        .min(1, "Este campo es requerido"),
      country: Yup.string().required("Este campo es requerido."),
      postPerson: Yup.string()
        .required("Este campo es requerido.")
        .min(5, "El formato es incorrecto"),
    }),
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} padding={1}>
        <Typography sx={LinkLargeFont}>Datos de la persona</Typography>
        {props.endorsement.endorsement?.[0]?.transactions ===
          Constants.endorsementTransactions.addEntity || //ALTA DE ASEGURADO/ UNIDAD
        props.endorsement.endorsement?.[0]?.transactions ===
          Constants.endorsementTransactions.addPolicyholder || //BENEFICIARIO PREFERETE
        props.endorsement.endorsement?.[0]?.transactions ===
          Constants.endorsementTransactions.modify ? ( //MODIFICAR ENDOSO GENERAL
          //||(props.endorsement.endorsement?.[0]?.transactions === Constants.endorsementTransactions.removeEntity)//BAJA DE ASEGURADO/ UNIDAD
          <>
            {municipalities && locations ? (
              <FormControlLabel
                disabled={disabled || disabledHypertext ||
                  (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                control={
                  <Checkbox
                    checked={showContractor}
                    onClick={() => setShowContractor(!showContractor)}
                  />
                }
                label="Mismo al contratante"
              />
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      placeholder="Nombre"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      error={!!errors.name}
                    />
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.name}
                    </FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                    <TextField
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      sx={{ width: "100%" }}
                      name="state"
                      defaultValue={0}
                      value={values.state ?? '0'}
                      onChange={handleChange}
                      error={!!errors.state}
                    >
                      <MenuItem key={"0"} value={"0"} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.Entity ?? []).map((data: Entidad) => (
                        <MenuItem
                          onClick={async() => {
                            setFieldValue("municipality", 0);
                            setFieldValue("cologne", 0);
                            await handleStateMunicipalities(data.cvE_ENT);
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current) }
                      sx={{ width: "100%" }}
                      name="municipality"
                      value={
                        municipalities && values.municipality
                          ? values.municipality
                          : '0'
                      }
                      onChange={handleChange}
                      error={!!errors.municipality}
                    >
                      <MenuItem key={"0"} value={"0"} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(municipalities ?? []).map((data: any) => (
                          <MenuItem
                            onClick={async() => {
                              setFieldValue("cologne", 0);
                              await handleMunicipalitie(
                                Number(values.state),
                                data.municipalityId
                              );
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      sx={{ width: "100%" }}
                      name="cologne"
                      defaultValue={0}
                      value={
                        locations && values.cologne ? values.cologne : 0
                      }
                      onChange={handleChange}
                      error={!!errors.cologne}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(locations ?? []).map((data: any) => (
                          <MenuItem
                            onClick={() => {
                              setFieldValue("neighborhood", data.colonyName);
                            }}
                            key={data.colonyId}
                            value={data.colonyId}
                          >
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
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      type="number"
                      placeholder="Código Postal"
                      name="postPerson"
                      value={values.postPerson}
                      onChange={async (e) => {
                        setFieldValue("postPerson", e.target.value);
                        if (e.target.value.length === 5) {
                          await fetchLocationDataByZipCode(e.target.value).finally(()=>{
                            validateForm();
                          });
                        } else {
                          setSearchZipCode(false);
                        }
                      }}
                      error={!!errors.postPerson}
                      InputProps={{
                        readOnly: searchZipCode,
                        endAdornment: (
                          <React.Fragment>
                            {searchZipCode ? (
                              <CircularProgress
                                sx={{ color: "#E5105D" }}
                                size={20}
                              />
                            ) : null}
                          </React.Fragment>
                        ),
                      }}
                    />
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.postPerson}
                    </FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>País</Typography>
                    <Select
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      sx={{ width: "100%" }}
                      name="country"
                      defaultValue={0}
                      value={values.country ?? 0}
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
                    <Typography sx={{ ...TextSmallFont }}>
                      Clasificación
                    </Typography>
                    <Select
                      disabled={disabled || disabledHypertext ||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                      sx={{ width: "100%" }}
                      name="classification"
                      defaultValue={0}
                      value={
                        showContractor
                          ? Constants.folioTitular
                          : values.classification === ""
                          ? 0
                          : values.classification
                      }
                      onChange={handleChange}
                      error={!!errors.classification}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(
                        valuesData?.clasificationCatalog.values ?? []
                      ).map((data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.classification}
                    </FormHelperText>
                  </Stack>
                </Grid>
                {values.classification !== Constants.folioTitular && (
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Titular</Typography>
                      <Autocomplete
                        disabled={disabledHypertext||
                          (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                        noOptionsText="No se encontraron coincidencias"
                        loadingText="Buscando..."
                        options={titular}
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
                {folio == null ? ( //MODIFICAR ENDOSO GENERAL
                  <>
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
                        disabled={disabled || disabledHypertext}
                        size="small"
                        endIcon={<Complete color={ColorPureWhite} />}
                        onClick={() => {
                          setShowContractor(false);
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
                    </Grid>
                  </>
                ) : (
                  <>
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
                        disabled={disabled || disabledHypertext ||
                          (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                        size="small"
                        variant="outlined"
                        onClick={async() => {
                          //Validamos si el tab comenzo con una persona por default
                          if (defaultPerson != null) {
                            await setFields(defaultPerson);
                            setAlertContent("Datos restaurados.");
                          } else {
                            setShowContractor(false);
                            resetForm();
                            setFolio(null);
                          }
                        }}
                      >
                        Cancelar
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
                        disabled={disabledHypertext ||
                          (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                        size="small"
                        type="submit"
                        //endIcon={<Complete color={ColorPureWhite} />}
                      >
                        Actualizar
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Stack>
          </>
        ) : (
          <></>
        )}
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
          getRowId={(row) => row.policiePersonId + ""}
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
          onRowClick={async (e) => {
            //Aqui agregamos los datos del registro seleccionado en los campos del formulario.
            await setFields(e.row).finally(()=>{
              validateForm();
            });
            if (e.row?.policiePersonId) {
              setFolio(e.row.policiePersonId);
            }
          }}
        />

        <Snackbar
          open={alert}
          autoHideDuration={2000}
          onClose={() => setAlert(false)}
        >
          <div>
            <Alert severity="success" sx={{ width: "50%" }}>
              {alertContent}
            </Alert>
          </div>
        </Snackbar>
      </Box>
      {open && (
        <NewContactModal
          open={open}
          policy={policyData.policyFolio}
          person={personFolio}
          close={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export default TabPerson;
