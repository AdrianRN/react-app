import React, { useEffect } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { Button, Select, TextField } from "../../../OuiComponents/Inputs";
import {
  GridColDef
} from "@mui/x-data-grid";
import { Box, FormHelperText, IconButton } from "@mui/material";
import { Complete, Delete, Edit, Refresh } from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import AddressService from "../../../../services/address.service";
import ModelAddress from "../../../../models/Address";
import * as Yup from "yup";
import { useFormik } from "formik";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import LocationService from "../../../../services/location.service";
import { Entidad } from "../../../../models/Entidad";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Colony } from "../../../../models/Colony";
import CacheService from "../../../../services/cache.service";
import Constants from "../../../../utils/Constants";
import CatalogValue from "../../../../models/CatalogValue";
import { CircularProgress } from "../../../OuiComponents/Feedback";

interface PersonFormData {
  State: string,
  ZipCode: number,
  City: string,
}

interface ChubbColonies {
  id: string,
  descripcion: string
}

function TabAddress(props: any) {
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
  const [searchByZip, setSearchByzIP] = React.useState(false);
  const [countries, setCountries] = React.useState<CacheCatalogValue>();
  const [states, setStates] = React.useState<Entidad[]>();
  const [cities, setCities] = React.useState<any[]>();
  const [colonies, setColonies] = React.useState<any[]>();

  useEffect(() => {
    fetchData()
  }, [loading]);

  const fetchData = async () => {
    const countriesCatalogResponse = await CacheService.getByFolioCatalog(Constants.countriesCatalogFolio)
    const addressResponse = await AddressService.getByFolioPerson(props.data)

    setCountries(countriesCatalogResponse.data)
    setRows(addressResponse.data)
    handleEntities()

    setLoading(false)
  };

  const handleEntities = async () => {
    const restEntities = await LocationService.getStates()
    setStates(restEntities.data)
  }

  const handleCitiesByStateName = async (folio: number) => {
    LocationService.getMunicipalitiesByStateId(folio).then((response) => {
      setCities(response.data[0].municipalitiesList)
    })
  }

  const handleColonies = async (stateFolio: number, cityFolio: number) => {
    console.log(stateFolio, cityFolio)
    LocationService.getColoniesByStateIdMunicipalityId(stateFolio, cityFolio).then((response) => {
      setColonies(response.data[0].coloniesList)
    })
  }

  const handleEditAddressClick = (params: any) => {
    LocationService.getMunicipalitiesByStateId(Number(params.row.state))
      .then((response) => {
        setCities(response.data[0].municipalitiesList)
        LocationService.getColoniesByStateIdMunicipalityId(Number(params.row.state), Number(params.row.city))
          .then((response) => {
            setColonies(response.data[0].coloniesList)
            setValues({
              folio: params.row.folio,
              alias: params.row.alias,
              street: params.row.street,
              numberIn: params.row.numberIn,
              numberOut: params.row.numberOut,
              colony: params.row.colony,
              city: params.row.city,
              state: params.row.state,
              country: params.row.country,
              zip: params.row.zip,
              personId: params.row.personId,
              companyId: props.data,
              objectStatusId: params.row.objectStatusId,
            })
          })
          .catch((e: Error) => {
            setDataAlert(true, e.message, "error", autoHideDuration);
          })
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      })
  };

  const handleDeleteAddressClick = (params: any) => {
    const fetchDelete = async () => {
      AddressService.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(true, "La dirección ha sido eliminada.", "success", autoHideDuration)
          setLoading(true)
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration)
        })
    }

    fetchDelete();
  };

  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchByzIP(true)
    let state: number = 0;
    let city: number = 0;

    LocationService.getZipCodeInfo(zipCode)
      .then((response: any) => {
        //Se obtienen los id´s
        state = response.data[0].estadoId
        city = response.data[0].municipioId;

        //Llenado de colonias
        setColonies(response.data[0].chubbColonies)

        LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            //Llenado de municipios
            setCities(response.data[0].municipalitiesList)

            //set values form
            setFieldValue('state', state.toString())
            setFieldValue('city', city.toString())
            setFieldValue('country', Constants.folioMexico)

          })
          .catch((e: Error) => {
            setDataAlert(true, "Error, no se encontraron municipios.", "error", autoHideDuration);
          })
          .finally(() => {
            setSearchByzIP(false)
          });
      })
      .catch((e: Error) => {
        setSearchByzIP(false)
        setDataAlert(true, "Error, no existe el CP buscado.", "error", autoHideDuration);
      })
  }

  function onKeyDown(keyEvent: { charCode: any; keyCode: any; preventDefault: () => void; }) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const onSubmit = (data: any) => {
    if (data.folio) {
      AddressService.putFolio(data.folio, data)
        .then((response: any) => {
          setDataAlert(
            true,
            "La dirección se actualizo con éxito.",
            "success",
            autoHideDuration
          );
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      AddressService.post(data)
        .then((response: any) => {
          setDataAlert(
            true,
            "La dirección se registró con éxito.",
            "success",
            autoHideDuration
          );
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "alias",
      headerName: "Alias",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.alias}</Typography>;
      },
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
                Editar
              </Typography>
            }
          >
            <IconButton onClick={() => handleEditAddressClick(params)}>
              <Edit color={ColorPink} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Eliminar
              </Typography>
            }
          >
            <IconButton onClick={() => handleDeleteAddressClick(params)}>
              <Delete color={ColorPink} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const initialValues: any = {
    folio: "",
    alias: "",
    street: "",
    numberIn: "",
    numberOut: "",
    colony: "",
    city: "",
    state: "",
    country: "",
    zip: 0,
    personId: props.data ?? "",
    companyId: "",
    objectStatusId: 1
  };

  const { handleSubmit, handleChange, errors, values, resetForm, setFieldValue, setValues } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      alias: Yup.string().required("Este campo es requerido."),
      street: Yup.string().required("Este campo es requerido."),
      numberOut: Yup.string().required("Este campo es requerido."),
      colony: Yup.string().required("Este campo es requerido."),
      city: Yup.string().required("Este campo es requerido."),
      state: Yup.string().required("Este campo es requerido."),
      country: Yup.string().required("Este campo es requerido."),
      zip: Yup.string()
        .required("Este campo es requerido.")
        .min(5, "El formato es incorrecto")
        .max(5, "El formato es incorrecto")
    }),
    onSubmit,
    enableReinitialize: false,
  });

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
        <Stack display="column" spacing={1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Alias</Typography>
                <TextField
                  placeholder="Alias"
                  name="alias"
                  value={values.alias}
                  onChange={handleChange}
                  helperText={errors.alias?.toString()}
                  error={!!errors.alias}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Código postal</Typography>
                <TextField
                  placeholder="Código Postal"
                  name="zip"
                  value={values.zip === 0 ? "" : values.zip}
                  onChange={(e) => {
                    setFieldValue('zip', e.target.value);
                    if ((e.target.value).length == 5) {
                      fetchLocationDataByZipCode(e.target.value)
                    } else {
                      setSearchByzIP(false)
                    }
                  }
                  }
                  helperText={errors.zip?.toString()}
                  error={!!errors.zip}
                  InputProps={{
                    readOnly: searchByZip,
                    endAdornment: (
                      <React.Fragment>
                        {searchByZip ? <CircularProgress sx={{ color: "#E5105D" }} size={20} /> : null}
                      </React.Fragment>
                    ),
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>País</Typography>
                <Select
                  sx={{ width: "100%" }}
                  name="country"
                  onChange={handleChange}
                  defaultValue={0}
                  value={values.country ? values.country : 0}
                  error={!!errors.country}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(countries?.values ?? []).map(
                    (data: CatalogValue) => (
                      <MenuItem
                        key={data.folio}
                        value={data.folio}>
                        {data.description}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: "#d22e2e" }}>
                  {errors.country?.toString()}
                </FormHelperText>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Estado</Typography>
                <Select
                  name="state"
                  onChange={handleChange}
                  defaultValue={0}
                  value={values.state ? values?.state : 0}
                  error={!!errors.state}
                  sx={{ width: "100%" }}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(states ?? []).map(
                    (data: Entidad) => (
                      <MenuItem
                        key={data.cvE_ENT}
                        value={data.cvE_ENT.toString()}
                        onClick={() => {
                          setFieldValue('city', "");
                          setFieldValue('colony', "");
                          handleCitiesByStateName(data.cvE_ENT)
                        }}
                      >
                        {data.noM_ENT}
                      </MenuItem>
                    )
                  )}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Municipio</Typography>
                <Select
                  name="city"
                  onChange={handleChange}
                  defaultValue={0}
                  value={values.city ? values.city : 0}
                  error={!!errors.city}
                  sx={{ width: "100%" }}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(cities ?? []).map(
                    (data: any) => (
                      <MenuItem
                        key={data.municipalityId}
                        value={data.municipalityId.toString()}
                        onClick={() => {
                          setFieldValue("colony", "");
                          handleColonies(Number(values.state), data.municipalityId)
                        }}
                      >
                        {data.municipalityName}
                      </MenuItem>
                    )
                  )}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Colonia</Typography>
                <Select
                  name="colony"
                  onChange={handleChange}
                  defaultValue={0}
                  value={values.colony ? values.colony : 0}
                  error={!!errors.colony}
                  sx={{ width: "100%" }}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {Object(colonies ?? []).map(
                    (data: any) => (
                      <MenuItem
                        key={data.colonyId}
                        value={data.colonyId.toString()}
                      >
                        {data.colonyName}
                      </MenuItem>
                    ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Calle</Typography>
                <TextField
                  placeholder="Calle"
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  helperText={errors.street?.toString()}
                  error={!!errors.street}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Núm ext.</Typography>
                <TextField
                  placeholder="No ext."
                  name="numberOut"
                  value={values.numberOut}
                  onChange={handleChange}
                  helperText={errors.numberOut?.toString()}
                  error={!!errors.numberOut}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Núm int.</Typography>
                <TextField
                  placeholder="No int."
                  name="numberIn"
                  value={values.numberIn}
                  onChange={handleChange}
                  helperText={errors.numberIn?.toString()}
                  error={!!errors.numberIn}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container paddingTop={2} columnSpacing={{ xs: 1 }}>
            <Grid item xs={12} sm={4} />
            <Grid item xs={12} sm={4} />
            <Grid item xs={12} sm={2} alignSelf="flex-end">
              <Button
                size="small"
                endIcon={<Refresh color={ColorPureWhite} />}
                onClick={() => {
                  setCities(undefined);
                  setColonies(undefined);
                  resetForm();
                }}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} sm={2} alignSelf="flex-end">
              <Button
                type="submit"
                size="small"
                endIcon={<Complete color={ColorPureWhite} />}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ pt: 5 }}>
            {rows ? (
              <DataGrid
                loading={loading}
                rows={rows ?? []}
                autoHeight
                columns={columns}
                getRowId={(row) => row.addressId}
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

export default TabAddress;
