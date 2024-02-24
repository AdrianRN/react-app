import { Box } from "@mui/material";
import React from "react";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import {
    LinkLargeFont,
    TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import PeopleService from "../../../../services/people.service";
import People from "../../../../models/People";
import CompaniesContactService from "../../../../services/companiescontact.service";

function TabPersonalInfo(props: any) {

    const [personInfo, setPersonInfo] = React.useState<People | undefined>();
    const [change, setChange] = React.useState(true);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        
        
        fetchData()
    }, [change]);
    
    const fetchData = async () => {
        if (props.data) {
            const person = await PeopleService.getById(props.data);
            const contact = await CompaniesContactService.getByFolioPerson(props.data)

            setRows(contact.data)
            setPersonInfo(person.data);
        }
        setChange(false)

    }

    
    const columns: GridColDef[] = [

        {
            field: 'alias',
            headerName: 'Alias',
            width: 150,
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Typography sx={TextSmallFont}>{params.row.alias}</Typography>
                    </>
                );
            },

        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 180,
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Typography sx={TextSmallFont}>{params.row.name} {params.row.lastName} {params.row.middleName}</Typography>
                    </>
                );
            },

        },
        {
            field: 'email',
            headerName: 'Correo',
            width: 110,
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Typography sx={TextSmallFont}>{params.row.email}</Typography>
                    </>
                );
            },
        },
        {
            field: 'phone',
            headerName: 'Telefono',
            width: 100,
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Typography sx={TextSmallFont}>{params.row.phone}</Typography>
                    </>
                );
            },
        },
    ];



    return (
        <>

            <Box component='form' >
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Datos del cliente
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
                                    Nombre completo
                                </Typography>
                                <TextField
                                    name="nombre"
                                    disabled
                                    value={`${personInfo?.name || ''} ${personInfo?.lastName || ''} ${personInfo?.maternalLastName || ''}`}
                                />

                            </Stack>
                        </Grid>

                        <Grid item xs={3.5}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    RFC
                                </Typography>
                                <TextField
                                    name="rfc"
                                    disabled
                                    value={`${personInfo?.rfc || ''}`}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={3.5}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    CURP
                                </Typography>
                                <TextField
                                    name="curp"
                                    disabled
                                    value={`${personInfo?.curp || ''}`}
                                />
                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>

                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Medios de contacto
                </Typography>
                <DataGrid
                    loading={change}
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.folio + ""}
                    disableRowSelectionOnClick

                />

            </Box>
        </>
    );
}
export default TabPersonalInfo

