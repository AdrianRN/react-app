import React, { useRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { AccordionDetails, AccordionSummary, Autocomplete, Box, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel } from '@mui/material';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { Grid, Stack } from '../../../OuiComponents/Layout';
import { Chip, Typography } from '../../../OuiComponents/DataDisplay';
import { ColorPink, ColorPureWhite, LinkLargeFont, TextSmallFont, TextXSmallBoldFont } from '../../../OuiComponents/Theme';
import { Button, Fab, InputAdornment, Select, TextField } from '../../../OuiComponents/Inputs';
import { MenuItem } from '../../../OuiComponents/Navigation';
import { Accordion } from '../../../OuiComponents/Surfaces';
import catalogValueService from '../../../../services/catalogvalue.service';
import { useFormik } from 'formik';
import Constants from '../../../../utils/Constants';
import { Complete } from '../../../OuiComponents/Icons';
import CacheService from '../../../../services/cache.service';
import IBonds from '../../../../models/Bonds';
import bondService from '../../../../services/bonds.service';
import CatalogValue from '../../../../models/CatalogValue';
import FormatsData from '../../../../utils/Formats.Data';
import CacheCatalogValue from '../../../../models/CacheCatalogValue';
import bondEndorsementService from '../../../../services/bondEndorsement.service';
import { useAlertContext } from '../../../../context/alert-context';
import MessageBar from '../../../OuiComponents/Feedback/MessageBar';
import ModelPeople from "../../../../models/People";
import PeopleService from '../../../../services/people.service';
import { CircularProgress, Dialog } from '../../../OuiComponents/Feedback';

interface EndorsementCatalogsData {
    bond: IBonds,
    bondEndorsement: any,
    endorsementType: any[],
    rateIva: number,
    statusCatalog: CacheCatalogValue,
    projectCatalog: CacheCatalogValue
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
                decimalSeparator={"."}
                decimalScale={2}
            />
        );
    }
);

function EndorsementTab(props: any) {
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    const [bondEndorsementFolio, setBondEndorsementFolio] = React.useState(props.bondEndorsementFolio ?? '')
    const [valuesData, setValuesData] = React.useState<EndorsementCatalogsData>()
    // const [endorsementMovementType, setEndorsementMovementType] = React.useState<any[]>()
    const [change, setChange] = React.useState(true)
    const [expanded, setExpanded] = React.useState(false);
    const [confirmContent, setConfirmContent] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [valueDebtor, setValueDebtor] = React.useState<any | null>(null);
    const [optionsDebtor, setOptionsDebtor] = React.useState<ModelPeople[]>([]);
    const [loadingDebtor, setLoadingDebtor] = React.useState(false);

    const [openDebtor, setOpenDebtor] = React.useState(false);
    const [valueBeneficiary, setValuesBeneficiary] = React.useState<any | null>(
        null
    );
    const [optionsBeneficiary, setOptionsBeneficiary] = React.useState<
        ModelPeople[]
    >([]);
    const [loadingBeneficiary, setLoadingBeneficiary] = React.useState(false);
    const [openBeneficiary, setOpenBeneficiary] = React.useState(false);
    const [valueSalesPerson, setValuesSalesPerson] = React.useState<any | null>(
        null
    );
    const [optionsSalesPerson, setOptionsSalesPerson] = React.useState<
        ModelPeople[]
    >([]);
    const [loadingSalesPerson, setLoadingSalesPerson] = React.useState(false);
    const [openSalesPerson, setOpenSalesPerson] = React.useState(false);
    const resumen = useRef()
    const registro = useRef()

    React.useEffect(() => {
        getData()

    }, [change])

    const [endExecutionPeriod, setEndExecutionPeriod] = React.useState('');
    const getData = async () => {
        const responseBond = await bondService.getByFolio(props.bondFolio)
        const responseBondEndorsement = bondEndorsementFolio ? await bondEndorsementService.getByFolio(bondEndorsementFolio)
            : undefined
        const responseIvaCatalog = await CacheService.getByFolioCatalog(Constants.tasaIVACatalogFolio)
        const responseStatusCatalog = await CacheService.getByFolioCatalog(Constants.statusCatalogFolio)
        const responseEndorsementTypeCatalog = await catalogValueService.getCatalogValueByCatalogId(
            Constants.bondEndorsementTypeCatalogFolio
        )
        const responseCatalogProject = await CacheService.getByFolioCatalog(
            Constants.projectCatalogFolio
        )

        setValuesData({
            bond: responseBond.data,
            bondEndorsement: responseBondEndorsement ? responseBondEndorsement.data : responseBondEndorsement,
            endorsementType: responseEndorsementTypeCatalog.data,
            rateIva: responseBond.data ? Number(Object(responseIvaCatalog.data.values ?? [])
                .find((i: CatalogValue) => i.folio === responseBond.data.rateIva).description) : 16,
            statusCatalog: responseStatusCatalog.data,
            projectCatalog: responseCatalogProject.data
        })

        //valuesData.bond.endExecutionPeriod
        //FormatsData.stringDateFormat
        //console.log(responseBond.data.endExecutionPeriod)
        setEndExecutionPeriod(responseBond.data.endExecutionPeriod ?? "");
        if (responseBondEndorsement?.data) {
            //handleEndorsementTypeSubcatalog(responseBondEndorsement.data.endorsementType)
            
            if (responseBondEndorsement.data.endorsementType === Constants.folioTextBondEndorsementMovType) {
                
                const debtor = await PeopleService.getById(responseBondEndorsement.data.bondData.debtor);
                const beneficiary = await PeopleService.getById(
                    responseBondEndorsement.data.bondData.beneficiary
                );
                const salesPerson = await PeopleService.getById(
                    responseBondEndorsement.data.bondData.salesperson
                );
                setValueDebtor(debtor.data);
                setValuesBeneficiary(beneficiary.data);
                setValuesSalesPerson(salesPerson.data);
            }

            Object(responseStatusCatalog.data.values)
                .filter((s: CatalogValue) => s.description === Constants.statusActive)
                .map((status: any) => {
                    if (status.folio === responseBondEndorsement.data.status) {
                        setDisabled(true);
                    }
                });
        } else {
            const debtor = await PeopleService.getById(responseBond.data.debtor);
            const beneficiary = await PeopleService.getById(
                responseBond.data.beneficiary
            );
            const salesPerson = await PeopleService.getById(
                responseBond.data.salesperson
            );
            setValueDebtor(debtor.data);
            setValuesBeneficiary(beneficiary.data);
            setValuesSalesPerson(salesPerson.data);
        }

        setChange(false)
        setExpanded(true)
    }

    // const handleEndorsementTypeSubcatalog = (folio: string) => {
    //     setEndorsementMovementType(valuesData?.endorsementType.find(t => t.folio === folio).subCatalogsValue)
    // }

    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };

    const BackToTopButton = (): React.ReactNode => {
        const scrollHandler = (ref: any) => {
            window.scrollTo({
                top: ref.current.offsetTop, behavior: "smooth"
            })
        }

        return (
            <>
                <Fab
                    aria-label="add"
                    sx={{
                        position: 'fixed', bottom: '50px', right: '50px', height: '50px', width: '50px',
                        "&.MuiFab-root": {
                            bgcolor: ColorPink,
                            color: ColorPureWhite
                        }

                    }}
                    onClick={() => {
                        scrollHandler(resumen)
                    }}>
                    <KeyboardArrowDownSharpIcon />
                </Fab>
            </>
        )
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenDialogConfirm = () => {
        setConfirmContent('Los datos modificaran la fianza actual, ¿Desea emitir el endoso?')
        setOpen(true)
    }

    const handleConfirmActive = () => {
        setFieldValue('status', Constants.statusActiveFolio)
        submitForm()
    }

    const onSubmit = (data: any) => {
        if (bondEndorsementFolio) {
            bondEndorsementService.put(bondEndorsementFolio, data)
                .then((response: any) => {
                    setDataAlert(true, "El endoso se ha actualizado con éxito.", "success", autoHideDuration);
                    setChange(true)
                })
        } else {
            bondEndorsementService.post(props.bondFolio, data)
                .then((response: any) => {
                    setBondEndorsementFolio(response.data.endorsementFolio)

                    if (values.endorsementType != Constants.folioConsentBondEndorsementMovType) {
                        bondEndorsementService.put(response.data.endorsementFolio, data)
                            .then((response: any) => {
                                setDataAlert(true, "El endoso se ha generado con éxito.", "success", autoHideDuration);
                                setChange(true)
                            })
                    }

                    setChange(true)
                })
        }
        setOpen(false);
    }

    const handleInputPeopleChange = async (name: any, value: any) => {
        setTimeout(async () => {
            if (value) {
                let response = null;

                if (name === "debtor" && !valueDebtor) {
                    setOpenDebtor(true);
                    setLoadingDebtor(true);
                    response = await PeopleService.getDebtorFilterHealt(value, Constants.amountScoreDebtor);
                } else if (name === "beneficiary" && !valueBeneficiary) {
                    setOpenBeneficiary(true);
                    setLoadingBeneficiary(true);
                    response = await PeopleService.getAllByName(value);
                } else {
                    if (name === "salesperson" && !valueSalesPerson) {
                        setOpenSalesPerson(true);
                        setLoadingSalesPerson(true);
                        response = await PeopleService.getSellers(value);
                    }
                }

                if (response == null) {
                    if (name === "debtor") {
                        setOptionsDebtor([]);
                        setLoadingDebtor(false);
                    } else if (name === "beneficiary") {
                        setOptionsBeneficiary([]);
                        setLoadingBeneficiary(false);
                    } else {
                        setOptionsSalesPerson([]);
                        setLoadingSalesPerson(false);
                    }

                    return;
                }

                const list = response.data;

                list.map((row: { [key: string]: any }) => {
                    const columns = Object.keys(row).map((column) => {
                        if (column === "name") {
                            const lastName = row["lastName"] || "";
                            const maternalLastName = row["maternalLastName"] || "";
                            const fullName =
                                `${row[column]} ${lastName} ${maternalLastName}`.trim();
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

                if (name === "debtor") {
                    setOptionsDebtor(list);
                    setLoadingDebtor(false);
                } else if (name === "beneficiary") {
                    setOptionsBeneficiary(list);
                    setLoadingBeneficiary(false);
                } else {
                    setOptionsSalesPerson(list);
                    setLoadingSalesPerson(false);
                }
            } else {
                if (name === "debtor") {
                    setOptionsDebtor([]);
                    setLoadingDebtor(false);
                } else if (name === "beneficiary") {
                    setOptionsBeneficiary([]);
                    setLoadingBeneficiary(false);
                } else {
                    setOptionsSalesPerson([]);
                    setLoadingSalesPerson(false);
                }
            }
        }, 500);
    };

    const getMovementFieldset = (folio: string): React.ReactNode => {
        let movementFieldSet = null

        switch (folio) {
            case Constants.folioAmountIncreaseBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='amount'
                                    value={values.amount ? Number(values.amount) : 0}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Iva
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='iva'
                                    value={
                                        (values.iva = Number((Number(values.amount) * (valuesData?.rateIva ? valuesData.rateIva : 16) /
                                            100
                                        ).toFixed(2)))
                                    }
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto Total
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='totalAmount'
                                    value={values.totalAmount = Number(values.amount) + Number(values.iva)}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioAmountDecreaseBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='amount'
                                    value={values.amount ? Number(values.amount) : 0}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Iva
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='iva'
                                    value={
                                        (values.iva = Number((Number(values.amount) * (valuesData?.rateIva ? valuesData.rateIva : 16) /
                                            100
                                        ).toFixed(2)))
                                    }
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto Total
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='totalAmount'
                                    value={values.totalAmount = Number(values.amount) + Number(values.iva)}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioAmountIncreaseAndExtensionBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='amount'
                                    value={values.amount ? Number(values.amount) : 0}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Iva
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='iva'
                                    value={
                                        (values.iva = Number((Number(values.amount) * (valuesData?.rateIva ? valuesData.rateIva : 16) /
                                            100
                                        ).toFixed(2)))
                                    }
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto Total
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    name='totalAmount'
                                    value={values.totalAmount = Number(values.amount) + Number(values.iva)}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Plazo de Ejecución
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    type="date"
                                    name='deadlineDate'
                                    value={values.deadlineDate}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: FormatsData.stringDateFormat(values.deadlineDate)
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioAmountDecreaseAndExtensionBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='amount'
                                    value={values.amount ? Number(values.amount) : 0}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Iva
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='iva'
                                    value={
                                        (values.iva = Number((Number(values.amount) * (valuesData?.rateIva ? valuesData.rateIva : 16) /
                                            100
                                        ).toFixed(2)))
                                    }
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Monto Total
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    error
                                    name='totalAmount'
                                    value={values.totalAmount = Number(values.amount) + Number(values.iva)}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position='start'>$ -</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Plazo de Ejecución
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    type="date"
                                    name='deadlineDate'
                                    value={values.deadlineDate}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: FormatsData.stringDateFormat(values.deadlineDate)//FormatsData.stringDateFormat(values.deadlineDate)
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioExtensionEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Plazo de Ejecución
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    type="date"
                                    name='deadlineDate'
                                    value={values.deadlineDate}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: FormatsData.stringDateFormat(values.startDate),
                                        max: FormatsData.stringDateFormat(values.endDate)
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioTextBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fiado
                                </Typography>
                                <Autocomplete
                                    disabled={disabled}
                                    noOptionsText="No se encontraron coincidencias"
                                    loadingText="Buscando..."
                                    options={optionsDebtor ?? []}
                                    loading={loadingDebtor}
                                    isOptionEqualToValue={(option, value) =>
                                        option.folio === value.folio
                                    }
                                    getOptionLabel={(option: ModelPeople) => {
                                        return (
                                            option.name +
                                            " " +
                                            option.lastName +
                                            " " +
                                            option.maternalLastName
                                        );
                                    }}
                                    onInputChange={(e, value) => {
                                        handleInputPeopleChange("debtor", value);
                                    }}
                                    onChange={(e, value) => {
                                        setLoadingDebtor(false);
                                        setFieldValue("debtor", value ? value?.folio : values.debtor);
                                        setValueDebtor(value);
                                    }}
                                    value={valueDebtor}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingDebtor ? (
                                                            <CircularProgress
                                                                sx={{ color: "#E5105D" }}
                                                                size={20}
                                                            />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
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
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Beneficiario
                                </Typography>
                                <Autocomplete
                                    disabled={disabled}
                                    noOptionsText="No se encontraron coincidencias"
                                    loadingText="Buscando..."
                                    options={optionsBeneficiary ?? []}
                                    loading={loadingBeneficiary}
                                    isOptionEqualToValue={(option, value) =>
                                        option.folio === value.folio
                                    }
                                    getOptionLabel={(option: ModelPeople) => {
                                        return (
                                            option.name +
                                            " " +
                                            option.lastName +
                                            " " +
                                            option.maternalLastName
                                        );
                                    }}
                                    onInputChange={(e, value) => {
                                        handleInputPeopleChange("beneficiary", value);
                                    }}
                                    onChange={(e, value) => {
                                        setLoadingBeneficiary(false);
                                        setFieldValue("beneficiary", value ? value?.folio : values.beneficiary);
                                        setValuesBeneficiary(value);
                                    }}
                                    value={valueBeneficiary}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingBeneficiary ? (
                                                            <CircularProgress
                                                                sx={{ color: "#E5105D" }}
                                                                size={20}
                                                            />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
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
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Vendedor
                                </Typography>
                                <Autocomplete
                                    disabled={disabled}
                                    noOptionsText="No se encontraron coincidencias"
                                    loadingText="Buscando..."
                                    options={optionsSalesPerson ?? []}
                                    loading={loadingSalesPerson}
                                    isOptionEqualToValue={(option, value) =>
                                        option.folio === value.folio
                                    }
                                    getOptionLabel={(option: ModelPeople) => {
                                        return (
                                            option.name +
                                            " " +
                                            option.lastName +
                                            " " +
                                            option.maternalLastName
                                        );
                                    }}
                                    onInputChange={(e, value) => {
                                        handleInputPeopleChange("salesperson", value);
                                    }}
                                    onChange={(e, value) => {
                                        setLoadingSalesPerson(false);
                                        setFieldValue("salesperson", value ? value?.folio : values.salesPerson);
                                        setValuesSalesPerson(value);
                                    }}
                                    value={valueSalesPerson}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingSalesPerson ? (
                                                            <CircularProgress
                                                                sx={{ color: "#E5105D" }}
                                                                size={20}
                                                            />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
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
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Relacionado a
                                </Typography>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    placeholder="Relacionado a"
                                    name='relatedTo'
                                    value={values.relatedTo}
                                    onChange={handleChange}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} alignSelf="center">
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Proyecto
                                </Typography>
                                <Autocomplete
                                    disabled={disabled}
                                    multiple
                                    options={Object(
                                        valuesData?.projectCatalog.values ?? []
                                    ).map((option: CatalogValue) => option.description)}
                                    freeSolo
                                    renderTags={(value: readonly string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    value={values.project ? values.project.split(",") : []}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="project"
                                            placeholder="Proyecto"
                                        />
                                    )}
                                    onChange={(event, value) => {
                                        if (value) {
                                            setFieldValue("project", value.toString());
                                        }
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            default:
                movementFieldSet = undefined
                break;
        }

        return (
            <>
                {movementFieldSet ?
                    <Box component='fieldset' padding={3} border='1px solid #E8E8E8' height={250}>
                        <legend>
                            <Typography sx={{ ...TextXSmallBoldFont, color: ColorPink }}>
                                {values.endorsementType === Constants.folioTextBondEndorsementMovType ? 'DATOS DE FIANZA' : 'MOVIMIENTO'}
                            </Typography>
                        </legend>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                            {movementFieldSet}
                        </Grid>
                    </Box> : <></>
                }
            </>
        )
    }

    const getSummary = (folio: string): React.ReactNode => {
        let movementFieldSet = null

        switch (folio) {
            case Constants.folioAmountIncreaseBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA NETA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.netPremium ? valuesData.bond.netPremium : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    IVA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.iva ? valuesData.bond.iva : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA TOTAL ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.totalAmount ? valuesData.bond.totalAmount : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA NETA NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.netPremium}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    IVA NUEVO:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.iva}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA TOTAL NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.totalAmount}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                            </Stack>
                        </Grid>     
                    </>
                break;
            case Constants.folioAmountIncreaseAndExtensionBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA NETA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.netPremium ? valuesData.bond.netPremium : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    IVA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.iva ? valuesData.bond.iva : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA TOTAL ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.totalAmount ? valuesData.bond.totalAmount : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA NETA NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.netPremium}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    IVA NUEVO:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.iva}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA TOTAL NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.totalAmount}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                            maxLength: 9, // Establece el límite de caracteres
                                          },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    FECHA PLAZO ACTUAL:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={FormatsData.stringDateFormat(
                                        valuesData?.bond.endExecutionPeriod ?
                                            valuesData.bond.endExecutionPeriod : Date().toString())}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    FECHA PLAZO NUEVA:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={
                                        FormatsData.stringDateFormat(
                                            valuesData?.bondEndorsement.deadlineDate ?? Date().toString()
                                        )
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioAmountDecreaseBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA NETA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.netPremium ? valuesData.bond.netPremium : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    IVA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.iva ? valuesData.bond.iva : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA TOTAL ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.totalAmount ? valuesData.bond.totalAmount : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA NETA NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.netPremium}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    IVA NUEVO:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.iva}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA TOTAL NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.totalAmount}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>                       
                    </>
                break;
            case Constants.folioAmountDecreaseAndExtensionBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA NETA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.netPremium ? valuesData.bond.netPremium : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    IVA ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.iva ? valuesData.bond.iva : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    PRIMA TOTAL ACTUAL:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bond.totalAmount ? valuesData.bond.totalAmount : ''}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} alignSelf='center'>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA NETA NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.netPremium}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink}}>
                                    IVA NUEVO:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.iva}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    PRIMA TOTAL NUEVA:
                                </InputLabel>
                                <TextField
                                    value={valuesData?.bondEndorsement.bondData.totalAmount}
                                    InputProps={{
                                        readOnly: true,
                                        inputComponent: NumericFormatCustom as any,
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {
                                          maxLength: 12, // Establece el límite de caracteres
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    FECHA PLAZO ACTUAL:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={FormatsData.stringDateFormat(
                                        valuesData?.bond.endExecutionPeriod ?
                                            valuesData.bond.endExecutionPeriod : Date().toString())}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    FECHA PLAZO NUEVA:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={
                                        FormatsData.stringDateFormat(
                                            valuesData?.bondEndorsement.bondData.endExecutionPeriod ?? Date().toString()

                                        )
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioExtensionEndorsementMovType:
                movementFieldSet =
                    <>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont }}>
                                    FECHA PLAZO ACTUAL:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={FormatsData.stringDateFormat(
                                        valuesData?.bond.endExecutionPeriod ?
                                            valuesData.bond.endExecutionPeriod : Date().toString())}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction='column' spacing={1}>
                                <InputLabel sx={{ ...TextSmallFont, color: ColorPink }}>
                                    FECHA PLAZO NUEVA:
                                </InputLabel>
                                <TextField
                                    type='date'
                                    value={
                                        FormatsData.stringDateFormat(
                                            valuesData?.bondEndorsement.bondData ?
                                            valuesData?.bondEndorsement.bondData.endExecutionPeriod  : Date().toString()
                                        )
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </>
                break;
            case Constants.folioTextBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Typography sx={{ ...TextXSmallBoldFont, color: ColorPink }}>
                            Los campos modificados en la sección datos de fianza se actualizarán en la fianza
                        </Typography>
                    </>
                break;
            case Constants.folioConsentBondEndorsementMovType:
                movementFieldSet =
                    <>
                        <Typography sx={{ ...TextXSmallBoldFont, color: ColorPink }}>
                            Los campos modificados en la sección datos de fianza se actualizarán en la fianza
                        </Typography>
                    </>
                break;
            default:
                movementFieldSet = <></>
                break;
        }

        return (
            <>
                {movementFieldSet ?
                    <Box ref={resumen}>
                        <Accordion defaultExpanded disableGutters>
                            <AccordionSummary expandIcon={<KeyboardArrowDownSharpIcon fontSize='large' />}>
                                <Typography sx={{ ...LinkLargeFont }}>
                                    RESUMEN MOVIMIENTO
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box component='fieldset' padding={3} border='1px solid #E8E8E8'>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                                        {movementFieldSet}
                                    </Grid>
                                </Box>
                                <Box padding={1} textAlign='right'>
                                    <Button disabled={disabled} endIcon={<Complete color={ColorPureWhite} />} onClick={handleOpenDialogConfirm}>
                                        Emitir Endoso
                                    </Button>
                                </Box>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}

                                >
                                    <DialogTitle>
                                        Confirmar
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {confirmContent}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button size='small' variant='text' onClick={handleClose}>No</Button>
                                        <Button size='small' variant='text' onClick={handleConfirmActive}>Si</Button>
                                    </DialogActions>
                                </Dialog>
                                {BackToTopButton()}
                            </AccordionDetails>
                        </Accordion>
                    </Box> : <></>
                }
            </>
        )
    }

    const initialValues = {
        endorsementType: valuesData?.bondEndorsement ? valuesData.bondEndorsement.endorsementType : "",
        // endorsementMovementType: valuesData?.bondEndorsement ? valuesData.bondEndorsement.endorsementMovementType : "",
        startDate: FormatsData.stringDateFormat(valuesData?.bond.startCoverage ? valuesData.bond.startCoverage : new Date().toString()),
        endDate: FormatsData.stringDateFormat(valuesData?.bond ? valuesData.bond.endCoverage :
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString()),
        deadlineDate: FormatsData.stringDateFormat(valuesData?.bond ? valuesData.bond.endExecutionPeriod : new Date().toString()),
        amount: valuesData?.bondEndorsement ? valuesData.bondEndorsement.amount : 0,
        iva: valuesData?.bondEndorsement ? valuesData.bondEndorsement.iva : 0,
        totalAmount: valuesData?.bondEndorsement ? valuesData.bondEndorsement.totalAmount : 0,
        concept: valuesData?.bondEndorsement ? valuesData.bondEndorsement.concept : "",
        observations: valuesData?.bondEndorsement ? valuesData.bondEndorsement.observations : "",
        status: valuesData?.bondEndorsement ? valuesData.bondEndorsement.status : Constants.statusPendingFolio,
        bondFolio: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondFolio : valuesData?.bond.folio,
        debtor: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondData.debtor : valuesData?.bond.debtor,
        salesPerson: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondData.salesperson : valuesData?.bond.salesperson,
        beneficiary: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondData.beneficiary : valuesData?.bond.beneficiary,
        relatedTo: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondData.relatedTo : valuesData?.bond.relatedTo,
        project: valuesData?.bondEndorsement ? valuesData.bondEndorsement.bondData.project : valuesData?.bond.project
    }

    const { handleSubmit, handleChange, values, setFieldValue, submitForm } = useFormik({
        initialValues,
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
            <Box>
                <Stack direction="column" spacing={3}>
                    <Box ref={registro} component="form" onSubmit={handleSubmit}>
                        <Accordion expanded={expanded} onChange={handleAccordionChange} disableGutters>
                            <AccordionSummary expandIcon={<KeyboardArrowDownSharpIcon fontSize='large' />}>
                                <Typography sx={{ ...LinkLargeFont }}>
                                    DATOS ENDOSO
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box component='fieldset' padding={3} border='1px solid #E8E8E8'>
                                    <legend>
                                        <Typography
                                            sx={{ ...TextXSmallBoldFont, color: ColorPink }}
                                        >
                                            GENERALES
                                        </Typography>
                                    </legend>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                                        <Grid item xs={12} sm={6} md={3} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Tipo endoso
                                                </Typography>
                                                <Select
                                                    disabled={valuesData?.bondEndorsement ? true : false}
                                                    sx={{ width: "100%" }}
                                                    name='endorsementType'
                                                    defaultValue={0}
                                                    value={values.endorsementType ? values.endorsementType : 0}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem key={0} value={0} disabled>
                                                        Selecciona
                                                    </MenuItem>
                                                    {Object(valuesData?.endorsementType ?? [])
                                                        .filter((t: any) => t.folio != Constants.folioA0BondEndorsementType)
                                                        .map(
                                                            (data: any) => (
                                                                <MenuItem
                                                                    // onClick={() => {
                                                                    //     setFieldValue('endorsementMovementType', '');
                                                                    //     handleEndorsementTypeSubcatalog(data.folio);
                                                                    // }}
                                                                    key={data.folio} value={data.folio}>
                                                                    {data.description}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                </Select>
                                            </Stack>
                                        </Grid>
                                        {/* <Grid item xs={12} sm={6} md={3} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Tipo movimiento
                                                </Typography>
                                                <Select
                                                    disabled={disabled}
                                                    sx={{ width: "100%" }}
                                                    name='endorsementMovementType'
                                                    defaultValue={0}
                                                    value={endorsementMovementType && values.endorsementMovementType ? values.endorsementMovementType : 0}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem key={0} value={0} disabled>
                                                        Selecciona
                                                    </MenuItem>
                                                    {Object(endorsementMovementType ?? []).map((data: any) => (
                                                        <MenuItem
                                                            key={data.folio} value={data.folio}>
                                                            {data.description}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Stack>
                                        </Grid> */}
                                        <Grid item xs={12} sm={6} md={3} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Inicio de vigencia
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    name='startDate'
                                                    value={values.startDate}
                                                    disabled
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Fin de vigencia
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    name='endDate'
                                                    value={values.endDate}
                                                    disabled
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} alignSelf="top">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Concepto
                                                </Typography>
                                                <TextField
                                                    disabled={disabled}
                                                    fullWidth
                                                    placeholder="Concepto"
                                                    name='concept'
                                                    value={values.concept}
                                                    onChange={handleChange}
                                                    inputProps={{ maxLength: 150 }}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Observaciones
                                                </Typography>
                                                <TextField
                                                    disabled={disabled}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    placeholder="Observaciones"
                                                    name='observations'
                                                    value={values.observations}
                                                    onChange={handleChange}
                                                    inputProps={{ maxLength: 1000 }}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                                {getMovementFieldset(values.endorsementType)}
                                <Box padding={1} textAlign='right'>
                                    <Button disabled={disabled} endIcon={<Complete color={ColorPureWhite} />} type='submit'>
                                        {valuesData?.bondEndorsement ? 'Actualizar Endoso' : 'Registrar Endoso'}
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        {valuesData?.bondEndorsement ?
                            getSummary(valuesData?.bondEndorsement.endorsementType) : <></>
                        }
                    </Box>
                </Stack>
            </Box>
        </>
    )
}

export default EndorsementTab