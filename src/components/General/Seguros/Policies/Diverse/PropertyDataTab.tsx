import React from 'react'
import { Divider, Typography } from "../../../../OuiComponents/DataDisplay";
import {
    ColorGray,
    ColorPink,
    ColorPureWhite,
    LinkLargeFont,
    LinkSmallFont,
    TextSmallFont
} from "../../../../OuiComponents/Theme";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import {
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { Complete, Delete, Edit, Plus } from "../../../../OuiComponents/Icons";
import { Grid, Stack } from "../../../../OuiComponents/Layout";
import { DataGrid } from "../../../../OuiComponents/DataGrid";
import {
    Select,
    Button,
    TextField,
} from "../../../../OuiComponents/Inputs";
import { MenuItem } from "../../../../OuiComponents/Navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import PolicyService from "../../../../../insuranceServices/policies.service";
import ModelPolicy from "../../../../../insuranceModels/policies";
import { useAlertContext } from '../../../../../context/alert-context';
import MessageBar from '../../../../OuiComponents/Feedback/MessageBar';
import DamagePoliciesService from '../../../../../insuranceServices/damagePolicies.service';
import ModelSubBranch from '../../../../../models/SubBranch'
import SubBranchesService from '../../../../../services/subbranches.service';
import damagePolicy from '../../../../../insuranceModels/damagePolicy';
import Constants from '../../../../../utils/Constants';
import { CircularProgress, Dialog } from '../../../../OuiComponents/Feedback';
import policyHooks from '../../../../../hooks/policyHooks';
import policySumary from '../../../../../models/PolicySumary';
import { getCatalogValueFolio } from '../../../../../services/catalogvalue.service';
import CompaniesBranchesService from '../../../../../services/companiesbranches.service';
import receiptsGenerator from '../ReceiptsGenerator';

interface PropertyFormData {
    subBranchCatalog: ModelSubBranch;
    Policy: ModelPolicy;
}

interface policyDoneData {
    message: string;
    done: boolean;
}

function PropertyDataTab(props: any) {
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
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [valuesData, setValuesData] = React.useState<PropertyFormData>();
    const [disabled, setDisabled] = React.useState(false)
    const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
    const [confirmContent, setConfirmContent] = React.useState("");
    const [openContent, setOpenContent] = React.useState(false);

    React.useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const responseSubBranchesCatalog = await SubBranchesService.getByBranch(props.data.folioBranch);
        const responsePolicyData = props.policy ?? props.data.dataPolicy ?
            await PolicyService.getPoliciesByFolio(props.policy ?? props.data.dataPolicy) : undefined;

        if (responsePolicyData) {
            const responsePropertyData = await DamagePoliciesService.getDamagePoliciesByPolicy(props.policy ?? props.data.dataPolicy)
            setRows(responsePropertyData.data)

            setDisabled(responsePolicyData.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)

            const responsePolicyDone = await policyHooks.getPolicyDone(responsePolicyData.data)
            setPolicyDone(responsePolicyDone)
        }

        setValuesData({
            subBranchCatalog: responseSubBranchesCatalog.data ?? [],
            Policy: responsePolicyData ? responsePolicyData.data : responsePolicyData,
        });
        setLoading(false)
    };

    const handleClose = () => {
        setOpenContent(false);
    };

    const handleEditContactClick = (params: any) => {
        setValues({
            folio: params.row.folio,
            subcategory: params.row.subcategories[0].subcategory,
            series: params.row.subcategories[0].series
        })
    };

    const handleDeleteContactClick = (params: any) => {
        DamagePoliciesService.deleteByFolio(params.row.folio)
            .then((response: any) => {
                setDataAlert(true, setString() + " se ha eliminado existosamente.", "success", autoHideDuration);
                fetchData()
                setLoading(true);
                props.onDataChange(props.policy)
            })
            .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            });

    };

    const setString = () => {
        let label = null;

        if (Object(Constants.folioSubBranchSerie).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'La serie'
        } else if (Object(Constants.folioSubBranchLocation).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'La ubicación'
        } else if (Object(Constants.folioSubBranchDestination).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'El destino'
        } else {
            label = 'El texto'
        }

        return label.toString()

    }

    const setLabel = () => {
        let label = null;

        if (Object(Constants.folioSubBranchSerie).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'Serie'
        } else if (Object(Constants.folioSubBranchLocation).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'Ubicación'
        } else if (Object(Constants.folioSubBranchDestination).find((subBranches: any) => subBranches === valuesData?.Policy.subBranchId)) {
            label = 'Destino'
        } else {
            label = 'Texto'
        }

        return (
            <>
                {label ?? ' '}
            </>
        )
    }

    const onSubmit = (data: any) => {
        if (data.folio) {
            const request = {
                policyFolio: props.policy ?? props.data.dataPolicy,
                subcategories: [{
                    folio: data.folio,
                    subcategory: data.subcategory,
                    series: data.series
                }],
                objectStatusId: 1
            }

            DamagePoliciesService.putByFolio(data.folio, request)
                .then((response: any) => {
                    setDataAlert(true, setString() + " se ha actualizado existosamente.", "success", autoHideDuration);
                    fetchData()
                    props.onDataChange(response.data.policyFolio);
                    setLoading(true)
                })
        } else {
            const request = {
                policyFolio: props.policy ?? props.data.dataPolicy,
                subcategories: [{
                    folio: data.folio,
                    subcategory: data.subcategory,
                    series: data.series
                }],
                objectStatusId: 1
            }

            DamagePoliciesService.post(request)
                .then((response: any) => {
                    setDataAlert(true, setString() + " se ha guardado existosamente.", "success", autoHideDuration);
                    fetchData()
                    props.onDataChange(response.data.policyFolio);
                    setLoading(true)
                    resetForm()
                })
        }

    };

    const validateIssue = () => {
        PolicyService.checkIssuanceStatus(props.policy)
            .then((response: any) => {
                setConfirmContent(policyDone ? policyDone.message : "");
            })
            .catch((error) => {
                setPolicyDone({ done: false, message: '' })
                setConfirmContent(error.response.data.error.message);
            })
            .finally(() => {
                setOpenContent(true);
            })
    }

    const handleIssue = () => {
        PolicyService.issuancePolicy(props.policy)
            .then(async (response: any) => {
                setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
                await createReceipts(response.data);//===============================================================;
                props.onDataChange(props.policy);
                setTimeout(() => {
                    fetchData();
                }, 1000);
            }).catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            }).finally(() => {
                setOpenContent(false);
            });
    }
//===============================================================;
const createReceipts = async (policy: any) => {
    let fullname = policy?.clientName ?? 'NAME';
    //Obtenemos nombre del grupo
    const groupData = await getCatalogValueFolio(policy?.groups);
    let groupName = groupData?.data?.description ?? '';
    //Obtenemos los branches de la compania
    const companiData = await CompaniesBranchesService.getBranchesByCompanyFolio(policy?.insuranceId);
    const valuesDataIndex = companiData.data.reduce((acc: any, el: any) => {
      acc[el.branchId] = el;
      return acc;
    }, {});
    //Obtenemos el nombre del branch
    let branchName = valuesDataIndex[policy?.branchId]?.branch?.description??'';
    //Obtenemos la comision
    let branchCommission = Number(valuesDataIndex[policy?.branchId]?.branch?.commissionPercentage)??0;
    const sumary: policySumary = {
      policyFolio: policy.folio ?? props?.policy ?? "",
      createdAt: policy.issuanceDate, //Emisión
      startValidity: policy.startValidity, //Vigencia De
      endValidity: policy.endValidity, //Vigencia Hasta
      paymentMethod: policy.paymentFrequency, //Pago Anual CATALOG
      netPremium: policy.netPremium, //Prima Neta
      additionalCharge: policy.additionalCharge, //Recargo Monto
      surcharge: policy.financing, //surcharge, //Recargo %
      iva: policy.iva, //iva,                //Iva Monto
      rights: policy.rights, //Derecho Monto/GastoExpedicion
      settingOne: policy.settingOne ?? 0,
      settingTwo: policy.settingTwo ?? 0,
      //compania
      insuranceId: policy.insuranceId,
      insuranceCompany: policy.insuranceCompany,
      //grupo
      groups: policy.groups, //policyDataHook?.groups,
      groupsDescription: groupName,
      //cliente
      clientId: policy.clientId,
      clientName: fullname,//policy.clientName,
      //ramo
      branchId: policy.branchId,
      branch:   branchName, //'',
      totalPremium: policy.totalPremium, //Prima Total
      payReceipt: "",
      currency: policy.currency,
      policyType: "Seguros",
      sellerFolio: policy.salesPerson,
      noPolicy: policy.noPolicy,
      commissions: (policy.netPremium - (policy.settingOne + policy.settingTwo)) * (branchCommission ?? 0 / 100),
    };
    receiptsGenerator(sumary);
  };
  //===============================================================;
    const columns: GridColDef[] = [
        {
            field: "serie",
            headerName: "Serie",
            flex: 1,
            minWidth: 150,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    setLabel()
                }
                </Typography>
            ),
            renderCell: (params) => {
                return <Typography sx={TextSmallFont}>{params.row.subcategories[0].series}</Typography>;
            },
        },
        {
            field: "Acciones",
            headerName: "Acciones",
            type: "Action",
            flex: 1,
            minWidth: 100,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            renderCell: (params: any) => (
                <>
                    <IconButton disabled={disabled} onClick={() => handleEditContactClick(params)}>
                        <Edit color={disabled ? ColorGray : ColorPink} />
                    </IconButton>
                    <IconButton disabled={disabled} onClick={() => handleDeleteContactClick(params)} >
                        <Delete color={disabled ? ColorGray : ColorPink} />
                    </IconButton>
                </>
            ),
        },
    ];

    const initialValues = {
        folio: '',
        subcategory: valuesData?.Policy.subBranchId ?? '',
        series: ''
    };

    const validationSchema = Yup.object().shape({
        series: Yup.string().required("Este campo es requerido.")
    })

    const { handleSubmit, handleChange, errors, values, resetForm, setValues } = useFormik({
        initialValues,
        validationSchema,
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
                autoHideDuration={autoHideDuration} />
            {valuesData?.Policy ?
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography sx={LinkLargeFont}>Datos de los bienes</Typography>
                    <Stack direction="column" spacing={6}>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 2 }}>
                            <Grid item xs={12} md={4}>
                                <Stack direction="column" spacing={1}>
                                    <Typography sx={{ ...TextSmallFont }}>Subramo</Typography>
                                    <Select
                                        sx={{ width: "100%" }}
                                        defaultValue={0}
                                        name='subcategory'
                                        value={values.subcategory ? values.subcategory : 0}
                                        onChange={handleChange}
                                        disabled
                                    >
                                        <MenuItem key={0} value={0} disabled>
                                            Selecciona
                                        </MenuItem>
                                        {Object(valuesData?.subBranchCatalog ?? []).map(
                                            (data: any) => (
                                                <MenuItem key={data.folio} value={data.folio}>
                                                    {data.description}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="column" spacing={1}>
                                    <Typography sx={{ ...TextSmallFont }}>{setLabel()}</Typography>
                                    <TextField
                                        disabled={disabled}
                                        sx={{ height: 56 }}
                                        name='series'
                                        value={values.series}
                                        onChange={handleChange}
                                        error={!!errors.series}
                                        helperText={errors.series} />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4} alignSelf="flex-end" textAlign="center">
                                <Button
                                    disabled={disabled}
                                    type='submit'
                                    size="small"
                                    startIcon={<Plus color={ColorPureWhite} />}
                                >
                                    Agregar
                                </Button>
                            </Grid>
                        </Grid>
                        <Divider />
                        <DataGrid
                            sx={{ borderRadius: 4 }}
                            loading={loading}
                            rows={rows}
                            autoHeight
                            columns={columns}
                            getRowId={(row) => row.folio}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 20, 30, 40, 50]} />
                    </Stack>
                </Box> :
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography sx={LinkLargeFont}>Datos de los bienes</Typography>
                    <Stack direction="column" spacing={6}>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 2 }}>
                            <Grid item xs={12} textAlign='center'>
                                <CircularProgress
                                    sx={{ color: "#E5105D" }}
                                    size={70}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            }
            <Box paddingTop={3}>
                <Stack direction="row" spacing={1} justifyContent="end">
                    <Button
                        disabled={!props.policy || disabled || disabledHypertext}
                        endIcon={<Complete color={ColorPureWhite} />}
                        onClick={validateIssue}
                    >
                        Emitir Póliza
                    </Button>
                </Stack>
            </Box>
            <Dialog open={openContent} onClose={handleClose}>
                <DialogTitle>Confirmar</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmContent}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {props.policy && policyDone?.done ? (
                        <>
                            <Button size="small" variant="text" onClick={handleClose}>
                                No
                            </Button>
                            <Button
                                size="small"
                                variant="text"
                                onClick={handleIssue}
                            >
                                Si
                            </Button>
                        </>
                    ) : (
                        <Button size="small" variant="text" onClick={handleClose}>
                            Regresar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PropertyDataTab