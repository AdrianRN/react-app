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
import { Cancel, Complete, Delete, Edit, Refresh } from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import CompaniesContactService from "../../../../services/companiescontact.service";
import ModelCompaniesContact from "../../../../models/CompaniesContact";
import * as Yup from "yup";
import { useFormik } from "formik";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";

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

    //const isEmailValid = /^[\w.-]+@(chubb\.com|gmail\.com|yahoo\.com|otherdomain\.com)$/i.test(data.email);
    const isEmailValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/i.test(data.email);

    if (!isEmailValid) {
      setDataAlert(true, "Formato de correo no válido.", "error", autoHideDuration);
      return; // Stop the submission if the custom email format check fails
    }

    if (!Yup.string().email().isValidSync(data.email)) {
      setDataAlert(true, "Formato de correo no válido.", "error", autoHideDuration);
      return; 
    }

    if (contact?.contactsId) {
      CompaniesContactService.putFolio(contact.folio, data)
        .then((response: any) => {
          setDataAlert(true, "El Contacto se actualizo con éxito.", "success", autoHideDuration);
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      CompaniesContactService.post(data)
        .then((response: any) => {
          setDataAlert(true, "El Contacto se registró con éxito.", "success", autoHideDuration);
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
          setDataAlert(true, "El contacto ha sido eliminado.", "success", autoHideDuration);
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
      headerName: "Puesto",
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
      field: "department",
      headerName: "Departamento",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.department}</Typography>;
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

  const { handleSubmit, handleChange, errors, values, resetForm } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      alias: Yup.string().required("Este campo es requerido."),
      name: Yup.string().required("Este campo es requerido.").matches(/^[a-zA-ZñÑ\s]+$/, "Solo se permiten letras y espacios."),
      lastName: Yup.string().required("Este campo es requerido.").matches(/^[a-zA-ZñÑ\s]+$/, "Solo se permiten letras y espacios."),
      middleName: Yup.string().required("Este campo es requerido.").matches(/^[a-zA-ZñÑ\s]+$/, "Solo se permiten letras y espacios."),
      email: Yup.string().required("Este campo es requerido.").email("Formato de correo no válido"),
      phone: Yup.string().required("Este campo es requerido.").matches(/^[0-9]+$/, "Solo se permiten números").length(10, "Debe contener exactamente 10 dígitos"),
    }),
    onSubmit,
    enableReinitialize: true,
  });

  const handleTextChange = (e: { target: { name: any; value: any; }; }) => {
    const fieldName = e.target.name;
    let value = e.target.value;

    value = value.replace(/[^a-zA-ZñÑ\s]+/g, '');

    handleChange({
      target: {
        name: fieldName,
        value: value,
      },
    });
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={TextSmallFont}>Puesto</Typography>
                <TextField
                  placeholder="Puesto"
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
                  onChange={handleTextChange}
                  helperText={errors.name}
                  error={!!errors.name}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Apellido Paterno
                </Typography>
                <TextField
                  placeholder="Apellido"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleTextChange}
                  helperText={errors.lastName}
                  error={!!errors.lastName}
                />
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
                  type="text"
                  value={values.middleName}
                  onChange={handleTextChange}
                  helperText={errors.middleName}
                  error={!!errors.middleName}
                />
              </Stack>
            </Grid>
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
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '');
                    const limitedValue = numericValue.slice(0, 10);

                    handleChange({
                      target: {
                        name: 'phone',
                        value: limitedValue,
                      },
                    });
                  }}
                  helperText={errors.phone}
                  error={!!errors.phone}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={1}>
                <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
                  Departamento
                </Typography>
                <TextField
                  placeholder="Departamento"
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  helperText={errors.department}
                  error={!!errors.department}
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
          <Grid container paddingTop={3}>
            <Grid item xs={12} sm={6} md={5} lg={4} xl={3} textAlign='center' container justifyContent="flex-start">
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
