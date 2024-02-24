import { Autocomplete, Box, DialogContent, FormHelperText, IconButton } from '@mui/material'
import { useFormik } from "formik"
import React, { useState } from 'react'
import * as Yup from "yup"
import { useAlertContext } from '../../../../context/alert-context'
import IFilter from "../../../../insuranceModels/filters"
import FilterService from '../../../../insuranceServices/filters.service'
import CacheCatalogValue from '../../../../models/CacheCatalogValue'
import { ICatalogValue } from '../../../../models/CatalogValue'
import Company from "../../../../models/Company"
import ModelPeople from '../../../../models/People'
import CacheService from '../../../../services/cache.service'
import CompaniesService from '../../../../services/companies.service'
import PeopleService from "../../../../services/people.service"
import Constants from '../../../../utils/Constants'
import { Divider } from '../../../OuiComponents/DataDisplay'
import Typography from '../../../OuiComponents/DataDisplay/Typography'
import Dialog from '../../../OuiComponents/Feedback/Dialog'
import MessageBar from '../../../OuiComponents/Feedback/MessageBar'
import CircularProgress from '../../../OuiComponents/Feedback/ProgressCircular'
import { Save } from '../../../OuiComponents/Icons'
import Cancel from '../../../OuiComponents/Icons/Cancel'
import Button from '../../../OuiComponents/Inputs/Button'
import Select from '../../../OuiComponents/Inputs/Select'
import TextField from '../../../OuiComponents/Inputs/TextField'
import Grid from '../../../OuiComponents/Layout/Grid'
import Stack from '../../../OuiComponents/Layout/Stack'
import MenuItem from '../../../OuiComponents/Navigation/MenuItem'
import { ColorPureWhite, LinkLargeFont, TextSmallFont } from '../../../OuiComponents/Theme'


interface FilterData {
    Groups: CacheCatalogValue,
    Branches: CacheCatalogValue,
    Companies: Company
    Filter: IFilter
}

function NewFilterModal(props: any) {

    let disabledHypertext = false;
    if (props.modifyValueDisabled === true) {
        disabledHypertext = props.modifyValueDisabled;
    }
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const [valuesData, setValuesData] = React.useState<FilterData>();
    const [loading, setLoading] = React.useState(true);
    const [optionsClient, setOptionsClient] = React.useState<ModelPeople[]>([]);
    const [loadingClient, setLoadingClient] = React.useState(false);
    const [valueClient, setValueClient] = React.useState<any | null>(null);




    React.useEffect(() => {



        const fetchData = async () => {
            const restCompanies = await CompaniesService.getCompanyCombo();
            const restBranches = await CacheService.getByFolioCatalog(Constants.branchesCatalogFolio)
            const restGroups = await CacheService.getByFolioCatalog(Constants.groupsCatalogFolio)
            if (props.filter) {
                const client = await PeopleService.getById(props.filter.creditCustomerFolio);

                setValueClient(client.data);
            }
            setValuesData({
                Companies: restCompanies.data, Groups: restGroups.data.values, Branches: restBranches.data.values, Filter: props.filter ? props.filter : [],
            })
            setLoading(false)
        }

        fetchData()
    }, [])

    var user = localStorage.getItem("userInfo")


    const initialValues: IFilter = {
        id: valuesData?.Filter.id ?? "",
        folio: valuesData?.Filter.folio ?? "",
        title: valuesData?.Filter.title ?? "",
        days: valuesData?.Filter.days ?? "",
        initialExpirationDay: valuesData?.Filter.initialExpirationDay ?? 0,
        finalExpirationDay: valuesData?.Filter.finalExpirationDay ?? 0,
        initialDayExpired: valuesData?.Filter.initialDayExpired ?? 0,
        finalDayExpired: valuesData?.Filter.finalDayExpired ?? 0,
        groupFolio: valuesData?.Groups ? valuesData?.Filter.groupFolio : "",
        branchFolio: valuesData?.Branches ? valuesData?.Filter.branchFolio : "",
        companyFolio: valuesData?.Companies ? valuesData?.Filter.companyFolio : "",
        creditCustomerFolio: valuesData?.Filter.creditCustomerFolio ?? null,
        creditCustomerName: valuesData?.Filter.creditCustomerName ?? null,
        userFolio: JSON.parse(`${user ?? ''}`).folio

    }


    const onSubmit = (data: IFilter) => {

        console.log(data)



        if (props.filter) {
            FilterService.putFilter(props.filter.folio, data)
                .then((response: any) => {
                    setDataAlert(
                        true,
                        "El filtro  se actualizó con éxito.",
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
        } else {
            FilterService.postFilter(data)
                .then((response: any) => {
                    setDataAlert(
                        true,
                        "El filtro fue creado correctamente.",
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
        }
    };



    const { handleSubmit, handleChange, errors, values, setFieldValue } = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup.string().required("Este campo es requerido."),
            // daysToExpire: Yup.string().required("Este campo es requerido."),
            // expiredDays: Yup.string().required("Este campo es requerido."),
            // bussinessGroup: Yup.string().required("Este campo es requerido."),
            // branch: Yup.string().required("Este campo es requerido."),
            // company: Yup.string().required("Este campo es requerido."),
            //creditCustomerFolio: Yup.string().required("Este campo es requerido.")
        }),
        onSubmit,
        enableReinitialize: true
    })

    const handleInputPeopleChange = async (name: any, value: any) => {
        setTimeout(async () => {
            if (value) {
                let response = null;

                if (name === "client" && !valueClient) {
                    setLoadingClient(true);
                    response = await PeopleService.getAllByName(value);
                }

                if (response == null) {
                    if (name === "client") {
                        setOptionsClient([]);
                        setLoadingClient(false);
                    }

                    return;
                }

                const list = response.data;

                list.map((row: { [key: string]: any }) => {
                    const columns = Object.keys(row).map((column) => {
                        if (column === "name") {
                            const fullName =
                                `${row[column]} `.trim()//${lastName} ${maternalLastName}`.trim();
                            row["name"] = fullName;
                            return { field: "name", headerName: "Name" };
                        }
                        return { field: column, headerName: column };
                    });
                    return columns;
                });

                //Si el listado es de otro tipo y no cuenta con la propiedad 'name'
                list.map((row: { [key: string]: any }) => {
                    if (!row["lastName"]) {
                        Object.keys(row).map((column) => {
                            if (
                                column
                                    .toLowerCase()
                                    .includes((props.name ? props.name : "name").toLowerCase())
                            ) {
                                row["name"] = row[column];
                            }
                        });
                    } else {
                        return;
                    }
                });

                if (name === "client") {
                    setOptionsClient(list);
                    setLoadingClient(false);
                }
            } else {
                if (name === "client") {
                    setOptionsClient([]);
                    setLoadingClient(false);
                }
            }
        }, 500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (values.days === "0") {
            setFieldValue(name, 0);
            return;
        }

        // Convert empty values to 0
        const sanitizedValue = value.trim() === "" ? 0 : parseInt(value, 10);

        // Use setFieldValue to update the form state
        setFieldValue(name, sanitizedValue);

        // Other logic if needed
    };


    return (
        <>
            <MessageBar
                open={isSnackbarOpen}
                severity={severity}
                message={messageAlert}
                close={handleSnackbarClose}
                autoHideDuration={autoHideDuration}
            />
            <Dialog open={props.open}
                aria-labelledby="modal-modal-title"
                fullWidth
                maxWidth='md'
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
                    <Typography variant="h2" sx={{ ...LinkLargeFont, pt: 3, pl: 2 }}>
                        {props.filter ? <strong>Actualizar Filtro</strong> : <strong>Nuevo Filtro</strong>}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack display="column" spacing={1}>
                            <Grid
                                style={{ display: "flex", alignItems: "center" }}
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                sx={{ pb: 2 }}
                            >

                                <Grid item xs={5.8} >
                                    <Stack>
                                        <Typography sx={{ ...TextSmallFont }}>Título</Typography>
                                        <TextField
                                            name="title"

                                            value={values.title}
                                            onChange={handleChange}
                                            helperText={errors.title}
                                            error={!!errors.title}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Typography variant="h2" sx={{ ...LinkLargeFont, pt: 3, pl: 2 }}>
                                <strong>Parámetros de búsqueda</strong>
                            </Typography>
                            <Grid
                                style={{ display: "flex", alignItems: "center" }}
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                <Grid item xs={5.8} >

                                    <Stack direction="row" sx={{ pt: 2, pb: 2 }}>
                                        <Select
                                            name="days"
                                            value={values.days ? values.days : "0"}
                                            sx={{ width: "100%" }}
                                            onChange={(e) => {
                                                handleChange(e);

                                                if (e.target.value == "Días por vencer") {
                                                    setFieldValue(
                                                        "initialDayExpired", 0

                                                    )
                                                    setFieldValue(
                                                        "finalDayExpired", 0

                                                    )
                                                }

                                                if (e.target.value == "Días vencidos") {
                                                    setFieldValue(
                                                        "initialExpirationDay", 0

                                                    )
                                                    setFieldValue(
                                                        "finalExpirationDay", 0

                                                    )
                                                }

                                                if (e.target.value == "0") {
                                                    setFieldValue(
                                                        "initialExpirationDay", 0

                                                    )
                                                    setFieldValue(
                                                        "finalExpirationDay", 0

                                                    )
                                                    setFieldValue(
                                                        "initialDayExpired", 0

                                                    )
                                                    setFieldValue(
                                                        "finalDayExpired", 0

                                                    )
                                                }


                                            }}
                                            error={!!errors.companyFolio}
                                        >
                                            <MenuItem value={"0"} key={"0"} >
                                                Selecciona
                                            </MenuItem>
                                            <MenuItem value={"Días por vencer"}>Días por vencer</MenuItem>
                                            <MenuItem value={"Días vencidos"}>Días vencidos</MenuItem>
                                        </Select>
                                        <FormHelperText sx={{ color: "#d22e2e" }}>
                                            {errors.companyFolio}
                                        </FormHelperText>
                                    </Stack>

                                </Grid>
                                <Grid item xs={5.8} >

                                    <Stack direction="row" sx={{ pt: 2, pb: 2 }}>
                                        <Typography sx={{ ...TextSmallFont, pt: 2 }}>De:</Typography>
                                        <TextField
                                            sx={{ pl: 2, pr: 2 }}

                                            name={values.days == "Días por vencer" ? "initialExpirationDay" : "initialDayExpired"}
                                            type="number"
                                            value={values.days == "Días por vencer" ? values.initialExpirationDay : values.initialDayExpired}
                                            onChange={handleInputChange}

                                            //helperText={errors.daysToExpire}
                                            error={!!errors.initialDayExpired}
                                        />
                                        <Typography sx={{ ...TextSmallFont, pt: 2 }}>Hasta:</Typography>
                                        <TextField
                                            sx={{ pl: 2 }}
                                            name={values.days == "Días vencidos" ? "finalDayExpired" : "finalExpirationDay"}
                                            type="number"
                                            value={values.days == "Días vencidos" ? values.finalDayExpired : values.finalExpirationDay}
                                            onChange={
                                                handleInputChange

                                            }
                                            //helperText={errors.daysToExpire}

                                            error={!!errors.finalDayExpired}
                                        />
                                    </Stack>

                                </Grid>
                                <Grid item xs={5.8} >
                                    <Stack>
                                        <Typography sx={{ ...TextSmallFont }}>Compañia</Typography>
                                        <Select
                                            sx={{ width: "100%" }}
                                            name="companyFolio"
                                            value={
                                                values.companyFolio
                                                    ? values.companyFolio
                                                    : "0"
                                            }
                                            onChange={handleChange}
                                            error={!!errors.companyFolio}
                                        >
                                            <MenuItem value={"0"} key={"0"} >
                                                Selecciona
                                            </MenuItem>
                                            {Object(
                                                valuesData?.Companies ?? []).map((data: Company) => (
                                                    <MenuItem

                                                        key={data.folio}
                                                        value={data.folio}
                                                    >
                                                        {data.corporateName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText sx={{ color: "#d22e2e" }}>
                                            {errors.companyFolio}
                                        </FormHelperText>

                                    </Stack>
                                </Grid>
                                <Grid item xs={5.8} >
                                    <Stack>
                                        <Typography sx={{ ...TextSmallFont }}>Ramo</Typography>
                                        <Select
                                            sx={{ width: "100%" }}
                                            name="branchFolio"
                                            value={
                                                values.branchFolio
                                                    ? values.branchFolio
                                                    : "0"
                                            }
                                            onChange={handleChange}
                                            error={!!errors.branchFolio}
                                        >
                                            <MenuItem value={"0"} key={"0"} >
                                                Selecciona
                                            </MenuItem>
                                            {Object(
                                                valuesData?.Branches ?? []).map((data: ICatalogValue) => (
                                                    <MenuItem

                                                        key={data.folio}
                                                        value={data.folio}
                                                    >
                                                        {data.description}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText sx={{ color: "#d22e2e" }}>
                                            {errors.branchFolio}
                                        </FormHelperText>

                                    </Stack>
                                </Grid>
                                <Grid item xs={5.8} >
                                    <Stack>
                                        <Typography sx={{ ...TextSmallFont }}>Grupo empresarial</Typography>
                                        <Select
                                            sx={{ width: "100%" }}
                                            name="groupFolio"
                                            value={
                                                values.groupFolio
                                                    ? values.groupFolio
                                                    : "0"
                                            }
                                            onChange={handleChange}
                                            error={!!errors.groupFolio}
                                        >
                                            <MenuItem value={"0"} key={"0"} >
                                                Selecciona
                                            </MenuItem>
                                            {Object(
                                                valuesData?.Groups ?? []).map((data: ICatalogValue) => (
                                                    <MenuItem

                                                        key={data.folio}
                                                        value={data.folio}
                                                    >
                                                        {data.description}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText sx={{ color: "#d22e2e" }}>
                                            {errors.groupFolio}
                                        </FormHelperText>

                                    </Stack>
                                </Grid>
                                <Grid item xs={5.8} >
                                    <Stack>
                                        <Typography sx={{ ...TextSmallFont }}>Cliente</Typography>
                                        <Autocomplete
                                            loadingText="Buscando..."
                                            options={optionsClient ?? []}
                                            loading={loadingClient}
                                            noOptionsText="No se encontraron coincidencias"
                                            isOptionEqualToValue={(option, value) => option.folio === value.folio}
                                            getOptionLabel={(option: ModelPeople) => {

                                                return option.name + " " + option.lastName + " " + option.maternalLastName

                                            }}

                                            value={valueClient}
                                            onInputChange={(e, value) => {
                                                handleInputPeopleChange("client", value);
                                            }}
                                            onChange={(e, value) => {
                                                setLoadingClient(false)
                                                setFieldValue(
                                                    "creditCustomerName",
                                                    value !== null
                                                        ? `${value.name} ${value.lastName} ${value.maternalLastName}`
                                                        : null
                                                );
                                                setFieldValue(
                                                    "creditCustomerFolio", value ? value?.folio : null



                                                );

                                                setValueClient(value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Buscar"
                                                    name="creditCustomerFolio"
                                                    onChange={handleChange}
                                                    error={!!errors.creditCustomerFolio}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingClient ? (
                                                                    <CircularProgress

                                                                        sx={{ color: "#E5105D" }}
                                                                        size={20}
                                                                    />
                                                                ) : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                    helperText={errors.creditCustomerFolio?.toString()}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.folio}>
                                                    {option.name +
                                                        " " +
                                                        option.lastName +
                                                        " " +
                                                        option.maternalLastName}
                                                </li>
                                            )}

                                        />
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Stack direction='row' justifyContent='space-between'>
                                <Box display="flex">
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Box sx={{ pb: 1, pt: 2, pl: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={props.close}
                                            size="large"
                                            disableElevation

                                        >
                                            Cerrar
                                        </Button>
                                    </Box>
                                </Box>
                                <Box display="flex">
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Box sx={{ pb: 1, pt: 2, pr: 1 }}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            startIcon={<Save color={ColorPureWhite} />}
                                            size="large"
                                            disableElevation

                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                </Box>
                            </Stack>


                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog >
        </>
    )
}



export default NewFilterModal