import React from 'react'
import { Box, Stack } from '../../../OuiComponents/Layout'
import { Accordion } from '../../../OuiComponents/Surfaces'
import { AccordionSummary } from '@mui/material'
import { Typography } from '../../../OuiComponents/DataDisplay'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinkLargeFont } from '../../../OuiComponents/Theme'

function TabPolicySkeleton() {
    return (
        <>
            <Box maxWidth="auto">
                <Stack direction="column">
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Datos de la póliza</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Fechas</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Contratante</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Varios</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Accordion sx={{ marginBottom: "30px" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={LinkLargeFont}>Primas</Typography>
                        </AccordionSummary>
                    </Accordion>
                </Stack>
            </Box>
        </>
    )
}

export default TabPolicySkeleton