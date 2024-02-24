import React, { useState } from 'react'
import { useAlertContext } from '../../../../context/alert-context';
import { useNavigate, useParams } from 'react-router-dom';
import IBonds from '../../../../models/Bonds';
import MessageBar from '../../../OuiComponents/Feedback/MessageBar';
import Title from '../../Title/Title';
import { Paper } from '../../../OuiComponents/Surfaces';
import { Box, Stack } from '../../../OuiComponents/Layout';
import { Button, TextField } from '../../../OuiComponents/Inputs';
import { Avatar, Typography } from '../../../OuiComponents/DataDisplay';
import { ColorError, ColorGray, ColorGrayDark, ColorGrayDark2, ColorGreen, ColorPink, ColorWhite, TextSmallFont } from '../../../OuiComponents/Theme';
import { Delete, Edit, Plus, Search } from '../../../OuiComponents/Icons';
import { DataGrid } from '../../../OuiComponents/DataGrid';
import { Autocomplete, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { SIZE_WEB_URL } from '../../../../enviroment/enviroment';
import bondService from '../../../../services/bonds.service';
import bondEndorsementService from '../../../../services/bondEndorsement.service';
import FormatsData from '../../../../utils/Formats.Data';
import catalogValueService from '../../../../services/catalogvalue.service';
import Constants from '../../../../utils/Constants';
import CacheCatalogValue from '../../../../models/CacheCatalogValue';
import CacheService from '../../../../services/cache.service';
import CatalogValue from '../../../../models/CatalogValue';
import PeopleService from '../../../../services/people.service';
import { CircularProgress } from '../../../OuiComponents/Feedback';

interface BondEndorsementCatalogs {
    endorsementType: any[],
    statusCatalog: CacheCatalogValue;
}

function Endorsement() {
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();
    const navigate = useNavigate();
    const { bondId } = useParams<string>();
    const [image, setImage] = useState<string | null>(null);
    const [bondEndorsement, setBondEndorsement] = React.useState<any[]>([])
    const [bond, setBond] = React.useState<IBonds | undefined>(undefined)
    const [valuesData, setValuesData] = React.useState<BondEndorsementCatalogs>()
    const [pendingBondsEndorsement, setPendingBondsEndorsement] = React.useState(false);
    const [valueDebtor, setValueDebtor] = React.useState<any | null>(null);

    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<[]>([]);
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (bondId) {
            getBondData(bondId)
            getBondEndorsementData(bondId)
        }

        fetchCatalogsData()
    }, []);

    const handleInputChange = async (value: any) => {
        setTimeout(async () => {
            if (value) {
                setLoading(true);
                const response = await bondService.getBondByClientOrPolicyNumber(value, 2)
                if (response.data === null) {
                    setOptions([])
                    setLoading(false)
                    return
                }

                const list = response.data
                setOptions(list)
                setLoading(false)
            } else {
                setOptions([]);
                setOpen(false)
            }
        }, 500)
    }

    const fetchCatalogsData = async () => {
        const responseEndorsementTypeCatalog = await catalogValueService.getCatalogValueByCatalogId(Constants.bondEndorsementTypeCatalogFolio)
        const responseEndorsementTypeCatalogIndexed = (responseEndorsementTypeCatalog.data).reduce((acc: any,el:any)=>{
            acc[el.folio]=el
            return acc
        },{})
        const responseStatusCatalog = await CacheService.getByFolioCatalog(Constants.statusCatalogFolio)

        setValuesData({
            endorsementType: responseEndorsementTypeCatalogIndexed,
            statusCatalog: responseStatusCatalog.data
        })
    }

    const getBondData = async (folio: string) => {
        const response = await bondService.getByFolio(folio);
        setBond(response.data ?? [])

        if (response.data) {
            const debtor = await PeopleService.getById(response.data.debtor);
            setValueDebtor(debtor.data);
        }
    }

    const getBondEndorsementData = async (folio: string) => {
        const response = await bondEndorsementService.getByBondFolio(folio);
        setBondEndorsement(response.data ?? [])

        if (response.data) {
            setPendingBondsEndorsement(
                Object(response.data ?? []).find((bondEndorsemet: any) => bondEndorsemet.status === Constants.statusPendingFolio) ?
                    true : false
            )
        }
    }

    const handleDeleteEndorsement = async (row: any) => {
        bondEndorsementService.deleteByFolio(row.endorsementFolio)
            .then((response: any) => {
                setDataAlert(true, "El endoso ha sido eliminado.", "success", autoHideDuration);
                getBondEndorsementData(row.bondFolio)
            })
            .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
            });
    };

    const handleCallBack = (obj: any) => {
        if (obj) {
            getBondData(obj.folio);
            getBondEndorsementData(obj.folio);
        } else {
            setBond(undefined);
            setBondEndorsement([]);
            setValueDebtor(null);
        }
    }

    const handleCreateEndorsement = (endorsementFolio: string) => {
        if (bond) {
            if (!endorsementFolio && pendingBondsEndorsement) {
                setDataAlert(true, "La póliza cuenta con endosos pendientes por emitir", "warning", autoHideDuration);
            } else {
                navigate('/index/fianzas/endosos/NuevoEndoso/' + bond?.folio + (endorsementFolio ? '/' + endorsementFolio : ''))
            }
        } else {
            setDataAlert(true, "Seleccione una póliza de fianza para realizar un endoso.", "warning", autoHideDuration);
        }
    }

    const columns: GridColDef[] = [
        {
            field: "endorsementType",
            headerName: "Tipo endoso",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                //console.log('params.row',params.row)
                return (
                    <Typography sx={TextSmallFont}>
                        {
                            valuesData?.endorsementType[params.row.endorsementType]?.description ?? params.row.endorsementType
                        }
                    </Typography>
                )
            }
        },
        {
            field: "startDate",
            headerName: "Vigencia Inicial",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {
                            FormatsData.stringDateFormatDDMMYYY(params.row.startDate)
                        }
                    </Typography>
                )
            }
        },
        {
            field: "endDate",
            headerName: "Vigencia Final",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {
                            FormatsData.stringDateFormatDDMMYYY(params.row.endDate)
                        }
                    </Typography>
                )
            }
        },
        {
            field: "amount",
            headerName: "Monto",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {
                            params.row.amount
                        }
                    </Typography>
                )
            }
        },
        {
            field: "status",
            headerName: "Estatus",
            flex: 1,
            minWidth: 100,
            renderCell: (params: any) => {
                return (
                    <Typography sx={{ ...TextSmallFont, color: params.row.status === Constants.statusActiveFolio ? ColorGreen : ColorError }} >
                        {
                            Object(valuesData?.statusCatalog.values ?? [])
                                .find((status: CatalogValue) => status.folio === params.row.status).description
                        }
                    </Typography>
                )
            },
        },
        {
            field: "Acciones",
            headerName: "Acciones",
            flex: 1, // Set default flex value
            minWidth: 150,
            renderCell: (params: any) => (
                <>
                    <IconButton
                        disabled={params.row.status === Constants.statusActiveFolio}
                        onClick={() => handleCreateEndorsement(params.row.endorsementFolio)}
                    >
                        <Edit
                            color={params.row.status === Constants.statusActiveFolio ? ColorGray : ColorPink}
                        />
                    </IconButton>

                    <IconButton
                        disabled={params.row.status === Constants.statusActiveFolio}
                        onClick={() => handleDeleteEndorsement(params.row)}
                    >
                        <Delete
                            color={params.row.status === Constants.statusActiveFolio ? ColorGray : ColorPink}
                        />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            <MessageBar
                open={isSnackbarOpen}
                severity={severity}
                message={messageAlert}
                close={handleSnackbarClose}
                autoHideDuration={autoHideDuration}
            />
            <Title
                title={"Endosos"}
                url={(window.location.href).slice(SIZE_WEB_URL)}
            />
            <Paper sx={{ p: "24px", borderRadius: "16px" }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ padding: "5px 5px 5px 5px" }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box width='250px'>
                                <Autocomplete
                                    freeSolo
                                    open={open}
                                    onOpen={() => setOptions([])}
                                    onClose={() => { setOpen(false) }}
                                    isOptionEqualToValue={(option, value) => option.folio === value.folio}
                                    getOptionLabel={(option: any) => option.noPolicy}
                                    options={options}
                                    loading={loading}
                                    noOptionsText="No hay registros"
                                    loadingText='Buscando...'
                                    onInputChange={(e: any, value: any) => { handleInputChange(value); setOpen(true) }}
                                    onChange={(e, value) => {
                                        setLoading(false);
                                        handleCallBack(value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <React.Fragment>
                                                        <Search color={ColorGrayDark2} />
                                                    </React.Fragment>
                                                ),
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loading ? <CircularProgress sx={{ color: "#E5105D" }} size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.folio}>
                                            {option.noPolicy}
                                        </li>
                                    )}
                                />
                            </Box>
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>Núm.Póliza:{bond?.noPolicy ? bond.noPolicy : ''}</Typography>
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                                Cliente: {
                                    valueDebtor ? ' ' + valueDebtor.name + ' ' + valueDebtor.lastName + ' ' + valueDebtor.maternalLastName : ''
                                }
                            </Typography>
                            <Avatar
                                src={image ?? undefined}
                                variant="rounded"
                                alt="Policy Image"
                                sx={{
                                    width: "120px",
                                    height: "100px",
                                    mx: 3
                                }}
                            />
                            <Box>
                                <Button
                                    size="small"
                                    sx={{ mx: 1 }}
                                    onClick={() => handleCreateEndorsement('')}
                                    startIcon={<Plus color={ColorWhite} />}
                                >
                                    Nuevo endoso
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <DataGrid
                    rows={bondEndorsement}
                    columns={columns}
                    getRowId={(row) => row.endorsementFolio}
                    disableRowSelectionOnClick
                />
            </Paper>
        </>
    )
}

export default Endorsement