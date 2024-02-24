import React, { useEffect } from "react";
import { Grid, Stack } from "../../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../../OuiComponents/DataDisplay";
import { Button, TextField } from "../../../../OuiComponents/Inputs";
import {
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../../OuiComponents/Theme";
import { Complete, Delete, Edit, Refresh } from "../../../../OuiComponents/Icons";
import { DataGrid } from "../../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { Box, DialogContent, IconButton } from "@mui/material";
import CompaniesContactService from "../../../../../services/companiescontact.service";
import ModelCompaniesContact from "../../../../../models/CompaniesContact";
import * as Yup from "yup";
import { useFormik } from "formik";
import MessageBar from "../../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../../context/alert-context";
import { Dialog } from "../../../../OuiComponents/Feedback";
import { Cancel } from "../../../../OuiComponents/Icons";
import PoliciyService from "../../../../../insuranceServices/policies.service";

export default function NewContactModal(props: any) {
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [alertContent, setAlertContent] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);

  useEffect(() => {

    setOpen(props.open);
    fetchData();
    setLoading(false);
  }, [loading]);

  const fetchData = async () => {
    await PoliciyService.getPoliciesByPersonContact(props.policy, props.person)
        .then(response => setRows(response.data ?? []))
}

  const onSubmit = async(data: ModelCompaniesContact) => {
    if (contact?.folio) {
        await PoliciyService.putPoliciesPersonContact(props.policy, props.person, data)
        .then(response => {
            setAlertContent("La persona se actualizó con éxito.");
            setAlert(true);
            fetchData()
        })
        .catch((e: Error) => {
            setAlertContent(e.message);
            setAlert(true);
        });
    } else {
        await PoliciyService.PostPoliciesPersonContact(props.policy, props.person, [data])
        .then(response => {
            setAlertContent("La persona se registró con éxito.");
            setAlert(true);
            fetchData()
        })
        .catch((e: Error) => {
                setAlertContent(e.message);
                setAlert(true);
            });
    }

    setContact(undefined)

  };

  const handleEditContactClick = (params: any) => {
    setEdit(true)
    setContact(params.row);
  };

  const handleDeleteContactClick = (params: any) => {
    const fetchDelete = async () => {
        await PoliciyService.deletePolicyPersonContac(props.policy, props.person, params.row.folio)
            .then((response: any) => {
                setAlertContent("El contacto ha sido eliminado.");
                setAlert(true);
                fetchData();
            })
            .catch((e: Error) => {
                setAlertContent(e.message);
                setAlert(true);
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

  const { handleSubmit, handleChange, errors, values, resetForm } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      alias: Yup.string().required("Este campo es requerido."),
      name: Yup.string().required("Este campo es requerido."),
      lastName: Yup.string().required("Este campo es requerido."),
      middleName: Yup.string().required("Este campo es requerido."),
      email: Yup.string().required("Este campo es requerido."),
      phone: Yup.string().required("Este campo es requerido."),
    }),
    onSubmit,
    enableReinitialize: true,
  });

    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="modal-modal-title"
                fullWidth
                maxWidth='lg'
                PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
            >
                <IconButton
                    onClick={props.close}
                    sx={{
                        position: 'absolute',
                        right: 25,
                        top: 8
                    }}
                >
                    <Cancel />
                </IconButton>
                <DialogContent>
                  <Typography sx={{ ...LinkLargeFont }}>Contactos</Typography>
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
                                            onChange={handleChange}
                                            helperText={errors.name}
                                            error={!!errors.name}
                                        />
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
                                            onChange={handleChange}
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
                                            value={values.middleName}
                                            onChange={handleChange}
                                            helperText={errors.middleName}
                                            error={!!errors.middleName}
                                        />
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
                                            onChange={handleChange}
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
                                    getRowId={(row) => row.folio}
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
                </DialogContent >
            </Dialog >
        </>
    );
}