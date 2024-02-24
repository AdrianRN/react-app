import React, { useEffect } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import {
  Button,
  InputAdornment,
  TextField,
} from "../../../OuiComponents/Inputs";
import {
  ColorPink,
  ColorPureWhite,
  LinkSmallFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import {
  Cancel,
  Complete,
  Delete,
  Edit,
  Refresh,
  View,
} from "../../../OuiComponents/Icons";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CompaniesPortalsService from "../../../../services/companiesportals.service";
import ModelCompaniesPortals from "../../../../models/CompaniesPortals";
import * as Yup from "yup";
import { useFormik } from "formik";
import LoginModal from "../../login/loginModal";
import FormatEncrypt from "../../../../utils/Format.Encrypt";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";

function TabPortales(props: any) {
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
  const [companiePortal, setCompaniePortal] =
    React.useState<ModelCompaniesPortals>();
  const [showUserForm, setShowUserForm] = React.useState(false);
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [showRowGrid, setShowRowGrid] = React.useState<string | false>('');
  const [showLoginAuthenticate, setShowLoginAuthenticate] =
    React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      CompaniesPortalsService.getByFolioCompany(props.data)
        .then((response) => response.data)
        .then((json) => setRows(json));

      setLoading(false);
    };

    fetchData();
  }, [loading]);

  const handleClickShowUserForm = () => {
    setShowUserForm((show) => !show);
  };

  const handleClickShowPasswordForm = () => {
    setShowPasswordForm((show) => !show);
  };

  const showRowClickHandler = (params: any) => {
    setShowRowGrid(params.row.folio === showRowGrid ? '' : params.row.folio);
  };

  const editRowClickHandler = (params: any) => {
    const fetchData = async () => {
      const restCompanyPortal = await CompaniesPortalsService.getByFolio(
        params.row.folio
      );
      setCompaniePortal(restCompanyPortal.data);
    };

    fetchData();
  };

  const deleteRowClickHandler = (params: any) => {
    const fetchDelete = async () => {
      CompaniesPortalsService.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(true, "El portal ha sido eliminado.", "success", autoHideDuration);
          setLoading(true);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    };

    fetchDelete();
  };

  const onSubmit = (data: ModelCompaniesPortals) => {
    data.userPortal = FormatEncrypt.encryptString(data.userPortal);
    data.password = FormatEncrypt.encryptString(data.password);

    if (companiePortal?.portalId) {
      CompaniesPortalsService.putFolio(companiePortal.folio, data)
        .then((response: any) => {
          setDataAlert(true, "El portal se actualizó con éxito.", "success", autoHideDuration);
          setLoading(true);
          resetForm();
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      CompaniesPortalsService.post(data)
        .then((response: any) => {
          setDataAlert(true, "El portal se registró con éxito.", "success", autoHideDuration);
          setLoading(true);
          resetForm();
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
      field: "url",
      headerName: "Dirección",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.url}</Typography>;
      },
    },
    {
      field: "userPortal",
      headerName: "Usuario",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Typography>
            {showRowGrid === params.row.folio
              ? FormatEncrypt.decryptString(params.row.userPortal)
              : params.row.userPortal.split("").map(() => "■")}
          </Typography>
        </>
      ),
    },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Typography>
            {showRowGrid === params.row.folio
              ? FormatEncrypt.decryptString(params.row.password)
              : params.row.password.split("").map(() => "■")}
          </Typography>
        </>
      ),
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
                Ver
              </Typography>
            }
          >
            <IconButton onClick={() => showRowClickHandler(params)}>
              <View color={ColorPink} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Editar
              </Typography>
            }
          >
            <IconButton onClick={() => editRowClickHandler(params)}>
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
            <IconButton onClick={() => deleteRowClickHandler(params)}>
              <Delete color={ColorPink} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const initialValues: ModelCompaniesPortals = {
    portalId: companiePortal?.portalId ?? "",
    folio: companiePortal?.folio ?? "",
    companyId: props.data ?? "",
    alias: companiePortal?.alias ?? "",
    url: companiePortal?.url ?? "",
    userPortal: companiePortal?.userPortal
      ? FormatEncrypt.decryptString(companiePortal.userPortal)
      : "" ?? "",
    password: companiePortal?.password
      ? FormatEncrypt.decryptString(companiePortal.password)
      : "" ?? "",
    objectStatusId: companiePortal?.objectStatusId ?? 1,
  };

  const { handleSubmit, handleChange, errors, values, resetForm } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      alias: Yup.string().required("Este campo es requerido."),
      url: Yup.string().required("Este campo es requerido."),
      userPortal: Yup.string().required("Este campo es requerido."),
      password: Yup.string().required("Este campo es requerido."),
    }),
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <>
      {showLoginAuthenticate ? (
        <LoginModal
          open={showLoginAuthenticate}
          close={() => setShowLoginAuthenticate(false)}
        />
      ) : (
        <></>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack display="column" spacing={1}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={1} alignSelf="center">
              <Typography sx={TextSmallFont}>Alias</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Alias"
                name="alias"
                value={values.alias}
                onChange={handleChange}
                helperText={errors.alias}
                error={!!errors.alias}
              />
            </Grid>
            <Grid item xs={12} md={6} />
            <Grid item xs={1} alignSelf="center">
              <Typography sx={TextSmallFont}>Dirección</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Dirección"
                name="url"
                value={values.url}
                onChange={handleChange}
                helperText={errors.url}
                error={!!errors.url}
              />
            </Grid>
            <Grid item xs={12} md={6} />
            <Grid item xs={12} md={1} alignSelf="center">
              <Typography sx={TextSmallFont}>Usuario</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Usuario"
                type={showUserForm ? "text" : "password"}
                name="userPortal"
                value={values.userPortal}
                onChange={handleChange}
                helperText={errors.userPortal}
                error={!!errors.userPortal}
              />
            </Grid>
            <Grid item xs={12} md={1} alignSelf="center">
              <InputAdornment position="end" title="Ver">
                <IconButton onClick={handleClickShowUserForm} edge="end">
                  {showUserForm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            </Grid>
            <Grid item xs={12} md={5} />
            <Grid item xs={12} md={1} alignSelf="center">
              <Typography sx={TextSmallFont}>Password</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPasswordForm ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
              />
            </Grid>
            <Grid item xs={12} md={1} alignSelf="center">
              <InputAdornment position="end" title="Ver">
                <IconButton onClick={handleClickShowPasswordForm} edge="end">
                  {showPasswordForm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            </Grid>
            <Grid item xs={12} md={1} />
            <Grid item xs={12} md={2}>
              <Button
                size="small"
                endIcon={<Refresh color={ColorPureWhite} />}
                onClick={() => {
                  setCompaniePortal(undefined);
                  resetForm();
                }}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                type="submit"
                endIcon={<Complete color={ColorPureWhite} />}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ pt: 5 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.portalId}
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

export default TabPortales;
