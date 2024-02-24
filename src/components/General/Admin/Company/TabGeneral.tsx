import React, { useEffect } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Avatar, Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import {
  Button,
  InputAdornment,
  Select,
  Switch,
  TextField,
} from "../../../OuiComponents/Inputs";
import {
  Cancel,
  Complete,
  Document,
  Upload,
} from "../../../OuiComponents/Icons";
import { Box, FormHelperText, IconButton } from "@mui/material";
import CompaniesService from "../../../../services/companies.service";
import ModelCompany from "../../../../models/Company";
import catalogValueService from "../../../../services/catalogvalue.service";
import CatalogValue from "../../../../models/CatalogValue";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MenuItem } from "../../../OuiComponents/Navigation";
import Constants from "../../../../utils/Constants";
import FormatData from "../../../../utils/Formats.Data";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";

interface GeneralCompanyFormData {
  CatalogCompanyType: CatalogValue;
  CatalogProrating: CatalogValue;
  Company: ModelCompany;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          const newValue = values.floatValue !== undefined ? values.floatValue : 0;
          const clampedValue = Math.min(100, newValue);
          onChange({
            target: {
              name: props.name,
              value: clampedValue.toString(),
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

function TabGeneral(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [image, setImage] = React.useState<string | null>(null);
  const [valuesData, setValuesData] = React.useState<GeneralCompanyFormData>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const restCompany = props.data
      ? await CompaniesService.getByFolio(props.data)
      : undefined;
    const restCompanyType =
      await catalogValueService.getCatalogValueByCatalogId(
        Constants.companyTypeCatalogFolio
      );
    const restCompanyProrating =
      await catalogValueService.getCatalogValueByCatalogId(
        Constants.prorratingCatalogFolio
      );

    setValuesData({
      CatalogCompanyType: restCompanyType.data,
      CatalogProrating: restCompanyProrating.data,
      Company: restCompany ? restCompany.data : restCompany,
    });
    if(restCompany?.data?.logo)
      setImage(
        restCompany
          ? FormatData.getUriLogoCompany(restCompany.data.logo ?? "")
          : ""
      );
    else
      setImage("");
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setBase64(file);
      setImage(URL.createObjectURL(file));
      setFieldValue("logo.fileExtension", file.type.toString().split("/")[1]);
      setFieldValue("logo.name", "");
      setFieldValue("logo.containerName", Constants.companyContainerName);
    }
  };

  const setBase64 = (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const readerSplit = reader.result?.toString().split(",")[1] ?? null;
        setFieldValue("logo.base64Content", readerSplit);
      };
    }
  };

  const onSubmit = async (data: any) => {
    if (props.data) {
      if (data.logo) {
        await CompaniesService.putFolio(props.data, data)
          .then((response: any) => {
            setDataAlert(
              true,
              "La Compañía se actualizó con éxito.",
              "success",
              autoHideDuration
            );
            props.onTabContacts(null,1);
          })
          .catch((e: any) => {
            let message: string = e.response.data.error.message ?? e.message;
            if(message.includes('already exists')){
              message='El número de compañía ya existe. Favor de validarlo.'
            }
            setDataAlert(true, message, "error", autoHideDuration);
          });
      } else {
        await CompaniesService.patch(props.data, data)
          .then((response: any) => {
            setDataAlert(
              true,
              "La Compañía se actualizó con éxito.",
              "success",
              autoHideDuration
            );
            props.onTabContacts(null,1);
          })
          .catch((e: any) => {
            let message: string = e.response.data.error.message ?? e.message;
            if(message.includes('already exists')){
              message='El número de compañía ya existe. Favor de validarlo.'
            }
            setDataAlert(true, message, "error", autoHideDuration);
          });
      }
    } else {
      if (!data.logo) {
        data.logo = null; // Establecer logo como null si no hay imagen
      }

      await CompaniesService.post(data)
        .then((response: any) => {
          setDataAlert(
            true,
            "La Compañía se registró con éxito.",
            "success",
            autoHideDuration
          );
          props.onDataChange({folio:response?.data?.folio, type:response?.data?.companyTypeId===Constants.folioSuretyCompany
            ?Constants.typeSuretyCompany:Constants.typeInsuranceCompany});
          props.onTabContacts(null,1);
        })
        .catch((e: any) => {
          let message: string = e.response.data.error.message ?? e.message;
            if(message.includes('already exists')){
              message='El número de compañía ya existe. Favor de validarlo.'
            }
            setDataAlert(true, message, "error", autoHideDuration);
        });
    }
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

  const initialValues = {
    companyTypeId: valuesData?.Company ? valuesData?.Company.companyTypeId : "",
    corporateName: valuesData?.Company ? valuesData?.Company.corporateName : "",
    abbreviation: valuesData?.Company ? valuesData?.Company.abbreviation : "",
    statusId: "",
    proratingId: valuesData?.Company ? valuesData?.Company.proratingId : "",
    financing: valuesData?.Company ? valuesData?.Company.financing : 0,
    maturities: valuesData?.Company ? valuesData?.Company.maturities : "",
    agent: valuesData?.Company ? valuesData?.Company.agent : "",
    companyNumber: valuesData?.Company?.companyNumber ?? '',
    commissions: valuesData?.Company ? valuesData?.Company.commissions : '0',
    logo: null,
    objectStatusId: valuesData?.Company
      ? valuesData?.Company.objectStatusId
      : 1,
    surcharge: 0,
    issuingCost: 0,
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue,submitForm } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        corporateName: Yup.string().required("Este campo es requerido."),
        abbreviation: Yup.string().required("Este campo es requerido."),
        //proratingId: Yup.string().required("Este campo es requerido."),
       // financing: Yup.number().required("Este campo es requerido.").min(1, "Debe ser al menos 1.").max(100, "No puede ser mayor a 100."),
        agent: Yup.string().required("Este campo es requerido."),
        //commissions: Yup.number().required("Este campo es requerido.").min(1, "Debe ser al menos 1.").max(100, "No puede ser mayor al 100."),
        companyNumber: Yup.string().required("Este campo es requerido."),
        companyTypeId: Yup.string().required("Este campo es requerido."),
        surcharge: Yup.string().required("Este campo es requerido."),
        issuingCost: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });

  return (
    <>
      <Box
        component="form"
        maxWidth="auto"
        onSubmit={handleSubmit}
        onKeyDown={onKeyDown}
      >
        <Stack direction="column">
          <Stack direction="row" display="flex" spacing={1}>
            <Grid
              container
              flexGrow={1}
              flexBasis={0}
              rowSpacing={1}
              columnSpacing={{ xs: 1 }}
            >
              <Grid item xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Tipo compañía
                  </Typography>
                  <Select
                    sx={{ width: "100%" }}
                    name="companyTypeId"
                    onChange={handleChange}
                    value={values.companyTypeId ? values.companyTypeId : 0}
                    error={!!errors.companyTypeId}
                    disabled={valuesData?.Company ? true : false}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(valuesData?.CatalogCompanyType ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.companyTypeId}
                  </FormHelperText>
                </Stack>
              </Grid>
              {/* <Grid item xs={12} gridArea={0}>
                <Stack direction="column" spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>Prorrateo</Typography>
                  <Select
                    sx={{ width: "100%" }}
                    name="proratingId"
                    onChange={handleChange}
                    value={values.proratingId ? values.proratingId : 0}
                    error={!!errors.proratingId}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(valuesData?.CatalogProrating ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.proratingId}
                  </FormHelperText>
                </Stack>
              </Grid> */}
            </Grid>
            <Box
              flexGrow={1}
              flexBasis={0}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                border="2px dashed #1475cf"
                height="70%"
                width="50%"
                borderRadius={3}
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={inputRef}
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files?.length) {
                      console.log('e.target', e.target.files)
                      setBase64(e.target.files[0]);
                      setImage(URL.createObjectURL(e.target.files[0]));
                      setFieldValue(
                        "logo.fileExtension",
                        e.target.files[0].type.toString().split("/")[1]
                      );
                      setFieldValue("logo.name", "");
                      setFieldValue(
                        "logo.containerName",
                        Constants.companyContainerName
                      );
                    }
                  }}
                />
                {image ? (
                  <Box width="50%" height="90%">
                    <Avatar
                      src={image}
                      variant="rounded"
                      style={{ width: "auto", height: "100%" }}
                      imgProps={{
                        sx: {
                          objectFit: "contain",
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    <Upload />
                    <Typography sx={LinkSmallFont}>
                      Selecciona tu imagen
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Stack>
          <Box paddingTop={1}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
              <Grid item xs={12} sm={6}>
                <Stack direction="column" spacing={2}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Razón social
                  </Typography>
                  <TextField
                    placeholder="Razón social"
                    name="corporateName"
                    value={values.corporateName}
                    onChange={handleChange}
                    helperText={errors.corporateName}
                    error={!!errors.corporateName}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="column" spacing={2}>
                  <Typography sx={{ ...TextSmallFont }}>Nombre Corto</Typography>
                  <TextField
                    placeholder="Nombre Corto"
                    name="abbreviation"
                    value={values.abbreviation}
                    onChange={handleChange}
                    helperText={errors.abbreviation}
                    error={!!errors.abbreviation}
                  />
                </Stack>
              </Grid>
              { values.companyTypeId === Constants.folioInsuranceCompany ? (
              <Grid item xs={12} sm={6}>
                <Stack direction="column" spacing={2}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Financiamiento
                  </Typography>
                  <TextField
                    placeholder="Financiamiento"
                    name="financing"
                    type="number"
                    value={values.financing === 0 ? "" : values.financing}
                    onChange={handleChange}
                    helperText={errors.financing}
                    error={!!errors.financing}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      
                    }}
                  />
                </Stack>
              </Grid>) : ""}
              <Grid item xs={12} sm={6}>
                <Stack direction="column" spacing={2}>
                  <Typography sx={{ ...TextSmallFont }}>Cve agente</Typography>
                  <TextField
                    placeholder="Cve Agente"
                    name="agent"
                    value={values.agent}
                    onChange={handleChange}
                    helperText={errors.agent}
                    error={!!errors.agent}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="column" spacing={2}>
                  <Typography sx={{ ...TextSmallFont }}>No Compañia</Typography>
                  <TextField
                    placeholder="No Compañia"
                    name="companyNumber"
                    value={values.companyNumber}
                    onChange={handleChange}
                    helperText={errors.companyNumber}
                    error={!!errors.companyNumber}
                    inputProps={{ maxLength: 10 }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} alignSelf="center">
                <Stack paddingLeft={5} direction="column" spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>Estatus</Typography>
                  <Stack direction="row" spacing={1}>
                    <Switch
                      inputProps={{ "aria-label": "ant design" }}
                      name="objectStatusId"
                      value={values.objectStatusId}
                      checked={values.objectStatusId == 3 ? false : true}
                      onChange={(event, checked) => {
                        setFieldValue("objectStatusId", checked ? 1 : 3);
                      }}
                    />
                    <Typography>Activo</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Grid container paddingTop={5} columnSpacing={{ xs: 1 }}>
              <Grid item xs={12} sm={6} alignSelf="flex-end">
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
              <Grid item xs={12} sm={6} alignSelf="flex-end" container justifyContent="flex-end">
                <Button
                  type="submit"
                  size="small"
                  endIcon={<Complete color={ColorPureWhite} />}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
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

export default TabGeneral;
