import { Box } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as Yup from "yup";
import { useAlertContext } from '../../../../context/alert-context';
import { ICatalogValue } from "../../../../models/CatalogValue";
import Receipts from "../../../../models/Receipts";
import CacheService from "../../../../services/cache.service";
import ReceiptsService from "../../../../services/receipts.service";
import Constants from "../../../../utils/Constants";
import FormatData from "../../../../utils/Formats.Data";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Button, Select, TextField } from "../../../OuiComponents/Inputs";
import { Grid } from "../../../OuiComponents/Layout";
import Stack from "../../../OuiComponents/Layout/Stack";
import MenuItem from "../../../OuiComponents/Navigation/MenuItem";
import {
    LinkLargeFont,
    TextSmallFont
} from "../../../OuiComponents/Theme";
import moment from "moment";

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
                decimalSeparator={"."}
                decimalScale={2}
            />
        );
    }
);

function TabPayment(props: any) {

    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    const [receiptFolio, setReceiptFolio] = React.useState<Receipts>();
    const [valuesData, setValuesData] = React.useState<Receipts>();
    const [paymentInfo, setPaymentInfo] = React.useState<ICatalogValue[]>([]);

    React.useEffect(() => {
        fetchData()
        

    }, []);

    const fetchData = async () => {

        const payment = await CacheService.getByFolioCatalog(Constants.paymentMethodCatalogFolio)
        setPaymentInfo(payment.data.values)
        setReceiptFolio(props.data)


    }
    const initialValues: Receipts = {
        ...props.data,
        paymentMethod: props.data.paymentMethod ?? valuesData?.paymentMethod ?? "",
        payReceipt: FormatData.stringDateFormat(props.data.payReceipt ?
            props.data.payReceipt :
            new Date().toString()
        )

    }

    const onSubmit = (data: Receipts) => {
        data.receiptStatus = Constants.receiptStatus.payed;
        
         ReceiptsService.putPutReceiptnoPolicyAsync(props.data.receiptFolio, data)
             .then((response: any) => {
                 setDataAlert(
                     true,
                     "El recibo cambió su estatus a pagado",
                     "success",
                     autoHideDuration
                 );
                 setTimeout(() => {
                     props.close(false);
                 }, 1000);
             })
             .catch((e: Error) => {
                 setDataAlert(true, e.message, "error", autoHideDuration);
             });
    };

    const { handleSubmit, handleChange, errors, values, setFieldValue } = useFormik({
        initialValues,
        validationSchema: Yup.object({
            paymentMethod: Yup.string().required("Este campo es requerido."),
            payReceipt: Yup.string().required("Este campo es requerido."),
        }),
        onSubmit,
        enableReinitialize: true
    })


    return (
        <>
            <MessageBar
                open={isSnackbarOpen}
                severity={severity}
                message={messageAlert}
                close={handleSnackbarClose}
                autoHideDuration={autoHideDuration}
            />
            <Box component='form' onSubmit={handleSubmit}>
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Método de pago
                </Typography>

                <Stack direction="row" display="flex" spacing={1}>

                    <Grid
                        container
                        flexGrow={1}
                        flexBasis={0}
                        rowSpacing={1}
                        columnSpacing={{ xs: 1 }}
                    >
                        <Grid item xs={5}>
                            <Stack
                                direction="column"
                                spacing={1}
                                sx={{ paddingBottom: "32px" }}
                            >
                                <Typography sx={{ ...TextSmallFont }}>
                                    Método de pago
                                </Typography>
                                <Select
                                    sx={{ width: "100%" }}
                                    name="paymentMethod"
                                    value={
                                        values.paymentMethod
                                            ? values.paymentMethod
                                            : "0"
                                    }
                                    onChange={handleChange}
                                    error={!!errors.paymentMethod}

                                >
                                    <MenuItem value={"0"} key={"0"} disabled>
                                        Selecciona
                                    </MenuItem>
                                    {
                                        paymentInfo.map((data: ICatalogValue) => {
                                            return (
                                                <MenuItem

                                                    key={data.folio}
                                                    value={data.folio}
                                                >
                                                    {data.description}
                                                </MenuItem>
                                            );
                                        })}


                                </Select>

                            </Stack>
                        </Grid>
                        <Grid item xs={3.5}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fecha de pago
                                </Typography>
                                <TextField
                                    name="payReceipt"
                                    type="date"
                                    value={values.payReceipt}
                                    onChange={handleChange}
                                    helperText={errors.payReceipt}
                                    error={!!errors.payReceipt}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={3.5}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Folio
                                </Typography>
                                <TextField
                                    name="folio"
                                    disabled
                                    value={receiptFolio?.receiptFolio}
                                />
                            </Stack>
                        </Grid>

                    </Grid>

                </Stack>
                <Grid item xs={12} md={20} textAlign="end">
                    <Button type="submit">Aplicar pago</Button>
                </Grid>
            </Box>
        </>
    );
}
export default TabPayment

