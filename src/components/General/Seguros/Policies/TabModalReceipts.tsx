import React from "react";
import { AccordionDetails, Box, InputAdornment } from "@mui/material";
import { Dialog, Snackbar } from "../../../OuiComponents/Feedback";
import Alert from "../../../Template/Components/Alert";
import { DialogContent, IconButton } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import {
  ColorPureWhite,
  LinkLargeFont,
  LinkMediumFont,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import DatePicker from "../../../Template/Components/DatePicker";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { Button, Switch, TextField } from "../../../OuiComponents/Inputs";
import dayjs, { Dayjs } from "dayjs";
import { Plus } from "../../../OuiComponents/Icons";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import ReceiptsService from "../../../../services/receipts.service";
import ModelReceipts from "../../../../models/Receipts";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormatData from "../../../../utils/Formats.Data";
import { setDate } from "date-fns";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";

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
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

function TabModalReceipts(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(true);
  const [iva, setIva] = React.useState<number>(16);
  const [valuesData, setValuesData] = React.useState<ModelReceipts>();

  React.useEffect(() => {
    setOpen(props.open);
  }, []);

  const ItemStack = styled(Stack)(({ theme }) => ({
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "5px",
    borderRadius: "16px",
  }));


  const initialValues: ModelReceipts = {
    receiptFolio: "",
    receiptNumber: 0,
    totalReceipts: 0,
    policyType: valuesData?.policyType ?? "",
    policyFolio: valuesData?.policyFolio ?? props.data,
    startValidity: FormatData.stringDateFormat(
      valuesData?.startValidity ?? new Date().toString()
    ),
    endValidity: FormatData.stringDateFormat(
      valuesData?.endValidity ?? new Date().toString()
    ),
    validityDate: FormatData.stringDateFormat(
      valuesData?.validityDate ?? new Date().toString()
    ),
    dueDate: FormatData.stringDateFormat(
      valuesData?.dueDate ??
        new Date(new Date().setDate(new Date().getDate() + 15)).toString()
    ),
    receiptStatus: valuesData?.receiptStatus ?? "",
    netPremium: valuesData?.netPremium ?? 0,
    settingOne: valuesData?.settingOne ?? 0,
    settingTwo: valuesData?.settingTwo ?? 0,
    additionalCharge: valuesData?.additionalCharge ?? 0,
    rights: valuesData?.rights ?? 0,
    financing: valuesData?.financing ?? 0,
    iva: valuesData?.iva ?? "",///////////////////////////
    ivaAmount: 0,///////////////////////////
    ivaPercentage: 0,///////////////////////////
    surcharge: 0,///////////////////////////
    subtotal: valuesData?.subtotal ?? 0,
    financingPercentage: valuesData?.financingPercentage ?? 0,
    grandTotal: valuesData?.grandTotal ?? "",
    netPremiumAmount:0,///////////////////////////
    clientId: valuesData?.clientId ?? "",
    clientName: valuesData?.clientName ?? "",
    branchId: valuesData?.branchId ?? '',
    branchName: valuesData?.branchName ?? '',
    createdBy: valuesData?.createdBy ?? '',
    groupsId: valuesData?.groupsId ?? '',
    groupsName: valuesData?.groupsName ?? '',
    insuranceId: valuesData?.insuranceId ?? '',
    insuranceName: valuesData?.insuranceName ?? '',
    paymentMethod: valuesData?.paymentMethod ?? '',
    amount: valuesData?.amount ?? 0,
    commissions: valuesData?.commissions ?? 0,
    manufacturingFee: valuesData?.manufacturingFee ?? 0,
    descriptionReceiptStatus: {
      description: valuesData?.descriptionReceiptStatus?.description ?? "",
      folio: valuesData?.descriptionReceiptStatus?.folio ?? ""
    },
    sellerFolio:valuesData?.sellerFolio ?? '',
    noPolicy:valuesData?.noPolicy ?? '',
    limitPayDate: valuesData?.limitPayDate ?? '',
    payReceipt: valuesData?.payReceipt ?? '',
    currency: valuesData?.currency ?? '',
    objectStatusId: valuesData?.objectStatusId ?? 1,
  };

  const onSubmit = async (data: any) => {
    await ReceiptsService.postReceipt(data)
      .then((response: any) => {
        setDataAlert(true,"El recibo se registró exitósamente.","success",autoHideDuration);
        props.onDataChange(response.data.folio);
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });

    setTimeout(() => {
      props.close(false);
    }, 1000);
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      startValidity: Yup.string().required("Este campo es requerido."),
      endValidity: Yup.string().required("Este campo es requerido."),
      validityDate: Yup.string().required("Este campo es requerido."),
      dueDate: Yup.string().required("Este campo es requerido."),
      //receiptStatus: Yup.string().required("Este campo es requerido."),
      // netPremium: Yup.string().required("Este campo es requerido."),
      // rights: Yup.string().required("Este campo es requerido."),
      // financing: Yup.string().required("Este campo es requerido."),
      // policyType: Yup.string().required("Este campo es requerido."),
      //policyFolio: Yup.string().required("Este campo es requerido."),
      // receiptNumber: Yup.string().required("Este campo es requerido."),
      // totalReceipts: Yup.string().required("Este campo es requerido."),
    }),
    onSubmit,
    enableReinitialize: true,
  });

  const additionalSubTotal = (data: ModelReceipts) => {
    const subTotal =
      Number(data.netPremium) -
      Number(data.settingOne) -
      Number(data.settingTwo) +
      Number(data.additionalCharge)+
      Number(data.rights);
    return Number(subTotal.toFixed(2));
  };
  const financingPercentage = (data: ModelReceipts) => {
    if (Number(values.subtotal) === 0) {
      return 0;
    }
    return parseFloat(
      ((Number(data.financing) / Number(values.subtotal)) * 100).toFixed(2)
    );
  };

  return (
    <>
      <Box component="form" maxWidth="auto">
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
          maxWidth="lg"
          PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
        >
          <IconButton
            onClick={props.close}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Cancel />
          </IconButton>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography
                variant="h5"
                sx={{ ...LinkMediumFont, color: "#FF8F15" }}
              >
                Registro de Recibos
              </Typography>
              <Stack direction="column">
                <AccordionDetails>
                  <Stack direction="column">
                    <Stack direction="row" display="flex" spacing={1}>
                      <Grid
                        container
                        flexGrow={1}
                        flexBasis={0}
                        rowSpacing={1}
                        columnSpacing={{ xs: 1 }}
                      >
                        <Grid
                          container
                          spacing={3}
                          style={{ marginBottom: "15px" }}
                        >
                          <Grid item xs={12} sm={4}>
                            <Stack
                              direction="column"
                              spacing={1}
                              sx={{ paddingBottom: "32px" }}
                            >
                              <Typography sx={{ ...TextSmallFont }}>
                                Inicio De Vigencia
                              </Typography>
                              <TextField
                                name="startValidity"
                                type="date"
                                value={values.startValidity}
                                onChange={handleChange}
                                helperText={errors.startValidity}
                                error={!!errors.startValidity}
                              />
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Stack
                              direction="column"
                              spacing={1}
                              sx={{ paddingBottom: "32px" }}
                            >
                              <Typography sx={{ ...TextSmallFont }}>
                                Fin De Vigencia
                              </Typography>
                              <TextField
                                name="endValidity"
                                type="date"
                                value={values.endValidity}
                                onChange={handleChange}
                                helperText={errors.endValidity}
                                error={!!errors.endValidity}
                              />
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Stack
                              direction="column"
                              spacing={1}
                              sx={{ paddingBottom: "32px" }}
                            >
                              <Typography sx={{ ...TextSmallFont }}>
                                Límite de pago
                              </Typography>
                              <TextField
                                name="dueDate"
                                type="date"
                                value={values.dueDate}
                                onChange={handleChange}
                                helperText={errors.dueDate}
                                error={!!errors.dueDate}
                              />
                            </Stack>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Tipo de poliza
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                placeholder="Seguros"
                                disabled
                                type="text"
                                name="policyType"
                                onChange={handleChange}
                                helperText={errors.policyType}
                                error={!!errors.policyType}
                                value={values.policyType}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Estatus de Recibo
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{ paddingRight: "30px" }}
                            >
                              <TextField
                                placeholder="Pendiente"
                                disabled
                                type="text"
                                name="receiptStatus"
                                value={values.receiptStatus}
                                onChange={handleChange}
                                helperText={errors.receiptStatus}
                                error={!!errors.receiptStatus}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Folio de Recibo
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                disabled
                                type="text"
                                name="policyFolio"
                                value={values.receiptFolio}
                                onChange={handleChange}
                                helperText={errors.policyFolio}
                                error={!!errors.policyFolio}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Prima neta
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="netPremium"
                                value={values.netPremium ? values.netPremium: 0.0001}
                                onChange={handleChange}
                                helperText={errors.netPremium}
                                error={!!errors.netPremium}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Ajuste 1
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="settingOne"
                                value={values.settingOne ? values.settingOne : 0.0001}
                                onChange={handleChange}
                                helperText={errors.settingOne}
                                error={!!errors.settingOne}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                  startAdornment: (
                                    <InputAdornment
                                      position="start"
                                      sx={{ color: "red" }}
                                    >
                                      <Typography>-</Typography>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    color: "red",
                                  },
                                }}
                              />
                            </Stack>
                            {/* <ItemStack direction="row" spacing={1}>
                            <Switch />
                            <Typography>DESCUENTO</Typography>
                          </ItemStack> */}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack
                            direction="column"
                            spacing={1}
                            sx={{ paddingBottom: "32px" }}
                          >
                            <Typography sx={{ ...TextSmallFont }}>
                              Ajuste 2
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="settingTwo"
                                value={values.settingTwo ? values.settingTwo : 0.0001}
                                onChange={handleChange}
                                helperText={errors.settingTwo}
                                error={!!errors.settingTwo}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                  startAdornment: (
                                    <InputAdornment
                                      position="start"
                                      sx={{ color: "red" }}
                                    >
                                      <Typography>-</Typography>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    color: "red",
                                  },
                                }}
                              />
                            </Stack>
                            {/* <ItemStack direction="row" spacing={1}>
                            <Switch />
                            <Typography>DESCUENTO</Typography>
                          </ItemStack> */}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              Cargo Extra
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="additionalCharge"
                                value={values.additionalCharge ? values.additionalCharge: 0.0001}
                                onChange={handleChange}
                                helperText={errors.additionalCharge}
                                error={!!errors.additionalCharge}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                            {/* <ItemStack direction="row" spacing={1}>
                            <Switch />
                            <Typography>AFECTA IVA</Typography>
                          </ItemStack> */}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              Derecho
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="rights"
                                value={values.rights ? values.rights: 0.0001}
                                onChange={handleChange}
                                helperText={errors.rights}
                                error={!!errors.rights}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              SubTotal
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="subtotal"
                                value={
                                  (values.subtotal = additionalSubTotal(values))
                                }
                                onChange={handleChange}
                                helperText={errors.subtotal}
                                error={!!errors.subtotal}
                                disabled
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              Financiamiento
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="financing"
                                value={values.financing ? values.financing: 0.0001}
                                onChange={handleChange}
                                helperText={errors.financing}
                                error={!!errors.financing}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                            <ItemStack direction="row" spacing={1}>
                              <Typography>
                                Mensual {" "}
                                {
                                    (values.financingPercentage =
                                      financingPercentage(values))
                                }
                                {" "}
                                %
                              </Typography>
                            </ItemStack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              I.V.A
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="iva"
                                value={
                                  (values.iva = (
                                    (Number(values.subtotal) * iva) /
                                    100
                                  ).toFixed(2))
                                }
                                onChange={handleChange}
                                helperText={errors.iva}
                                error={!!errors.iva}
                                disabled
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                              />
                            </Stack>
                            <ItemStack direction="row" spacing={1}>
                              16.00%
                            </ItemStack>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={{ ...TextSmallFont }}>
                              Prima Total
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <TextField
                                name="grandTotal"
                                value={
                                  (values.grandTotal = (
                                    Number(values.subtotal) + Number(values.iva)
                                  ).toFixed(2))
                                }
                                onChange={handleChange}
                                helperText={errors.grandTotal}
                                error={!!errors.grandTotal}
                                InputProps={{
                                  inputComponent: NumericFormatCustom as any,
                                }}
                                disabled
                              />
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                  <Grid item xs={12} md={20} textAlign="end">
                    <Button type="submit">Guardar</Button>
                  </Grid>
                  {/* <Grid>
                  <Button onClick={props.close}>Cerrar</Button>
                </Grid> */}
                </AccordionDetails>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}

export default TabModalReceipts;
