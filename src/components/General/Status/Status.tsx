import * as React from 'react';
import onesta from '../../../assets/img/onesta.png';
import Paper from '../../OuiComponents/Surfaces/Paper';
import { Box } from '../../OuiComponents/Layout';
import { Typography } from '../../OuiComponents/DataDisplay';
import { LinkSmallFont, TextXSmallBoldFont } from '../../OuiComponents/Theme';

export default function Status() {

    return (
        <>
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ minHeight: '100vh' }}>
                <Paper sx={{ p: 5, borderRadius: 8, maxWidth: '600px' }}>
                    <Box display='flex' justifyContent='center' alignItems='center' sx={{ p: 4 }}>
                        <img width={300} src={onesta} />
                    </Box>
                    <Typography sx={{ ...LinkSmallFont, textAlign:'center',pt: 4 }}>
                        <h2>La aplicación se encuentra en mantenimiento. Gracias por su comprensión.</h2>
                    </Typography>
                    <Typography display='flex' justifyContent='center' alignItems='center' sx={{ ...TextXSmallBoldFont, pt: 4 }}>
                        © Onesta Seguros y Finanzas | All Rights Reserved
                    </Typography>
                </Paper>
            </Box>      
        </>
    );
}