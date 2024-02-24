import { IconButton } from '@mui/material';
import React from 'react'
import Typography from '../../OuiComponents/DataDisplay/Typography';
import msalInstance from '../../../msalInstance';
import { useNavigate } from 'react-router-dom';
import { LinkSmallFont, TextMediumFont, TextXSmallFont } from '../../OuiComponents/Theme';
import { Avatar } from '../../OuiComponents/DataDisplay';
import { Box, Grid } from '../../OuiComponents/Layout';
import { Menu } from '../../OuiComponents/Navigation';

function CardUser(props: any) {
    const userImage = localStorage.getItem('userImage')?.toString();
    const navigate = useNavigate()

    const onLogOut = () => {
        localStorage.clear();
        navigate('/Logout')
        msalInstance.logoutRedirect();
    };

    return (
        <>

            <Menu
                sx={{ mt: '35px' }}
                id='menu-appbar'
                anchorEl={props.open}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(props.open)}
                onClose={props.close}
            >
                <Box
                    sx={{
                        pl: 2,
                        pr: 2,
                        pb: 1,
                        margin: 'auto',
                        width: 450
                    }}
                >
                    <Grid container spacing={2} sx={{ display: 'inline-flex' }}>
                        <Grid item xs={12}>
                            <Box display='flex'>
                                <Typography flexGrow={1} sx={{ ...TextXSmallFont }}>{props.dataCompany ? props.dataCompany : 'USUARIO EXTERNO'}</Typography>
                                <Typography onClick={() => onLogOut()} sx={{ ...LinkSmallFont, cursor: 'pointer' }}>Log out</Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <IconButton sx={{ width: 76, height: 76 }}>
                                <Avatar src={userImage} sx={{ width: 76, height: 76 }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} sm>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom sx={{ ...TextMediumFont }}>
                                        {props.data.name + ' ' + props.data.lastName + ' ' + props.data.maternalLastName}
                                    </Typography>
                                    <Typography gutterBottom sx={{ ...TextXSmallFont }}>
                                        {props.data.email}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Menu>
        </>
    )
}

export default CardUser