import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import User from "../../../../models/User";
import CacheService from "../../../../services/cache.service";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import FormatData from "../../../../utils/Formats.Data";
import ModalFormUserSkeleton from "./ModalFormUsersSkeleton";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import Button from "../../../OuiComponents/Inputs/Button";
import UserService from "../../../../services/user.service";
import {  Dialog,  } from "../../../OuiComponents/Feedback";
import CatalogValue from "../../../../models/CatalogValue";
import Constants from "../../../../utils/Constants";
import IconButton from "@mui/material/IconButton/IconButton";
import DialogContent from "@mui/material/DialogContent/DialogContent";

import Stack from "../../../OuiComponents/Layout/Stack";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Grid from "../../../OuiComponents/Layout/Grid";
import {
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import TextField from "../../../OuiComponents/Inputs/TextField";
import Select from "../../../OuiComponents/Inputs/Select";
import MenuItem from "../../../OuiComponents/Navigation/MenuItem";
import FormHelperText from "@mui/material/FormHelperText/FormHelperText";
import Switch from "../../../OuiComponents/Inputs/Switch";
import Check from "@mui/icons-material/Check";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import { Box } from "@mui/material";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";

interface UserFormData {
  Origins: CacheCatalogValue;
  Groups: CacheCatalogValue;
  User: User;
}

function ModalFormUser(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [valuesData, setValuesData] = React.useState<UserFormData>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setOpen(props.open);

    const fetchData = async () => {
      const restOrigins = await CacheService.getByFolioCatalog(
        Constants.originsCatalogFolio
      );
      const restGroups = await CacheService.getByFolioCatalog(
        Constants.groupsCatalogFolio
      );

      setValuesData({
        Origins: restOrigins.data,
        Groups: restGroups.data,
        User: props.data ? props.data : [],
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const initialValues: User = {
    name: valuesData?.User.name ?? "",
    lastName: valuesData?.User.lastName ?? "",
    maternalLastName: valuesData?.User.maternalLastName ?? "",
    email: valuesData?.User.email ?? "",
    groupId: valuesData?.User.groupId ?? "",
    originId: valuesData?.User.originId ?? "",
    initials: valuesData?.User.initials ?? "",
    signature: valuesData?.User.signature ?? "",
    objectStatusId: valuesData?.User.objectStatusId ?? 1,
    createdAt: FormatData.stringDateFormat(
      valuesData?.User.createdAt ?? new Date().toString()
    ),
    updatedAt: FormatData.stringDateFormat(
      valuesData?.User.updatedAt ?? new Date().toString()
    ),
  };

  const onSubmit = (data: User) => {
    if (props.data) {
      UserService.putByFolio(props.data.folio, data)
        .then((response: any) => {
          setDataAlert(true,"El Usuario se actualizo con éxito.","success",autoHideDuration);
          setTimeout(() => {
            props.close(false);
          }, 1000);
        })
        .catch((e: Error) => {
            setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      UserService.post(data)
        .then((response: any) => {
          setDataAlert(true,"El Usuario se registró con éxito.","success",autoHideDuration);
          setTimeout(() => {
            props.close(false);
          }, 1000);
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
        email: Yup.string().required("Este campo es requerido.").email(),
        originId: Yup.string().required("Este campo es requerido."),
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
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 20,
            top: 8,
          }}
        >
          <Cancel />
        </IconButton>
        <DialogContent>
          <Typography variant="h5" sx={{ ...LinkLargeFont, pl: 3, mt: 2 }}>
            <strong>Edición de usuario</strong>
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack display="column" spacing={1}>
              {loading ? (
                <ModalFormUserSkeleton />
              ) : (
                <Box>
                  <Stack display="column" spacing={1}>
                    <Grid
                      container
                      rowSpacing={3}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Nombre
                          </Typography>
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
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Apellido paterno
                          </Typography>
                          <TextField
                            placeholder="Apellido Paterno"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            helperText={errors.lastName}
                            error={!!errors.lastName}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Apellido materno
                          </Typography>
                          <TextField
                            placeholder="Apellido Materno"
                            name="maternalLastName"
                            value={values.maternalLastName}
                            onChange={handleChange}
                            helperText={errors.maternalLastName}
                            error={!!errors.maternalLastName}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Correo
                          </Typography>
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
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Iniciales
                          </Typography>
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
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Firma
                          </Typography>
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
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha de alta
                          </Typography>
                          <TextField
                            placeholder="Fecha de alta"
                            type="date"
                            value={values.createdAt}
                            disabled
                          />
                        </Stack>
                      </Grid>
                      {values.objectStatusId == 2 ? (
                        <Grid item xs={12} sm={6} md={3.9}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              Fecha de baja
                            </Typography>
                            <TextField
                              placeholder="Fecha de baja"
                              type="date"
                              value={values.updatedAt}
                              disabled
                            />
                          </Stack>
                        </Grid>
                      ) : (
                        <></>
                      )}
                      <Grid item xs={12} sm={6} md={3.9}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Origen
                          </Typography>
                          <Select
                            name="originId"
                            onChange={handleChange}
                            value={values.originId ? values.originId : 0}
                            error={!!errors.originId}
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.Origins.values ?? []).map(
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
                          <Typography sx={{ ...TextSmallFont }}>
                            Estatus
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "ant design" }}
                              name="objectStatusId"
                              value={values.objectStatusId}
                              checked={
                                values.objectStatusId == 2 ? false : true
                              }
                              onChange={(event, checked) => {
                                setFieldValue(
                                  "objectStatusId",
                                  checked ? 1 : 2
                                );
                              }}
                            />
                            <Typography>Activo</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>
              )}
              <Box display="flex">
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ pb: 1 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Check />}
                    size="large"
                    disableElevation
                    sx={{ backgroundColor: "#e5105d" }}
                  >
                    Registrar Usuario
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

export default ModalFormUser;
