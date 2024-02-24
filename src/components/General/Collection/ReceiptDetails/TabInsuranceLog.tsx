import { Box, IconButton } from "@mui/material";
import React from "react";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import {
    ColorPink,
    ColorPureWhite,
    LinkLargeFont,
    TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { ArrowRight, Delete, Save } from "../../../OuiComponents/Icons";
import ReceiptsService from "../../../../services/receipts.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import FormatData from "../../../../utils/Formats.Data";

interface IinsuranceLog {
    birthDate: string,
    reason: string,
    description: string,
    logType: string
}

export default function TabInsuranceLog(props: any) {
    const [valuesData, setValuesData] = React.useState<IinsuranceLog>();
    const [gridData, setGridData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);



    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    React.useEffect(() => {
        // Realiza la petición GET al montar el componente
        getReceiptsLogsData();
    }, [props.data.receiptFolio]);

    const getReceiptsLogsData = () => {
        setLoading(true);
        ReceiptsService.getReceiptsLogs(props.data.receiptFolio)
            .then(async (result) => {
            //console.log(result.data);
            //console.log('result.data[0].logType', result.data[0].logType)

                if (result.data === null) {
                    await ReceiptsService.patchFlags(props.data.receiptFolio, "emailNotification", false);
                    await ReceiptsService.patchFlags(props.data.receiptFolio, "hasLogs", false);
                }

                if (result.data.length === 1 && result.data[0].logType === "log") {
                    await ReceiptsService.patchFlags(props.data.receiptFolio, "emailNotification", false);
                    await ReceiptsService.patchFlags(props.data.receiptFolio, "hasLogs", true);
                }
                // Agregar un identificador único a cada objeto de datos
                const dataWithIds = result.data.map((item: any, index: any) => ({
                    ...item,
                    id: index + 1, // Puedes ajustar el método de generación de ID según tus necesidades
                }));

                // Actualizar el estado con los datos y sus identificadores
                setGridData(dataWithIds);
            })
            .catch((error) => {
                setGridData([]);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const onSubmit = (data: IinsuranceLog, { resetForm }: { resetForm: () => void }) => {
        //console.log(data)
        data.logType = "log";
        ReceiptsService.postReceiptsLogs(props.data.receiptFolio, data)
            .then(async (result: any) => {
                // Manejar la respuesta aquí si es necesario
                console.log(result.data.receiptLogs);
                setDataAlert(true, "Creado exitosamente.", "success", autoHideDuration);

                resetForm();

                if (result.data.receiptLogs.length === 1) {
                    await ReceiptsService.patchFlags(props.data.receiptFolio, "hasLogs", true);
                }

                // Después de un POST exitoso, actualiza los datos con una nueva petición GET
                getReceiptsLogsData();
            })
            .catch((error) => {
                // Manejar el error aquí si es necesario
                console.error(error);
            });
    };

    const initialValues: IinsuranceLog = {
        birthDate: FormatData.stringDateFormat(valuesData?.birthDate ?? new Date().toString()),
        //razon social
        reason: valuesData?.reason ?? "",
        description: valuesData?.description ?? "",
        logType: valuesData?.description ?? "log"
    }

    const { handleSubmit, handleChange, errors, values } =
        useFormik({
            initialValues,
            validationSchema: Yup.object({
                birthDate: Yup.string().required("Este campo es requerido"),
                reason: Yup.string().required("Este campo es requerido."),
                description: Yup.string().required("Este campo es requerido."),

            }),
            onSubmit,
            enableReinitialize: true,
        });

    const columns: GridColDef[] = [
        { field: 'description', headerName: 'Descripción', flex: 1 },
        { field: 'issuanceDate', headerName: 'Fecha de registro', flex: 1,
        renderCell: (params) => {
            return (
              <>
                <Typography sx={TextSmallFont}>{FormatData.stringDateFormatDDMMYYY(params.row.issuanceDate)}</Typography>
              </>
            );
          } },
        { field: 'reason', headerName: 'Razón', flex: 1 },
        {
            field: '',
            headerName: 'Acciones',
            renderCell: (params) => (
                <IconButton
                    sx={{ marginLeft: '8px', width: '40px', height: '40px' }}
                    onClick={() => handleDelete(params.row.receiptLogId)}
                >
                    <Delete color={ColorPink} />
                </IconButton>
            ),
        },
    ];

    const handleDelete = (receiptLogId: string) => {
        // Ejecutar la acción de eliminación aquí
        ReceiptsService.deleteReceiptLog(props.data.receiptFolio, receiptLogId)
            .then((result) => {
                setDataAlert(true, "Eliminado exitosamente.", "success", autoHideDuration);

                // Después de un DELETE exitoso, actualiza los datos con una nueva petición GET
                getReceiptsLogsData();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <Box component='form' onSubmit={handleSubmit} maxWidth="auto">
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Bitácora
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
                            <Grid item xs={4} >
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{ paddingBottom: "32px" }}
                                >
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Fecha de registro
                                    </Typography>
                                    <TextField
                                        name="birthDate"
                                        value={values.birthDate}
                                        onChange={handleChange}
                                        type="date"
                                        helperText={errors.birthDate}
                                        error={!!errors.birthDate}
                                    />

                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{ paddingBottom: "32px" }}
                                >
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Razón
                                    </Typography>
                                    <TextField
                                        name="reason"
                                        value={values.reason}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.reason}
                                        error={!!errors.reason}
                                    />
                                </Stack>
                            </Grid>




                            <Grid item xs={12}>
                                <Stack direction="column" spacing={1}>
                                    <Typography sx={{ ...TextSmallFont }}>
                                        Descripción
                                    </Typography>
                                    <TextField sx={{ height: "200px" }}
                                        name="description"
                                        multiline
                                        rows={6}
                                        value={values.description}
                                        onChange={handleChange}
                                        type="text"
                                        helperText={errors.description}
                                        error={!!errors.description}

                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={20} textAlign="end">
                                <Button sx={{ marginTop: '5px', marginBottom: '26px' }}startIcon={<Save color={ColorPureWhite}/>}  type="submit">Guardar</Button>
                            </Grid>

                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        height: '100%', // Puedes ajustar la altura según tus necesidades
                                        width: '100%', // Ajusta el ancho según tus necesidades
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <DataGrid
                                    rows={gridData}
                                    columns={columns}
                                    disableRowSelectionOnClick
                                    sx={{ mt: 2 }}
                                />
                            )}

                            <MessageBar
                                open={isSnackbarOpen}
                                severity={severity}
                                message={messageAlert}
                                close={handleSnackbarClose}
                                autoHideDuration={autoHideDuration}
                            />


                        </Grid>
                    </Stack>
                </Stack>

            </Box>
        </>
    );
}
