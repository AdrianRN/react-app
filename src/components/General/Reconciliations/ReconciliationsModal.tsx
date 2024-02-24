import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import React from "react";
import { Box, Grid, Stack } from "../../OuiComponents/Layout";
import { DataGrid } from "../../OuiComponents/DataGrid";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import DialogContent from "@mui/joy/DialogContent/DialogContent";
import Button from "../../OuiComponents/Inputs/Button";
import Receipts from "../../../models/Receipts";
import ReceiptsService from "../../../services/receipts.service";
import TextField from "../../OuiComponents/Inputs/TextField";
import { useAlertContext } from "../../../context/alert-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "react-router-dom";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import ReconciliationSkeleton from "./ReconciliationSkeleton";
import Skeleton from "@mui/material";
import Constants from "../../../utils/Constants";
import { LinkLargeFont, TextSmallFont } from "../../OuiComponents/Theme";

interface UseFormData {
  Receipts: Receipts;
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
function ReconciliationsModal(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [rows, setRows] = React.useState<UseFormData>();
  const [change, setChange] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const receiptsData = await ReceiptsService.getReceiptsByFolio(
        props.data.receiptFolio
      );
      setRows({
        Receipts: receiptsData.data,
      });
      setLoading(false);
      setChange(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const initialValues: Receipts = {
     receiptFolio: rows?.Receipts.receiptFolio ?? props.data.receiptFolio,
     ...props.data
  };

  const onSubmit = (data: Receipts) => {
    
      data.receiptStatus = Constants.receiptStatus.reconciled;
      ReceiptsService.put(props.data.receiptFolio, data)
        .then((response: any) => {
          if (response.message == "OK") {
            setDataAlert(
              true,
              "El recibo se concilió correctamente",
              "success",
              autoHideDuration
            );
            setTimeout(() => {
              props.close(false);
            }, 2000);
          } else {
            setDataAlert(true, response.message, "error", autoHideDuration);
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        receiptStatus: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });
    

  const handleCloseModal = () => {
    props.setOpen(false);
  };

  return (
    <>
      {loading ? (
        <ReconciliationSkeleton />
      ) : (
        <Dialog
          open={props.open}
          aria-labelledby="modal-modal-title"
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "15px",
              padding: 1,
            },
          }}
        >
          <DialogContent sx={{ overflowX: 'hidden', padding: '10px' }}>
            <Typography sx={{ ...LinkLargeFont  }}>
              ¿Estas seguro que deseas conciliar el recibo?
            </Typography>
            <Form onSubmit={handleSubmit}>
              <Box>
                <Stack spacing={1}>
                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12} sm={6}>
                      {/* <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Folio</Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Folio"
                            name="receiptFolio"
                            value={values.receiptFolio}
                            onChange={handleChange}
                            error={!!errors.receiptFolio}
                          />
                        </Stack>
                      </Stack> */}
                       <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Recibo
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="No. Recibo"
                            name="receiptNumber"
                            value={values.receiptNumber}
                            error={!!errors.receiptNumber}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Monto</Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField

                            placeholder="Monto"
                            name="amount"
                            value={values.amount}
                            onChange={(e)=>{
                              const amount = e.target.value;
                              setFieldValue("amount",Number(amount));
                            }}
                            error={!!errors.amount}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Poliza
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Poliza"
                            name="receiptNumber"
                            value={values.noPolicy}
                            onChange={handleChange}
                            error={!!errors.noPolicy}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={5.16}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>% IVA</Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="% IVA"
                            name="ivaPercentage"
                            value={values.ivaPercentage}
                            onChange={(e)=>{
                              const ivaPercentage = e.target.value;
                              setFieldValue("ivaPercentage",Number(ivaPercentage));
                            }}
                            error={!!errors.ivaPercentage}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Cliente
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Cliente"
                            name="clientName"
                            value={values.clientName}
                            onChange={handleChange}
                            error={!!errors.clientName}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Monto IVA
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Monto IVA"
                            name="ivaAmount"
                            value={
                              (
                                values.amount * (values.ivaPercentage/100))
                            }
                            onChange={(e)=>{
                              const ivaAmount = e.target.value;
                              setFieldValue("ivaAmount",Number(ivaAmount));
                            }}
                            error={!!errors.ivaAmount}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Comisiones
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            placeholder="Comisiones"
                            name="commissions"
                            value={values.commissions}
                            onChange={(e)=>{
                              const commissions = e.target.value;
                              setFieldValue("commissions",Number(commissions));
                            }}
                            error={!!errors.commissions}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Subtotal
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Subtotal"
                            name="subtotal"
                            value={ values.subtotal = 
                              (Number(values.amount) + Number(values.ivaAmount))
                            }
                            onChange={(e)=>{
                              const subtotal = e.target.value;
                              setFieldValue("subtotal",Number(subtotal));
                            }}
                            error={!!errors.subtotal}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Maquila
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            placeholder="Maquila"
                            name="manufacturingFee"
                            value={values.manufacturingFee}
                            onChange={(e)=>{
                              const manufacturingFee = e.target.value;
                              setFieldValue("manufacturingFee",Number(manufacturingFee));
                            }}
                            error={!!errors.manufacturingFee}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>Total</Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <TextField
                            disabled
                            placeholder="Total"
                            name="grandTotal"
                            value={
                              ((
                                Number(values.amount) +
                                Number(values.ivaAmount) +
                                Number(values.commissions) +
                                Number(values.manufacturingFee)
                              ).toFixed(2))
                            }
                            onChange={(e)=>{
                              const grandTotal = e.target.value;
                              setFieldValue("grandTotal",Number(grandTotal));
                            }}
                            error={!!errors.grandTotal}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={12} sm={6}>
                      
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button onClick={handleCloseModal} variant="outlined">
                        Cancelar
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      <Button type="submit">Conciliar</Button>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
    </>
  );
}
export default ReconciliationsModal;