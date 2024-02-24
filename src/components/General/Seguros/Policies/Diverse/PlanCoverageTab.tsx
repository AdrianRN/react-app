import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { useAlertContext } from "../../../../../context/alert-context";
import Policies from "../../../../../insuranceModels/policies";
import PolicyService from "../../../../../insuranceServices/policies.service";
import { useFormik } from "formik";
import MessageBar from "../../../../OuiComponents/Feedback/MessageBar";
import { Divider, Typography } from "../../../../OuiComponents/DataDisplay";
import { Grid, Stack } from "../../../../OuiComponents/Layout";
import { Button, InputAdornment, Select, TextField } from "../../../../OuiComponents/Inputs";
import { MenuItem } from "../../../../OuiComponents/Navigation";
import { ColorGray, ColorPink, ColorPureWhite, LinkLargeFont, LinkSmallFont, TextSmallFont, TextXSmallFont } from "../../../../OuiComponents/Theme";
import { Cancel, Complete, Delete, Edit, Save } from "../../../../OuiComponents/Icons";
import { GridActionsCellItem, GridColDef, GridColumnHeaderParams, GridEventListener, GridPreProcessEditCellProps, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { DataGrid } from "../../../../OuiComponents/DataGrid";
import CoveragePackage from "../../../../../insuranceModels/coveragepackage";
import CoveragePackagesService from "../../../../../insuranceServices/coveragepackages.service";
import CoveragePackagesXPolicyService from "../../../../../insuranceServices/coveragePackagesXPolicy.service";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import Constants from "../../../../../utils/Constants";
import policyHooks from "../../../../../hooks/policyHooks";
import { Dialog } from "../../../../OuiComponents/Feedback";
import policySumary from "../../../../../models/PolicySumary";
import { getCatalogValueFolio } from "../../../../../services/catalogvalue.service";
import CompaniesBranchesService from "../../../../../services/companiesbranches.service";
import receiptsGenerator from "../ReceiptsGenerator";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

interface policyDoneData {
    message: string;
    done: boolean;
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

function PlanCoverageTab(props: any) {
    console.log('props', props)
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
    const [rows, setRows] = React.useState<any[]>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [loading, setLoading] = React.useState(false);
    const [coveragePackages, setCoveragePackages] = React.useState<CoveragePackage[]>();
    const [coveragePackagesXPolicy, setCoveragePackagesXPolicy] = React.useState<any>();
    const [packageFolio, setPackageFolio] = React.useState<string>('')
    const [isSetUpDisabled, setSetUpIsDisabled] = React.useState(false)
    const [isSubmitDisabled, setSubmitDisabled] = React.useState(true)
    const [disabled, setDisabled] = React.useState(false)
    const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
    const [confirmContent, setConfirmContent] = React.useState("");
    const [openContent, setOpenContent] = React.useState(false);

    React.useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const policyResponse = props.policy ?? props.data.dataPolicy ?
            await PolicyService.getPoliciesByFolio(props.policy ?? props.data.dataPolicy) :
            undefined;

        if (policyResponse) {
            const coveragePackage =
                await CoveragePackagesService
                    .getByCompanySubBranchFolio(policyResponse.data.insuranceId, policyResponse.data.subBranchId);
            setCoveragePackages(coveragePackage.data ?? [])

            if (coveragePackage.data?.lenght > 1 && policyResponse.data.coveragePackageByPolicyFolio) {
                setPackageFolio(policyResponse.data.coveragePackageFolio)
                handleSetCoveragePckage(policyResponse.data.coveragePackageByPolicyFolio)
            }

            setDisabled(policyResponse.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)

            const responsePolicyDone = await policyHooks.getPolicyDone(policyResponse.data)
            setPolicyDone(responsePolicyDone)
        }
    };

    const handleClose = () => {
        setOpenContent(false);
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => {
        setRows(rows.filter((row) => row._id !== id));
    };

    const handleCancelClick = (id: GridRowId) => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row._id === id);

        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row._id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleCoveragePackageSetUpClick = () => {
        PolicyService.putCoveragePackageByFolio(props.policy ?? props.data.dataPolicy, packageFolio)
            .then((response: any) => {
                PolicyService.patchPolicyDamageCoveragePackage(response.data.folio, response.data.coveragePackageFolio)
                    .then((response: any) => {
                        handleSetCoveragePckage(response.data.coveragePackageByPolicyFolio)
                        fetchData()
                        props.onDataChange(props.policy)
                    })
                    .catch((e: Error) => {
                        setDataAlert(true, e.message, "error", autoHideDuration);
                    });
            })
            .catch((e: Error) => {
                setDataAlert(true, "No hay paquetes configurados para el subramo elegido.", "error", autoHideDuration);
            });
    }

    const handleSetCoveragePckage = (coveragePackageByPolicyFolio: any) => {
        setLoading(true)
        CoveragePackagesXPolicyService.getByFolio(coveragePackageByPolicyFolio)
            .then((response: any) => {
                setCoveragePackagesXPolicy(response.data)
                setRows(response.data.coverages)
                setSetUpIsDisabled(true)
                setSubmitDisabled(false)
                setLoading(false)
            })
            .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            });
    }

    /**
    * Stop enter submitting the form.
    * @param event Event triggered when the user presses a key.
    */
    const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (params, event) => {
        if (event.key === "Enter" || event.code === "Enter") {
            event.preventDefault()
        }
    };

    const onSubmit = (data: any) => {
        CoveragePackagesXPolicyService.putByFolio(data.folio, data)
            .then((response: any) => {
                setDataAlert(true, "La configuración de los montos se guardó con éxito.", "success", autoHideDuration);
                fetchData()
                props.onDataChange(props.policy);
            })
            .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            });
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
            });
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
        let branchName = valuesDataIndex[policy?.branchId]?.branch?.description ?? '';
        //Obtenemos la comision
        let branchCommission = Number(valuesDataIndex[policy?.branchId]?.branch?.commissionPercentage) ?? 0;
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
            branch: branchName, //'',
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
            field: "name",
            headerName: "Cobertura",
            flex: 1,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            renderCell: (params) => {
                if (coveragePackages) {
                    return <Typography sx={TextSmallFont}>{params.row.name}</Typography>;

                } else {
                    return null;
                }
            },
        },
        {
            field: "amount",
            headerName: "Monto",
            flex: 1,
            editable: !disabled,
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                const hasError = params.props.value.length < 3;
                return { ...params.props, error: hasError };
            },
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            renderEditCell: (params) => {
                return (
                    <TextField
                        sx={TextSmallFont}
                        value={Number(params.row.amount).toFixed(2)}
                        InputProps={{
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            const updatedValue = e.target.value
                            params.api.setEditCellValue({
                                id: params.id,
                                field: params.field,
                                value: Number(updatedValue)
                            })
                        }}
                    />
                )

            },
            renderCell: (params) => {
                return (<Typography sx={TextSmallFont}>{Number(params.row.amount).toFixed(2)}</Typography>);
            }
        },
        {
            field: "deductible",
            headerName: "Deducible",
            flex: 1,
            editable: !disabled,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            renderEditCell: (params) => {
                return (
                    <TextField
                        sx={TextSmallFont}
                        value={Number(params.row.deductible).toFixed(2)}
                        InputProps={{
                            inputComponent: NumericFormatCustom as any,
                            endAdornment: (
                                <InputAdornment position="end">%</InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            const updatedValue = e.target.value
                            params.api.setEditCellValue({
                                id: params.id,
                                field: params.field,
                                value: Number(updatedValue)
                            })
                        }}
                    />
                )

            },
            renderCell: (params) => {
                return <Typography sx={TextSmallFont}>{Number(params.row.deductible).toFixed(2)}</Typography>;
            },
        },
        {
            field: "conditions",
            headerName: "Condiciones",
            flex: 1,
            editable: !disabled,
            minWidth: 350,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            renderEditCell: (params) => {
                return (
                    <TextField
                        fullWidth
                        sx={TextSmallFont}
                        value={params.row.conditions}
                        multiline
                        onChange={(e) => {
                            const updatedValue = e.target.value
                            params.api.setEditCellValue({
                                id: params.id,
                                field: params.field,
                                value: updatedValue
                            })
                        }}
                    />
                )

            },
            renderCell: (params) => {
                return <Typography sx={TextSmallFont}>{params.row.conditions}</Typography>;
            },
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            type: 'actions',
            flex: 1,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Typography sx={{ ...LinkSmallFont, color: { ColorPureWhite } }}>{
                    params.colDef.headerName
                }
                </Typography>
            ),
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<Save color={ColorPink} />}
                            label="Save"
                            onClick={(e) => { e.preventDefault(); handleSaveClick(id) }}
                        />,
                        <GridActionsCellItem
                            icon={<Cancel color={ColorPink} />}
                            label="Cancel"
                            onClick={(e) => { e.preventDefault(); handleCancelClick(id) }}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        disabled={disabled}
                        icon={<Edit color={disabled ? ColorGray : ColorPink} />}
                        label="Edit"
                        onClick={(e) => { e.preventDefault(); handleEditClick(id) }}
                    />,
                    <GridActionsCellItem
                        disabled={disabled}
                        icon={<Delete color={disabled ? ColorGray : ColorPink} />}
                        label="Delete"
                        onClick={(e) => { e.preventDefault(); handleDeleteClick(id) }}
                    />,
                ];
            },
        }
    ];


    const { handleSubmit, handleChange, values, setFieldValue } = useFormik({
        initialValues: {
            _id: coveragePackagesXPolicy ? coveragePackagesXPolicy._id : '',
            policyFolio: coveragePackagesXPolicy ? coveragePackagesXPolicy.policyFolio : '',
            folio: coveragePackagesXPolicy ? coveragePackagesXPolicy.folio : '',
            insuranceCompanyFolio: coveragePackagesXPolicy ? coveragePackagesXPolicy.insuranceCompanyFolio : '',
            branch: coveragePackagesXPolicy ? coveragePackagesXPolicy.branch : '',
            subBranch: coveragePackagesXPolicy ? coveragePackagesXPolicy.subBranch : '',
            packageName: coveragePackagesXPolicy ? coveragePackagesXPolicy.packageName : '',
            coverages: rows ?? [],
            createdAt: coveragePackagesXPolicy ? coveragePackagesXPolicy.createdAt : '',
            createdBy: coveragePackagesXPolicy ? coveragePackagesXPolicy.createdBy : '',
            updatedAt: coveragePackagesXPolicy ? coveragePackagesXPolicy.updatedAt : '',
            updatedBy: coveragePackagesXPolicy ? coveragePackagesXPolicy.updatedBy : '',
            objectStatusId: coveragePackagesXPolicy ? coveragePackagesXPolicy.objectStatusId : ''
        },
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
            <Box component="form" onSubmit={handleSubmit}>
                <Typography sx={LinkLargeFont}>Paquete</Typography>
                <Stack direction="column" spacing={4}>
                    <Grid container rowSpacing={1}>
                        <Grid item xs={12} md={6} lg={4}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography sx={{ ...TextSmallFont }}>Paquete</Typography>
                                <Select
                                    sx={{ width: "100%" }}
                                    name="folio"
                                    defaultValue={0}
                                    value={packageFolio ? packageFolio : 0}
                                // disabled={isSetUpDisabled}
                                >
                                    <MenuItem key={0} value={0} disabled>
                                        Selecciona
                                    </MenuItem>
                                    {coveragePackages?.map((packages: any) => (
                                        <MenuItem
                                            key={packages.folio}
                                            value={packages.folio}
                                            onClick={() => setPackageFolio(packages.folio)}
                                        >
                                            {packages.packageName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} textAlign="center">
                            <Button
                                size="small"
                                onClick={handleCoveragePackageSetUpClick}
                                disabled={isSetUpDisabled}
                            >
                                Configurar Paquete
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Button
                                type="submit"
                                size="small"
                                disabled={disabled || isSubmitDisabled}
                            >
                                Guardar configuración
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <DataGrid
                        sx={{ borderRadius: 4 }}
                        loading={loading}
                        autoHeight
                        rowHeight={55}
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row._id}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        onCellKeyDown={handleCellKeyDown}
                        pageSizeOptions={[10, 20, 30, 40, 50]}

                    />
                </Stack>
            </Box>
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

export default PlanCoverageTab