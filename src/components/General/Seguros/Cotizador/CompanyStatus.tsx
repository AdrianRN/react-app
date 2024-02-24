import React from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import { Packet, Status } from './MultiCotizador';
import FormatData from '../../../../utils/Formats.Data';
import { Avatar } from '../../../OuiComponents/DataDisplay';
import Companies from '../../../../models/Companies';
import Box from '../../../OuiComponents/Layout/Box';
import { TextMediumBoldWhiteFont, TextMediumFont } from '../../../OuiComponents/Theme';
import { formatMoney } from './packageUtils';
import { stat } from 'fs';

type CompanyStatusProps = {
  status: Status;
};

const CompanyStatus: React.FC<CompanyStatusProps> = ({ status }) => {    

    return (
        <Card sx={{ 
            border: '1.5px solid rgba(0, 0, 0, 0.2)', 
            margin: 2, 
            height: '180px', // Adjust this value as needed
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center',
        }}>
        <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                        minHeight: "100px",
                        }}>
                    <Avatar
                        src={FormatData.getUriLogoCompany(status.logo) ?? ""}
                        variant="rounded"
                        sx={{
                        width: "auto",
                        height: "auto", 
                        maxWidth: "100px",
                        maxHeight: "100px",
                        }}
                    />
                </div>
                <Typography
                    sx={{ ...TextMediumFont }}
                    gutterBottom
                >
                    {status.status === true ? 'En linea' : 'En mantenimiento'}
                </Typography>
            </Box>
        </CardContent>
        </Card>
    );
};

export default CompanyStatus;
