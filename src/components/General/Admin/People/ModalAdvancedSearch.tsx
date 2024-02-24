import Check from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import People from '../../../../models/People';
import PeopleDataService from '../../../../services/people.service';
import Format from '../../../../utils/Formats.Data';

function ModalAdvancedSearch(props: any) {
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const [people, setPeople] = React.useState<People>();
    
    React.useEffect(() => {
        setOpen(props.open);
    }, [])


    const onSubmit = (data: People) => {
        if (props.data) {
            // PeopleDataService.put(props.data, data)
            //     .then((response: any) => {
            //         if (response.message == "OK") {
            //             setAlertContent("El Usuario se actualizo con éxito.");
            //         } else {
            //             setAlertContent(response.message)
            //         }

            //         setAlert(true);
            //         setTimeout(() => {
            //             setAlert(false);
            //             props.close(false);
            //         }, 3000)

            //     }).catch((e: Error) => {
            //         setAlertContent(e.message);

            //         setAlert(true);
            //         setTimeout(() => {
            //             setAlert(false);
            //         }, 3000)
            //     })
        } else {
            // PeopleDataService.post(data)
            //     .then((response: any) => {
            //         setAlertContent("El Usuario se registro con éxito.");
            //         setAlert(true);
            //         setTimeout(() => {
            //             setAlert(false);
            //             props.close(false);
            //         }, 3000)
            //     }).catch((e: Error) => {
            //         setAlertContent(e.message);
            //         setAlert(true);
            //         setTimeout(() => {
            //             setAlert(false);
            //         }, 3000)
            //     })
        }
    }

    const validationSchema = Yup.object({
        atLeastOneField: Yup.string().test(
            'at-least-one-field',
            'At least one field is required',
            function (value) {
                const {
                    name,
                    lastName,
                    maternalLastName,
                    rfc,
                    curp,
                    birthDay,
                    genderId,
                    email,
                    password,
                    groupId,
                    originId,
                    nationality,
                    initials,
                    signature,
                    profileId,
                } = this.parent;
    
                return (
                    !!name ||
                    !!lastName ||
                    !!maternalLastName ||
                    !!rfc ||
                    !!curp ||
                    !!birthDay ||
                    !!genderId ||
                    !!email ||
                    !!password ||
                    !!groupId ||
                    !!originId ||
                    !!nationality ||
                    !!initials ||
                    !!signature ||
                    !!profileId
                ); // Returns true if at least one of the fields has a value
            }
        ),
    });

    const initialValues: People = {
        sector: "",
        folio: people?.folio ?? "",
        name: people?.name ?? "",
        lastName: people?.lastName ?? "",
        maternalLastName: people?.maternalLastName ?? "",
        rfc: people?.rfc ?? "",
        curp: people?.curp ?? "",
        birthPlace: people?.birthPlace ?? 0,
        birthDay: people?.birthDay ?? Format.dateFormat(new Date()),
        genderId: people?.genderId ?? "",
        email: people?.email ?? "",
        password: people?.password ?? "",
        groupId: people?.groupId ?? "",
        financialProfile: people?.financialProfile ?? 1,
        originId: people?.originId ?? "",
        paymentTerm: people?.paymentTerm ?? true,
        vip: people?.vip ?? true,
        politicallyExposed: people?.politicallyExposed ?? true,
        nationality: people?.nationality ?? "",
        collectionReminde: people?.collectionReminde ?? true,
        initials: people?.initials ?? "",
        signature: people?.signature ?? "",
        profileId: people?.profileId ?? "",
        objectStatusId: people?.objectStatusId ?? 1,
        taskss: [],
        //companies: [],
        message: [],
        address: [],
        nationalities: {
            description: ''
        },
        typePersonId: people?.typePersonId ?? '',
        companyId: '',
        isSeller: people?.isSeller ?? false,
        healt: people?.healt ?? 0,
        branch: people?.branch ?? "",
        leader: people?.leader ?? false,
        bondsExecutive: people?.bondsExecutive ?? false,
        commissionSeller: people?.commissionSeller ?? undefined,
        isBeneficiary: people?.isBeneficiary ?? false,
    }
    
    const { handleSubmit, handleChange, errors, values, setFieldValue } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize: true
    })

    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="modal-modal-title"
                disableEscapeKeyDown
                maxWidth='lg'
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    {alert ?
                        <Alert severity='info' onClose={() => setAlert(false)} sx={{ position: 'absolute'}}>{alertContent}</Alert> :
                        <></>
                    }
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={props.close}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack display='column' spacing={1}>
                            <Box display='flex'>
                                <Typography sx={{ flexGrow: 1 }} variant='h5' >
                                    <strong>Busqueda avanzada de persona</strong>
                                </Typography>
                            </Box>
                            <Box sx={{ pr: 6, pl: 2, pt: 2, pb: 2 }}>
                                <Stack display='column' spacing={1}>
                                    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Nombre
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Nombre"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    helperText={errors.name}
                                                    error={!!errors.name}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Apellido paterno
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Apellido Paterno"
                                                    name="lastName"
                                                    value={values.lastName}
                                                    onChange={handleChange}
                                                    helperText={errors.lastName}
                                                    error={!!errors.lastName}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Apellido Materno
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Apellido materno"
                                                    name="maternalLastName"
                                                    value={values.maternalLastName}
                                                    onChange={handleChange}
                                                    helperText={errors.maternalLastName}
                                                    error={!!errors.maternalLastName}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Correo
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Correo"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    helperText={errors.email}
                                                    error={!!errors.email}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Telefono
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Teléfono"
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Iniciales
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Iniciales"
                                                    name="initials"
                                                    value={values.initials}
                                                    onChange={handleChange}
                                                    helperText={errors.initials}
                                                    error={!!errors.initials}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Firma
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Firma"
                                                    name="signature"
                                                    value={values.signature}
                                                    onChange={handleChange}
                                                    helperText={errors.signature}
                                                    error={!!errors.signature}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Fecha de alta
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Fecha de alta"
                                                    type="date"
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Fecha de baja
                                                </InputLabel>
                                                <TextField
                                                    placeholder="Fecha de baja"
                                                    type="date"
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel >
                                                    Grupo
                                                </InputLabel>
                                                <Select
                                                    name="groupId"
                                                    onChange={handleChange}
                                                    value={values.groupId}
                                                >
                                                    <MenuItem value="0" disabled>Seleccione grupo</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c32">Pepsico</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c33">Zigma</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c34">Alfa</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c35">Pick up</MenuItem>
                                                </Select>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction='column' spacing={1}>
                                                <InputLabel>
                                                    Origen
                                                </InputLabel>
                                                <Select
                                                    name="originId"
                                                    onChange={handleChange}
                                                    value={values.originId}
                                                >
                                                    <MenuItem value="0" disabled>Seleccione origen</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c28">Onesta</MenuItem>
                                                    <MenuItem value="64ecd323652830d583033c29">Externo</MenuItem>
                                                </Select>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Box>
                            <Box display='flex'>
                                <Box sx={{ flexGrow: 1 }} >
                                </Box>
                                <Box sx={{ flexGrow: 0, pb: 2 }}>
                                    <Button variant="contained" type="submit" endIcon={<Check />} size="large" disableElevation sx={{ backgroundColor: '#e5105d' }}>
                                        Buscar persona
                                    </Button>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog >
        </>
    );
}

export default ModalAdvancedSearch