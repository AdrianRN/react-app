
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Button, InputAdornment, InputSearch, Markdown, TextField } from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { ColorPureWhite, LinkLargeFont, TextSmallFont } from "../../../OuiComponents/Theme";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/material";
import Catalog from "../../../../models/Catalog";
import catalogValueService from "../../../../services/catalogvalue.service";
import { getCatalogs } from "../../../../services/catalog.service";
import { ArrowRight } from "../../../OuiComponents/Icons";
import PeopleService from "../../../../services/people.service";
import People from "../../../../models/People";
import ReceiptsService from "../../../../services/receipts.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";

interface EmailData {
    mailReceiver: string,
    bodyMail: string
}

interface IinsuranceLog {
    birthDate: string,
    reason: string,
    description: string,
    logType: string
}

function TabEmail(props: any) {
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    const [valuesData, setValuesData] = React.useState<EmailData>();
    const [personInfo, setPersonInfo] = React.useState<People>();
    const [loading, setLoading] = useState(false);
    
    React.useEffect(() => {
        const fetchData = async () => {
            const person = await PeopleService.getById(props.data.clientId);

                setPersonInfo(person.data);
            
        }

        fetchData()
    }, [])

    const initialValues: EmailData = {

        mailReceiver: personInfo?.email ?? valuesData?.mailReceiver ?? "",
        bodyMail: valuesData?.bodyMail ?? ""
    }

    const onSubmit = async (data: EmailData) => {
        try {
            setLoading(true); // Set loading to true before making the request

            const response = await ReceiptsService.postReceiptEmail(data);
            await ReceiptsService.patchFlags(props?.data?.receiptFolio, "emailNotification", true);
            await ReceiptsService.patchFlags(props?.data?.receiptFolio, "hasLogs", true);

            // Assuming the response indicates a successful request
            setDataAlert(
                true,
                "El correo fue enviado correctamente y se agregó a la bitácora",
                "success",
                autoHideDuration
            );
            setTimeout(() => {
                // ... (any additional actions after successful request)
            }, 1000);
        } catch (e:any) {
            setDataAlert(true, e.message, "error", autoHideDuration);
        } finally {
            setLoading(false); // Set loading to false after the request is completed
        }


        const insuranceLogData: IinsuranceLog = {
            birthDate: props.data.birthDate,
            reason: "Envío de correo electrónico", 
            description: data.bodyMail,
            logType: "email"
        };

        ReceiptsService.postReceiptsLogs(props.data.receiptFolio, insuranceLogData)
            .then((result) => {
                // Manejar la respuesta aquí si es necesario
                
            })
            .catch((error) => {
                // Manejar el error aquí si es necesario
                console.error(error);
            });
    }

    

    const { handleSubmit, handleChange, errors, values, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: Yup.object({
                 bodyMail: Yup.string().required("Este campo es requerido"),
                
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
            <Box component='form' onSubmit={handleSubmit}>
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                Correo electrónico
                </Typography>
                <Stack direction="column">
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
                                        Correo electrónico
                                    </Typography>
                                    <TextField
                                    disabled
                                        name="mailReceiver"
                                        value={values.mailReceiver}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.mailReceiver}
                                        error={!!errors.mailReceiver}
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{ paddingBottom: "32px" }}
                                >
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Cuerpo del mensaje
                                    </Typography>
                                    <TextField sx={{ height: "200px" }}
                                        name="bodyMail"
                                        multiline
                                        rows={5}
                                        value={values.bodyMail}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.bodyMail}
                                        error={!!errors.bodyMail}

                                    />

                                </Stack>
                            </Grid>

                        </Grid>
                    </Stack>
                </Stack>
                

                <Grid item xs={12} md={20} textAlign="end">
                    <Button type="submit" startIcon={<ArrowRight color={ColorPureWhite} />}>{loading ? "Enviando..." : "Enviar"}</Button>
                </Grid>
            </Box>
        </>
    );
}
export default TabEmail


