import React, { useState } from 'react'
import { useAlertContext } from '../../../../context/alert-context';
import { useNavigate, useParams } from 'react-router-dom';
import IBonds from '../../../../models/Bonds';
import MessageBar from '../../../OuiComponents/Feedback/MessageBar';
import Title from '../../Title/Title';
import { Paper } from '../../../OuiComponents/Surfaces';
import { Box, Stack } from '../../../OuiComponents/Layout';
import { Autocomplete, Button } from '../../../OuiComponents/Inputs';
import { Avatar, Typography } from '../../../OuiComponents/DataDisplay';
import { ColorError, ColorGray, ColorGreen, ColorPink, ColorWhite, TextSmallFont } from '../../../OuiComponents/Theme';
import { Delete, Edit, Plus } from '../../../OuiComponents/Icons';
import { DataGrid } from '../../../OuiComponents/DataGrid';
import { IconButton } from '@mui/material';
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
import ModalFormClaims from './ModalFormClaims';
import CompaniesService from '../../../../services/companies.service';

interface BondEndorsementCatalogs {
    endorsementType: any[],
    statusCatalog: CacheCatalogValue;
}

function ClaimsSureties() {
    // MessageAlert
    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    const { bondFolio } = useParams<any>();
    let bondFolioA: any = bondFolio;

    const navigate = useNavigate();
    const [claimData, setClaimData] = React.useState<any[]>([])
    const [bond, setBond] = React.useState<IBonds>()
    const [valuesData, setValuesData] = React.useState<BondEndorsementCatalogs>()
    const [pendingBondsEndorsement, setPendingBondsEndorsement] = React.useState(false);
    const [valueDebtor, setValueDebtor] = React.useState<any | null>(null);
    const [suretyCompany, setSuretyCompany] = React.useState<any | null>(null);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClaimData, setEditingClaimData] = useState<any>(null);



    React.useEffect(() => {
        const fetchData = async () => {
            if (bondFolio) {
                await Promise.all([
                    getBondData(bondFolio),
                    getClaimsData(bondFolio)
                ]);
            }
        };
        fetchData();
    }, []);



    const getBondData = async (folio: string) => {
        const response = await bondService.getByFolio(folio);
        setBond(response.data ?? [])

        if (response.data) {
            const debtor = await PeopleService.getById(response.data.debtor);
            setValueDebtor(debtor.data);

            const suretyCompany = await CompaniesService.getByFolio(response.data.suretyCompany);
            setSuretyCompany(suretyCompany.data.corporateName);
        }
    }

    const getClaimsData = async (folio: string) => {
        const response = await bondService.getClaimFolio(bondFolio);
        const formattedClaims = response.data?.map((claim: any, index: number) => ({
            ...claim,
            id: index + 1
        }));
        setClaimData(formattedClaims ?? []);
        

    }

    const handleNewClaim = async () => {
        setIsModalOpen(true);
        setEditingClaimData({
        claimDate: "",
        client: "",
        bond: bondFolio,
        claimNumber: "",
        amount: "",
        resolution: "",
        term: "",
        objectStatusId: 1
        });


    };

    const handleEditClaim = (claimData: any) => {
        setEditingClaimData(claimData);
        setIsModalOpen(true);
    };

    const handleDeleteClaim = async (claimFolio: string) => {
        await bondService.deleteClaimByFolio(claimFolio);
        // Actualizar los datos del reclamo después de eliminar
        await updateClaimsData();
    };

    const columns: GridColDef[] = [
        {
            field: "folio",
            headerName: "Folio de reclamación",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {params.row.folio}
                    </Typography>
                );
            }
        },
        {
            field: "claimDate",
            headerName: "Fecha de reclamo",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {params.row.claimDate}
                    </Typography>
                );
            }
        },
        {
            field: "amount",
            headerName: "Monto",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {params.row.amount}
                    </Typography>
                );
            }
        },
        {
            field: "term",
            headerName: "Término",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {params.row.term}
                    </Typography>
                );
            }
        },
        {
            field: "resolution",
            headerName: "Resolución",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Typography sx={TextSmallFont}>
                        {params.row.resolution}
                    </Typography>
                );
            }
        },


        {
            field: "Acciones",
            headerName: "Acciones",
            flex: 1, // Set default flex value
            minWidth: 150,
            renderCell: (params: any) => (
                <>
                    <IconButton onClick={() => handleEditClaim(params.row)}>
                        <Edit color={ColorPink} />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            handleDeleteClaim(params.row.folio);
                            setDataAlert(
                                true,
                                "Reclamo eliminado con éxito.",
                                "success",
                                autoHideDuration
                            );
                        }}
                    >
                        <Delete
                            color={ColorPink}
                        />
                    </IconButton>
                </>
            ),
        },
    ];

    const updateClaimsData = async () => {
        await getClaimsData(bondFolio ? bondFolio : '');
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
            <Title
                title={"Reclamos"}
                url={(window.location.href).slice(SIZE_WEB_URL)}
            />
            <Paper sx={{ p: "24px", borderRadius: "16px" }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ padding: "5px 5px 5px 5px" }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            {/* <Box width='250px'>
                                <Autocomplete parentCallBack={handleCallBack} function={bondService.GetByClientOrPolicyNumber} name={"noPolicy"} />
                            </Box> */}
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>Fianza: {bond?.noPolicy ? bond.noPolicy : ''}</Typography>
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                                Cliente: {
                                    valueDebtor ? ' ' + valueDebtor.name + ' ' + valueDebtor.lastName + ' ' + valueDebtor.maternalLastName : ''
                                }
                            </Typography>
                            <Typography sx={{ ...TextSmallFont, mx: 3 }}>Afianzadora: {suretyCompany ? suretyCompany : ''}</Typography>

                            <Box>
                                <Button
                                    size="small"
                                    sx={{ mx: 1 }}
                                    onClick={() => handleNewClaim()}
                                    startIcon={<Plus color={ColorWhite} />}
                                >
                                    Nuevo reclamo
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <DataGrid
                    rows={claimData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    disableRowSelectionOnClick
                />
            </Paper>

            <ModalFormClaims
                open={isModalOpen}
                close={() => setIsModalOpen(false)}
                bondFolio={bondFolio}
                updateClaimsData={updateClaimsData}
                editingData={editingClaimData}
            />
        </>
    )
}

export default ClaimsSureties