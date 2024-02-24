import React from 'react'
import { Dialog } from '../../OuiComponents/Feedback';
import { Box, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Cancel, Complete } from '../../OuiComponents/Icons';
import { Grid, Stack } from '../../OuiComponents/Layout';
import { Avatar, Typography } from '../../OuiComponents/DataDisplay';
import { ColorPink, ColorPureWhite, LinkLargeFont, TextSmallFont } from '../../OuiComponents/Theme';
import { Button, TextField } from '../../OuiComponents/Inputs';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { EmailOutlined } from '@mui/icons-material';
import msalInstance from '../../../msalInstance';
import AuthenticationService from '../../../services/authentication.service';

function LoginModal(props: any) {
    const[open, setOpen] = React.useState(true)

    React.useEffect(() =>{
        setOpen(props.open)
    },[])

    const onSubmit = (data: any) => {
        const fetchAutentification = async () => {
            const restAuthentification = await AuthenticationService.authorize(data)
            
            if(restAuthentification){
                props.OnAuthtenticate(true)
                setOpen(false)
            }else{
                props.OnAuthtenticate(false)
            }
        }

        fetchAutentification()
    };

    const handleMicrosoftLogin = async () => {
        try {
            const loginResponse = await msalInstance.loginPopup();
            const accessToken = loginResponse.accessToken;

            const userResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (userResponse.ok) {
                props.OnAuthtenticate(true)
                setOpen(false)
            } else {
                props.OnAuthtenticate(false)
                console.log("Error al obtener los datos del usuario.");
            }

        } catch (error) {
            props.OnAuthtenticate(false)
            console.log("Error al iniciar sesión:", error);
        }
    };

    const initialValues = {
        email: "",
        password: ""
    }

    const { handleSubmit, handleChange, values, errors } = useFormik({
        initialValues,
        onSubmit,
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string().required("Este campo es requerido."),
            password: Yup.string().required("Este campo es requerido.")
        }),
    })

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle display='flex'>
                    <Typography sx={LinkLargeFont}>Autenticación Requerida</Typography>
                    <IconButton
                        onClick={props.close}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                    >
                        <Cancel />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component='form' onSubmit={handleSubmit} paddingTop={4} display='flex' justifyContent='center' alignItems='center'>
                        <Stack direction='column' spacing={2}>
                            <Grid container rowSpacing={1} >
                                <Grid item xs={12} alignSelf='center'>
                                    <Typography sx={TextSmallFont}>
                                        Correo electrónico
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} alignSelf='center'>
                                    <TextField
                                        fullWidth
                                        placeholder="Correo electrónico"
                                        name='email'
                                        onChange={handleChange}
                                        value={values.email}
                                        helperText={errors.email}
                                        error={!!errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} alignSelf='center'>
                                    <Typography sx={TextSmallFont}>
                                        Contraseña
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} alignSelf='center'>
                                    <TextField
                                        fullWidth
                                        placeholder="Contraseña"
                                        name='password'
                                        onChange={handleChange}
                                        value={values.password}
                                        helperText={errors.password}
                                        error={!!errors.password}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container paddingTop={4} columnSpacing={{ xs: 1 }}>
                                <Grid item xs={6} alignSelf='center' textAlign='center'>
                                    <Button variant='outlined' size='small' type='submit' startIcon={<EmailOutlined />} sx={{ height: 5 }}>
                                        Email
                                    </Button>
                                </Grid>
                                <Grid item xs={6} alignSelf='center' textAlign='center'>
                                    <Button onClick={handleMicrosoftLogin} variant='outlined' size='small' type='button' startIcon={<Avatar
                                        src="https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png"
                                        alt="Microsoft logo"
                                        sx={{ width: 15, height: 15 }}
                                    />}
                                        sx={{ height: 5 }}>
                                        Microsoft
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default LoginModal