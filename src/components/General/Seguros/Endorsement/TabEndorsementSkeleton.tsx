import React from 'react'
import { Box, Stack } from '../../../OuiComponents/Layout'
import { Accordion } from '../../../OuiComponents/Surfaces'
import { AccordionSummary } from '@mui/material'
import { Typography } from '../../../OuiComponents/DataDisplay'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinkLargeFont } from '../../../OuiComponents/Theme'

function TabEndorsementSkeleton() {
    return (
        <>
            <Box maxWidth="auto">
                <Stack direction="column">
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Datos del endoso</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Primas</Typography>
                        </AccordionSummary>
                    </Accordion>


                </Stack>
            </Box>
        </>
    )
}

export default TabEndorsementSkeleton