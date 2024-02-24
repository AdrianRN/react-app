import { useFormik } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import CatalogValue from "../../../../models/CatalogValue";
import People from "../../../../models/People";
import PeopleDataService from "../../../../services/people.service";
import FormatData from "../../../../utils/Formats.Data";
import Button from "../../../OuiComponents/Inputs/Button";
import { Breadcrumbs, MenuItem } from "../../../OuiComponents/Navigation";
import ModalFormUserSkeleton from "../Users/ModalFormUsersSkeleton";
import { AlertColor, Box, DialogContent, FormHelperText, IconButton } from "@mui/material";
import Dialog from "../../../OuiComponents/Feedback/Dialog";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import Stack from "../../../OuiComponents/Layout/Stack";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Grid from "../../../OuiComponents/Layout/Grid";
import Select from "../../../OuiComponents/Inputs/Select";
import { LinkLargeFont, TextSmallFont } from "../../../OuiComponents/Theme";
import Check from "@mui/icons-material/Check";
import Switch from "../../../OuiComponents/Inputs/Switch";
import TextField from "../../../OuiComponents/Inputs/TextField";
import catalogValueService from "../../../../services/catalogvalue.service";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import Constants from "../../../../utils/Constants";



interface UserFormData {
  Origins: CatalogValue;
  Groups: CatalogValue;
  Nationalities: CatalogValue;
  Genders: CatalogValue;
  TypesPerson: CatalogValue;
  People: People;
}

function CreatePerson(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [personId, setPersonId] = React.useState('');
  const [valuesData, setValuesData] = React.useState<UserFormData>();
  //const { personId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [newUser, setNewUser] = React.useState(true);

  React.useEffect(() => {
    setOpen(props.open)
    setPersonId(props.personId)
    const fetchData = async () => {
      const restOrigins = await catalogValueService.getCatalogValueById(
        Constants.originsCatalogFolio
      );
      const restGroups = await catalogValueService.getCatalogValueByCatalogId(
        Constants.groupsCatalogFolio
      );
      const restNationalities = await catalogValueService.getCatalogValueByCatalogId(
        Constants.nationalitiesCatalogFolio
      );
      const restGenders = await catalogValueService.getCatalogValueByCatalogId(
        Constants.gendersCatalogFolio
      );
      const restTypePerson = await catalogValueService.getCatalogValueByCatalogId(
        Constants.typePersonCatalogFolio
      );

      if (props.personId && props.personId != '') {
        try {
          setNewUser(false);

          const peopleDataResponse = await PeopleDataService.getById(
            props.personId ?? ""
          );
          const peopleData = peopleDataResponse.data;

          if (peopleData == null) return;
          setValuesData({
            Origins: restOrigins.data,
            Groups: restGroups.data,
            Nationalities: restNationalities.data,
            Genders: restGenders.data,
            TypesPerson: restTypePerson.data,
            People: peopleData,
          });
        } catch (error) {
          console.error("Error fetching person data:", error);
        }
      } else {
        setValuesData({
          Origins: restOrigins.data,
          Groups: restGroups.data,
          Nationalities: restNationalities.data,
          Genders: restGenders.data,
          TypesPerson: restTypePerson.data,
          People: initialValues,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const initialValues: People = {
    sector: "",
    folio: valuesData?.People.folio ?? "",
    name: valuesData?.People.name ?? "",
    lastName: valuesData?.People.lastName ?? "",
    maternalLastName: valuesData?.People.maternalLastName ?? "",
    rfc: valuesData?.People.rfc ?? "",
    curp: valuesData?.People.curp ?? "",
    birthPlace: valuesData?.People.birthPlace ?? 0,
    birthDay: valuesData?.People.birthDay
      ? `${new Date(valuesData.People.birthDay).toISOString().split("T")[0]}`
      : FormatData.dateFormat(new Date()).toString(),
    genderId: valuesData?.People.genderId ?? "1",
    email: valuesData?.People.email ?? "",
    password: valuesData?.People.password ?? "",
    groupId: valuesData?.People.groupId ?? "",
    originId: valuesData?.People.originId ?? "",
    financialProfile: valuesData?.People.financialProfile ?? 1,
    paymentTerm: valuesData?.People.paymentTerm ?? true,
    vip: valuesData?.People.vip ?? true,
    politicallyExposed: valuesData?.People.politicallyExposed ?? true,
    nationality: valuesData?.People.nationality ?? "",
    nationalities: {
      description: valuesData?.People?.nationalities?.description ?? "",
    },
    collectionReminde: valuesData?.People.collectionReminde ?? true,
    initials: valuesData?.People.initials ?? "",
    signature: valuesData?.People.signature ?? "",
    profileId: valuesData?.People.profileId ?? "1",
    objectStatusId: valuesData?.People.objectStatusId ?? 1,
    taskss: valuesData?.People.taskss ?? [],
    //companies: valuesData?.People.companies ?? [],
    message: valuesData?.People.message ?? [],
    address: valuesData?.People.address ?? [],
    typePersonId: valuesData?.People.typePersonId ?? "",
    companyId: "",
    isSeller: valuesData?.People.isSeller ?? false,
    healt: valuesData?.People.healt ?? 0,
    branch: valuesData?.People.branch ?? "",
    leader: valuesData?.People.leader ?? false,
    bondsExecutive: valuesData?.People.bondsExecutive ?? false,
    commissionSeller: valuesData?.People.commissionSeller ?? undefined,
    isBeneficiary: valuesData?.People.isBeneficiary ?? false,
  };

  const onSubmit = (data: People) => {
    if (personId && personId != '') {
      PeopleDataService.putFolio(personId, data)
        .then((response: any) => {
          if (response.message == "OK") {            
            setDataAlert(true,"La persona se ha actualizado con éxito.","success",autoHideDuration);
          } else {
            setDataAlert(true, response.message, "error", autoHideDuration);
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      PeopleDataService.post(data)
        .then((response: any) => {
          if (response.message == "OK") {
            setDataAlert(true,"La persona se registró con éxito.","success",autoHideDuration);
          } else {
            setDataAlert(true, response.message, "error", autoHideDuration);
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        name: Yup.string().required("Este campo es requerido."),
        lastName: Yup.string().required("Este campo es requerido."),
        maternalLastName: Yup.string().required("Este campo es requerido."),
        birthDay: Yup.string().required("Este campo es requerido."),
        genderId: Yup.string().required("Este campo es requerido."),
        email: Yup.string().required("Este campo es requerido.").email(),
        originId: Yup.string().required("Este campo es requerido."),
        paymentTerm: Yup.boolean().required("Este campo es requerido."),
        vip: Yup.boolean().required("Este campo es requerido."),
        politicallyExposed: Yup.boolean().required("Este campo es requerido."),
        nationality: Yup.string().required("Este campo es requerido."),
        collectionReminde: Yup.boolean().required("Este campo es requerido."),
        initials: Yup.string().required("Este campo es requerido."),
        signature: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });

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
        open={open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth='md'
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >

      <IconButton
        onClick={props.close}
        sx={{
          position: 'absolute',
          right: 20,
          top: 8
        }}
      >
          <Cancel />
      </IconButton>
      <DialogContent>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack display="column" spacing={1}>
          <Box display="flex">
            <Typography sx={{ ...LinkLargeFont,pl:4,mt:2,flexGrow: 1 }} variant="h5">
              <strong>
                {personId ? "Edición de persona" : "Registro de persona"}
              </strong>
            </Typography>
          </Box>
          {loading ? (
            <ModalFormUserSkeleton />
          ) : (
            <Box sx={{ pr: 6, pl: 2, pt: 2, pb: 2 }}>
              <Stack display="column" spacing={1}>
                <Grid item xs={12} sm={6} md={4} sx={{ pl: 3}}>
                  <Stack direction="column" spacing={1}>
                    <Typography sx={{ ...TextSmallFont }}>Tipo de Persona</Typography>
                    <Select
                      name="typePersonId"
                      onChange={handleChange}
                      value={values.typePersonId}
                      error={!!errors.typePersonId}
                    >
                      <MenuItem key={0} value={0} disabled>Selecciona</MenuItem>
                      {Object(valuesData?.TypesPerson ?? []).map(
                        (data: CatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.originId}
                    </FormHelperText>

                  </Stack>
                </Grid>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Nombre</Typography>
                      <TextField
                        placeholder="Nombre"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        helperText={errors.name}
                        error={!!errors.name}
                      />
                    </Stack>
                  </Grid>
                  { values.typePersonId !== Constants.folioMoralPerson && (
                    <>
                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Apellido Paterno</Typography>
                          <TextField
                            placeholder="Apellido paterno"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            helperText={errors.lastName}
                            error={!!errors.lastName}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Apellido Materno</Typography>
                          <TextField
                            placeholder="Apellido materno"
                            name="maternalLastName"
                            value={values.maternalLastName}
                            onChange={handleChange}
                            helperText={errors.maternalLastName}
                            error={!!errors.maternalLastName}
                          />
                        </Stack>
                      </Grid>
                    </>
                  )}

                  {/* si no es persona moral agrgar esto aqui */}
                  <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Fecha de nacimiento</Typography>
                          <TextField
                            name="birthDay"
                            value={values.birthDay}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.birthDay}
                            error={!!errors.birthDay}
                          />
                        </Stack>
                      </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Correo</Typography>
                      <TextField
                        placeholder="Correo"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        helperText={errors.email}
                        error={!!errors.email}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Iniciales</Typography>
                      <TextField
                        placeholder="Iniciales"
                        name="initials"
                        value={values.initials}
                        onChange={handleChange}
                        helperText={errors.initials}
                        error={!!errors.initials}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Firma</Typography>
                      <TextField
                        placeholder="Firma"
                        name="signature"
                        value={values.signature}
                        onChange={handleChange}
                        helperText={errors.signature}
                        error={!!errors.signature}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Grupo económico</Typography>
                      <Select
                        name="groupId"
                        onChange={handleChange}
                        value={values.groupId}
                        error={!!errors.groupId}
                      >
                        {Object(valuesData?.Groups ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.groupId}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Origen</Typography>
                      <Select
                        name="originId"
                        onChange={handleChange}
                        value={values.originId}
                        error={!!errors.originId}
                      >
                        {Object(valuesData?.Origins ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.originId}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                      <TextField
                        placeholder="RFC"
                        name="rfc"
                        value={values.rfc}
                        onChange={handleChange}
                        helperText={errors.rfc}
                        error={!!errors.rfc}
                      />
                    </Stack>
                  </Grid>
                  
                  { values.typePersonId !== Constants.folioMoralPerson && (
                    <>
                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>CURP</Typography>
                          <TextField
                            placeholder="CURP"
                            name="curp"
                            value={values.curp}
                            onChange={handleChange}
                            helperText={errors.curp}
                            error={!!errors.curp}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Género</Typography>
                          <Select
                            name="genderId"
                            onChange={handleChange}
                            value={values.genderId}
                            error={!!errors.genderId}
                          >
                            {Object(valuesData?.Genders ?? []).map(
                              (data: CatalogValue) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.genderId}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Nacionalidad</Typography>
                      <Select
                        name="nationality"
                        value={values.nationality}
                        onChange={handleChange}
                        error={!!errors.nationality}
                      >
                        {Object(valuesData?.Nationalities ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Término de pago</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{ "aria-label": "Término de Pago" }}
                          name="paymentTerm"
                          checked={values.paymentTerm}
                          onChange={(event, checked) => {
                            setFieldValue("paymentTerm", checked);
                          }}
                        />
                        <Typography>
                          {values.paymentTerm ? "Sí" : "No"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>VIP</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{ "aria-label": "VIP" }}
                          name="vip"
                          checked={values.vip}
                          onChange={(event, checked) => {
                            setFieldValue("vip", checked);
                          }}
                        />
                        <Typography>{values.vip ? "Sí" : "No"}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Políticamente expuesto</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{
                            "aria-label": "Políticamente expuesto",
                          }}
                          name="politicallyExposed"
                          checked={values.politicallyExposed}
                          onChange={(event, checked) => {
                            setFieldValue("politicallyExposed", checked);
                          }}
                        />
                        <Typography>
                          {values.politicallyExposed ? "Sí" : "No"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Recordatorio de cobranza</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{
                            "aria-label": "Recordatorio de Cobranza",
                          }}
                          name="collectionReminde"
                          checked={values.collectionReminde}
                          onChange={(event, checked) => {
                            setFieldValue("collectionReminde", checked);
                          }}
                        />
                        <Typography>
                          {values.collectionReminde ? "Sí" : "No"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Es vendedor?</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{ "aria-label": "isSeller" }}
                          name="isSeller"
                          checked={values.isSeller}
                          onChange={(event, checked) => {
                            setFieldValue("isSeller", checked);
                          }}
                        />
                        <Typography>{values.isSeller ? "Sí" : "No"}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          )}
          <Box display="flex">
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box sx={{ flexGrow: 0, pb: 2,mt:2 }}>
              <Button
                variant="contained"
                type="submit"
                endIcon={<Check />}
                size="large"
                disableElevation
                sx={{ backgroundColor: "#e5105d" }}
              >
                {personId ? "Actualizar Persona" : "Registrar Persona"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
      </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePerson;
