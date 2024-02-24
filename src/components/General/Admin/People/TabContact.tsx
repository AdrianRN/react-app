import React, { useEffect } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import {
  ColorPink,
  ColorPureWhite,
  LinkSmallFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { Complete, Delete, Edit, Refresh } from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, LinearProgress } from "@mui/material";
import CompaniesContactService from "../../../../services/companiescontact.service";
import ModelCompaniesContact from "../../../../models/CompaniesContact";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";

function TabContact(props: any) {
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
  const [contact, setContact] = React.useState<ModelCompaniesContact>();

  useEffect(() => {
    CompaniesContactService.getByFolioCompany(props.data)
      .then((response) => response.data)
      .then((json) => setRows(json));
    setLoading(false);
  }, [loading]);

  const onSubmit = (data: ModelCompaniesContact) => {
    if (contact?.contactsId) {
      CompaniesContactService.putFolio(contact.folio, data)
        .then((response: any) => {
          setDataAlert(
            true,
            "El Contacto se actualizo con éxito.",
            "success",
            autoHideDuration
          );
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      CompaniesContactService.post(data)
        .then((response: any) => {
          setDataAlert(
            true,
            "El Contacto se registró con éxito.",
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

  const handleEditContactClick = (params: any) => {
    setContact(params.row);
  };

  const handleDeleteContactClick = (params: any) => {
    const fetchDelete = async () => {
      CompaniesContactService.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(
            true,
            "El contacto ha sido eliminada.",
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
      field: "name",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.name}</Typography>;
      },
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.email}</Typography>;
      },
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.phone}</Typography>;
      },
    },
    {
      field: "Acciones",
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
            <IconButton onClick={() => handleEditContactClick(params)}>
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
            <IconButton onClick={() => handleDeleteContactClick(params)}>
              <Delete color={ColorPink} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const initialValues: ModelCompaniesContact = {
    contactsId: contact?.contactsId ?? "",
    folio: contact?.folio ?? "",
    companyId: props.data ?? "",
    alias: contact?.alias ?? "",
    name: contact?.name ?? "",
    lastName: contact?.lastName ?? "",
    middleName: contact?.middleName ?? "",
    department: contact?.department ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    objectStatusId: contact?.objectStatusId ?? 1,
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      alias: Yup.string().required("Este campo es requerido."),
      name: Yup.string().required("Este campo es requerido."),
      lastName: Yup.string().required("Este campo es requerido."),
      middleName: Yup.string().required("Este campo es requerido."),
      email: Yup.string()
        .email("Ingresa un correo electrónico válido")
        .required("Este campo es requerido."),
      phone: Yup.string()
        .required("Este campo es requerido.")
        .matches(/^\d{10}$/, "El número de teléfono debe tener 10 dígitos")
        .max(10, "No se permiten más de 10 dígitos"),
    }),
    onSubmit,
    enableReinitialize: true,
  });

  const handlePhoneChange = (event: any) => {
    // Filtrar solo números y actualizar el valor en Formik
    const phoneValue = event.target.value.replace(/[^\d]/g, "").slice(0, 10);
    handleChange({ target: { name: "phone", value: phoneValue } });
  };
  
  function validateStringFullName(input:string) {
    // Elimina los espacios al principio y al final
    let noSpaces = input.trim();
  
    // Reemplaza múltiples espacios entre palabras por un solo espacio
    noSpaces = noSpaces.replace(/\s+/g, ' ');
  
    // Elimina caracteres que no sean letras
    noSpaces = noSpaces.replace(/[^a-zA-ZñÑ\s]/g, '');
  
    return noSpaces;
  }

  //Validar Nombre
  const [isNameEdition, setIsNameEdition] = React.useState(false);
  React.useEffect(()=>{
    if(values.name!==''&&isNameEdition===true){
      const timerId = setTimeout(()=>{
        setFieldValue('name',validateStringFullName(values.name));
        setIsNameEdition(false);
      },1000);
      return ()=>clearTimeout(timerId);
    }
  },[values.name]);

  //Validar Apellido
  const [isLastNameEdition, setIsLastNameEdition] = React.useState(false);
  React.useEffect(()=>{
    if(values.lastName!==''&&isLastNameEdition===true){
      const timerId = setTimeout(()=>{
        setFieldValue('lastName',validateStringFullName(values.lastName));
        setIsLastNameEdition(false);
      },1000);
      return ()=>clearTimeout(timerId);
    }
  },[values.lastName]);

  //Validar Apellido Materno
  const [isMiddleNameEdition, setIsMiddleNameEdition] = React.useState(false);
  React.useEffect(()=>{
    if(values.middleName!==''&&isMiddleNameEdition===true){
      const timerId = setTimeout(()=>{
        setFieldValue('middleName',validateStringFullName(values.middleName));
        setIsMiddleNameEdition(false);
      },1000);
      return ()=>clearTimeout(timerId);
    }
  },[values.middleName]);
  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Alias</Typography>
                <TextField
                  placeholder="Alias"
                  name="alias"
                  value={values.alias}
                  onChange={handleChange}
                  helperText={errors.alias}
                  error={!!errors.alias}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Nombre
                </Typography>
                <TextField
                  placeholder="Nombre"
                  name="name"
                  value={values.name}
                  onChange={(e) => {
                    const inputValue = e.target.value;//
                    const newValue = inputValue.replace(/[^a-zA-ZñÑ\s]/g, '');
                    setFieldValue("name", newValue);
                    if(isNameEdition===false){
                      setIsNameEdition(true);
                    }
                  }}
                  helperText={errors.name}
                  error={!!errors.name}
                />
                {isNameEdition ? (<>
                  <LinearProgress color="inherit" />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Validando nombre...
                  </Typography>
                </>):(<></>)}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} />
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Apellido Paterno
                </Typography>
                <TextField
                  placeholder="Apellido"
                  name="lastName"
                  value={values.lastName}
                  onChange={(e) => {
                    const inputValue = e.target.value;//
                    const newValue = inputValue.replace(/[^a-zA-ZñÑ\s]/g, '');
                    setFieldValue("lastName", newValue);
                    if(isLastNameEdition===false){
                      setIsLastNameEdition(true);
                    }
                  }}
                  helperText={errors.lastName}
                  error={!!errors.lastName}
                />
                {isLastNameEdition ? (<>
                  <LinearProgress color="inherit" />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Validando Apellido...
                  </Typography>
                </>):(<></>)}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Apellido Materno
                </Typography>
                <TextField
                  placeholder="Apellido materno"
                  name="middleName"
                  value={values.middleName}
                  onChange={(e) => {
                    const inputValue = e.target.value;//
                    const newValue = inputValue.replace(/[^a-zA-ZñÑ\s]/g, '');
                    setFieldValue("middleName", newValue);
                    if(isMiddleNameEdition===false){
                      setIsMiddleNameEdition(true);
                    }
                  }}
                  helperText={errors.middleName}
                  error={!!errors.middleName}
                />
                {isMiddleNameEdition ? (<>
                  <LinearProgress color="inherit" />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Validando Apellido materno...
                  </Typography>
                </>):(<></>)}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} />
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
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
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Teléfono
                </Typography>
                <TextField
                  placeholder="Teléfono"
                  name="phone"
                  value={values.phone}
                  onChange={handlePhoneChange}
                  helperText={errors.phone}
                  error={!!errors.phone}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} lg={2} alignSelf="flex-end">
              <Button
                size="small"
                endIcon={<Refresh color={ColorPureWhite} />}
                onClick={() => {
                  setContact(undefined);
                  resetForm();
                }}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} lg={2} alignSelf="flex-end">
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
              columns={columns}
              getRowId={(row) => row.contactsId}
              disableRowSelectionOnClick
            />
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

export default TabContact;
