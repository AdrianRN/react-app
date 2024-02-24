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
import { GridColDef } from "@mui/x-data-grid";
import { Box, FormHelperText, IconButton } from "@mui/material";
import { Cancel, Complete, Delete, Edit, Refresh } from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import AddressService from "../../../../services/address.service";
import * as Yup from "yup";
import { useFormik } from "formik";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import LocationService from "../../../../services/location.service";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Entidad } from "../../../../models/Entidad";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CacheService from "../../../../services/cache.service";
import Constants from "../../../../utils/Constants";
import CatalogValue from "../../../../models/CatalogValue";

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
  const [municipalities, setMunicipalities] = React.useState<any[]>();
  const [locations, setLocations] = React.useState<any[]>();
  const [states, setStates] = React.useState<Entidad[]>();
  const [countries, setCountries] = React.useState<CacheCatalogValue>();
  const [searchZipCode, setSearchZipCode] = React.useState(false);

  useEffect(() => {
    fetchData();
  }, [loading]);

  const fetchData = async () => {
    const statesCatalogResponse = await LocationService.getStates();
    const countriesCatalogResponse = await CacheService.getByFolioCatalog(
      Constants.countriesCatalogFolio
    );
    const addressResponse = await AddressService.getByFolioCompany(props.data);

    setStates(statesCatalogResponse.data);
    setCountries(countriesCatalogResponse.data);
    setRows(addressResponse.data);

    setLoading(false);
  };

  const handleGetMunicipalities = async (cvE_ENT: number) => {
    LocationService.getMunicipalitiesByStateId(cvE_ENT).then((response) => {
      setMunicipalities(response.data[0].municipalitiesList);
    });
  };

  const handleGetColonies = async (cvE_ENT: number, cvE_MUN: number) => {
    LocationService.getColoniesByStateIdMunicipalityId(cvE_ENT, cvE_MUN).then(
      (response) => {
        setLocations(response.data[0].coloniesList);
      }
    );
  };

  const handleEditAddressClick = (params: any) => {
    LocationService.getMunicipalitiesByStateId(Number(params.row.state))
      .then((response) => {
        setMunicipalities(response.data[0].municipalitiesList);
        LocationService.getColoniesByStateIdMunicipalityId(
          Number(params.row.state),
          Number(params.row.city)
        )
          .then((response) => {
            setLocations(response.data[0].coloniesList);
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
            });
          })
          .catch((e: Error) => {
            setDataAlert(true, e.message, "error", autoHideDuration);
          });
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const handleDeleteAddressClick = (params: any) => {
    const fetchDelete = async () => {
      AddressService.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(
            true,
            "La dirección ha sido eliminada.",
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

  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchZipCode(true);

    let state: number = 0;
    let city: number = 0;

    LocationService.getZipCodeInfo(zipCode)
      .then((response: any) => {
        //Se obtienen los id´s
        state = response.data[0].estadoId;
        city = response.data[0].municipioId;

        //Llenado de colonias
        setLocations(response.data[0].chubbColonies)

        LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            //Llenado de municipios
            setMunicipalities(response.data[0].municipalitiesList)

            //set values form
            setFieldValue('state', state.toString())
            setFieldValue('city', city.toString())
            setFieldValue('country', Constants.folioMexico)

          })
          .catch((e: Error) => {
            setDataAlert(true, "Error, no se encontraron municipios.", "error", autoHideDuration);
            return
          })
          .finally(() => {
            setSearchZipCode(false)
          });
      })
      .catch((e: Error) => {
        setSearchZipCode(false)
        setDataAlert(true, "Error, no existe el CP buscado.", "error", autoHideDuration);
        return
      })
      .catch((e: Error) => {
        setSearchZipCode(false);
        setDataAlert(
          true,
          "No se encontro el estado",
          "error",
          autoHideDuration
        );
        return;
      });
  };

  function onKeyDown(keyEvent: {
    charCode: any;
    keyCode: any;
    preventDefault: () => void;
  }) {
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

  const initialValues = {
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
    personId: "",
    companyId: props.data ?? "",
    objectStatusId: 1,
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik({
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
        .max(5, "El formato es incorrecto"),
    }),
    onSubmit,
    enableReinitialize: false,
  });

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
        <fieldset disabled={searchZipCode} style={{ border: "none" }}>
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
                    type="text"
                    placeholder="Código Postal"
                    name="zip"
                    value={values.zip === 0 ? "" : values.zip}
                    onChange={(e) => {
                      setFieldValue("zip", e.target.value);
                      if (e.target.value.length == 5) {
                        fetchLocationDataByZipCode(e.target.value);
                      } else {
                        setSearchZipCode(false);
                      }
                    }}
                    helperText={errors.zip?.toString()}
                    error={!!errors.zip}
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
                        <MenuItem key={data.folio} value={data.folio}>
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
                    sx={{ width: "100%" }}
                    name="state"
                    defaultValue={0}
                    value={values.state ? values.state : 0}
                    onChange={handleChange}
                    error={!!errors.state}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(states ?? []).map((data: Entidad) => (
                      <MenuItem
                        onClick={() => {
                          setFieldValue("city", "");
                          setFieldValue("colony", "");
                          handleGetMunicipalities(data.cvE_ENT);
                        }}
                        key={data.cvE_ENT}
                        value={data.cvE_ENT.toString()}
                      >
                        {data.noM_ENT}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.state?.toString()}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="column" spacing={1}>
                  <Typography sx={TextSmallFont}>Municipio</Typography>
                  <Select
                    sx={{ width: "100%" }}
                    name="city"
                    value={values.city ? values.city : 0}
                    onChange={handleChange}
                    error={!!errors.city}
                    defaultValue={0}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(municipalities ?? []).map((data: any) => (
                      <MenuItem
                        key={data.municipalityId}
                        value={data.municipalityId.toString()}
                        onClick={() => {
                          setFieldValue("colony", "");
                          handleGetColonies(
                            Number(values.state),
                            data.municipalityId
                          );
                        }}
                      >
                        {data.municipalityName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.city?.toString()}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="column" spacing={1}>
                  <Typography sx={TextSmallFont}>Colonia</Typography>
                  <Select
                    sx={{ width: "100%" }}
                    name="colony"
                    value={values.colony ? values.colony : 0}
                    onChange={handleChange}
                    error={!!errors.colony}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(locations ?? []).map((data: any) => (
                      <MenuItem
                        key={data.colonyId}
                        value={data.colonyId.toString()}
                      >
                        {data.colonyName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.colony?.toString()}
                  </FormHelperText>
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
                    setMunicipalities(undefined);
                    setLocations(undefined);
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
              <DataGrid
                loading={loading}
                rows={rows}
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
            </Box>
            <Grid container paddingTop={3}>
              <Grid
                item
                xs={12}
                sm={6}
                md={5}
                lg={4}
                xl={3}
                textAlign="center"
                container
                justifyContent="flex-start"
              >
                <Button
                  size="small"
                  endIcon={<Cancel color={ColorPureWhite} />}
                  onClick={(e)=>{
                    props.onClose(false);
                  }}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </fieldset>
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
