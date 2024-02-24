import React, { useState, useEffect } from 'react';
import Title from '../../Title/Title';
import Paper from '../../../OuiComponents/Surfaces/Paper';
import Typography from '../../../OuiComponents/DataDisplay/Typography';
import Box from '../../../OuiComponents/Layout/Box';
import DataGrid from '../../../OuiComponents/DataGrid/DataGrid';
import { ColorGrayDark2, ColorPink, ColorPureWhite, TextSmallFont } from '../../../OuiComponents/Theme';
import IconButton from '@mui/material/IconButton/IconButton';
import Edit from '../../../OuiComponents/Icons/Edit';
import Delete from '../../../OuiComponents/Icons/Delete';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import Button from '../../../OuiComponents/Inputs/Button';
import { Plus, Search } from '../../../OuiComponents/Icons';
import Stack from '../../../OuiComponents/Layout/Stack';
import Avatar from '../../../OuiComponents/DataDisplay/Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import { ClaimsService } from '../../../../services/claims.service';
import PoliciesService from '../../../../insuranceServices/policies.service';
import { IClaims } from '../../../../insuranceModels/Claims';
import CompaniesService from '../../../../services/companies.service';
import FormatData from '../../../../utils/Formats.Data';
import { SIZE_WEB_URL } from '../../../../enviroment/enviroment';
import { EditModal } from './EditClaimsModal'
import PoliciyService from '../../../../insuranceServices/policies.service';
import Constants from '../../../../utils/Constants';
import TabModalClaimsDetails from '../ClaimDetails/TabModalClaimsDetails';
import { Autocomplete } from '@mui/material';
import { TextField } from '../../../OuiComponents/Inputs';
import { CircularProgress } from '../../../OuiComponents/Feedback';

export interface IPolicyInfo {
    folio: string,
    noPolicy: string,
    insuranceCompany: string,
    clientName: string,
    insuranceId: string,
    clientId: string,
}

export default function Claims() {
    const [rows, setRows] = React.useState<IClaims[]>([]);
    const [change, setChange] = React.useState(true);
    const { policyId } = useParams();
    const [image, setImage] = useState<string | null>(null);
    const [policyFolio, setPolicyFolio] = React.useState<string | null>(policyId ?? null);
    const [policy, setPolicy] = React.useState<IPolicyInfo| null>()
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [openTabClaims, setOpenTabclaim] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<IClaims | null>(null);
    const [refreshClaims, setRefreshClaims] = useState(false);
    const [disable, setDisabled] = React.useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<[]>([]);
    const [loading, setLoading] = React.useState(false)
    const [noPolicy, setNoPolicy] = useState("");

    useEffect(() => {
        if (policyFolio) {
            validatePolicy();
            getAllClaims(policyFolio);
            fetchData(policyFolio);
            setChange(false);
            setDisabled(false);
        }else{
            setDisabled(true);
        }

    }, [change, refreshClaims]);

    const handleInputChange = async (value: any) => {
        
        setTimeout(async () => {
            if (value) {
                setLoading(true);
                const response = await PoliciesService.GetPoliciesByClientOrPolicyNumber(value)
                if (response.data === null) {
                    setOptions([])
                    setLoading(false)
                    return
                }

                const list = response.data
                
                setOptions(list)
                setLoading(false)
            } else {
                setPolicy(null)
                setNoPolicy("")
                setImage(null);
                setDisabled(true);
                setOptions([]);
                setOpen(false)
            }
        }, 500)
    }

    const validatePolicy = async () => {
        if (policyFolio) {
            await PoliciyService.getPoliciesByFolio(policyFolio).then((response) => {
                if (response.data.policyStatusFolio === Constants.statusCancelledFolio)
                    setDisabled(true);
            });
        }
    };

    const getAllClaims = async (folio: string) => {
        const response = await ClaimsService.getClaimsPolicyByPolicy(folio);
        setRows(response.data);
        setChange(false);
    };

    const getPolicyInfo = async (folio: string) => {
        const response = await PoliciesService.getPoliciesByFolio(folio);
        setPolicy(response.data)
    }

    const deletePolicy = async (folio: string) => {
        await ClaimsService.deleteClaimsByFolio(folio);
        setChange(true);
    }

    const fetchData = async (folio: string) => {

        try {
            const response = await PoliciesService.getPoliciesByFolio(folio);

            // Ahora que hemos obtenido el dato de la primera petición, podemos usarlo para la segunda petición
            const companyResponse = await CompaniesService.getByFolio(response.data.insuranceId);

            // Actualiza la URL de la imagen en el estado
            setPolicy(response.data)
            setNoPolicy(response.data.folio)
            setImage(FormatData.getUriLogoCompany(companyResponse.data.logo));
            localStorage.setItem("urlLogoCompany", FormatData.getUriLogoCompany(companyResponse.data.logo))

        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener datos:", error);
        }

    };

    const columns: GridColDef[] = [
        {
            field: 'folio',
            headerName: 'No.Folio',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div onClick={() => handleTabClaim(params.row)}>
                        {params.row.folio}
                    </div>
                );
            },
        },
        {
            field: 'dateClaim',
            headerName: 'Fecha',
            flex: 1,
            renderCell: (params) => (
                <Typography sx={TextSmallFont}>{FormatData.stringDateFormatDDMMYYY(params.row.dateClaim) ?? 'NO DATA'}</Typography>
              ),

        },
        {
            field: 'deductible',
            headerName: 'Deducible',
            flex: 1,

        },
        {
            field: 'observations',
            headerName: 'Observaciones',
            flex: 1,

        },
        {
            field: 'liabilityType',
            headerName: 'Tipo de responsabilidad',
            flex: 1,

        },
        {
            field: 'Acciones',
            headerName: 'Acciones',
            type: 'Action',
            flex: 1,
            renderCell: (params: any) => (
                <>
                    <IconButton onClick={() => handleEditClick(params.row)}>
                        <Edit color={ColorPink} />
                    </IconButton>

                    <IconButton onClick={() => deletePolicy(params.row.folio)}>
                        <Delete color={ColorPink} />
                    </IconButton>
                </>
            )
        }

    ];


    useEffect(() => {
        if (image === null) {
            setTimeout(() => {
                setShowLoader(false);
            }, 1000); // Espera 1 segundo antes de mostrar la imagen de relleno
        }
    }, [image]);


    const handleCallBack = (obj: any) => {
        if (obj) {
            getAllClaims(obj.folio)
            getPolicyInfo(obj.folio);
            fetchData(obj.folio)
            setPolicyFolio(obj.folio)
        }
    }

    const handleNewClaim = () => {
        navigate('/index/seguros/siniestros/ClaimCapture/' + noPolicy);
    }

    const handleEditClick = (claim: any) => {
        setSelectedClaim(claim);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedClaim(null);
    };

    const handleTabClaim = (claim: any) => {
        setSelectedClaim(claim);
        setOpenTabclaim(true);
    };


    return (
        <>

            {isEditModalOpen && (
                <EditModal
                    claimData={selectedClaim}
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                    claimFolio={selectedClaim ? selectedClaim.folio : ''}
                    refreshClaims={setRefreshClaims}
                />
            )}
            {openTabClaims && (
                <TabModalClaimsDetails
                    claimData={selectedClaim}
                    clientId={policy?.clientId}
                    openTabClaims={openTabClaims}
                    setOpenTabClaims={setOpenTabclaim}
                    closeTabclaim={() => {
                        setChange(true);
                        setOpenTabclaim(false);
                    }} />


                //openTabReceipt={openTabReceipt} 
                //setOpenTabReceipt={setOpenTabReceipt} 
                //receiptDetails={receiptDetails}

            )}
            <Title title={"Siniestros"} url={(window.location.href).slice(SIZE_WEB_URL)} />
            <Paper sx={{ p: '24px', borderRadius: '16px' }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ padding: "5px 5px 5px 5px" }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" >
                            <Box width='250px'>
                                <Autocomplete
                                    freeSolo
                                    open={open}
                                    onOpen={() => setOptions([])}
                                    onClose={() => { 
                                        setOpen(false) 
                                        }
                                    }
                                    
                                    isOptionEqualToValue={(option, value) => option.folio === value.folio}
                                    getOptionLabel={(option: any) => option.noPolicy}
                                    options={options}
                                    loading={loading}
                                    noOptionsText="No hay registros"
                                    loadingText='Buscando...'
                                    onInputChange={(e: any, value: any) => { handleInputChange(value); setOpen(true) }}
                                    onChange={(e, value) => {
                                        setDisabled(false);
                                        setLoading(false);
                                        handleCallBack(value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar póliza"
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
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                                Núm. Póliza: {policy ? policy.noPolicy : ''}
                            </Typography>
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                                Cliente: {policy ? policy.clientName : ''}
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
                                <Button variant='contained'
                                    startIcon={<Plus color={ColorPureWhite} />}
                                    onClick={handleNewClaim}
                                    disabled={disable}
                                >
                                    Nuevo
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.folio + ""}
                    disableRowSelectionOnClick
                />
            </Paper >
        </>
    );
}

