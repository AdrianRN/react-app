import React from 'react'
import { Dialog } from '../../OuiComponents/Feedback'
import { DialogContent } from '@mui/material'
import { Box, Stack } from '../../OuiComponents/Layout'
import { Typography } from '../../OuiComponents/DataDisplay'
import { ColorGrayLight, ColorPink, ColorPureBlack, LinkMediumFont, LinkSmallFont, TextXSmallFont } from '../../OuiComponents/Theme'
import FormatData from '../../../utils/Formats.Data'
import { Button, TextField } from '../../OuiComponents/Inputs'
import { DocumentComplete } from '../../OuiComponents/Icons'
import { Link } from '../../OuiComponents/Navigation'

function HomeDialog(props: any) {
    return (
        <>
            <Dialog open={props.open}
                aria-labelledby="modal-modal-title"
                fullWidth
                maxWidth='sm'
                PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
            >
                <DialogContent>
                    <Box>
                        <Stack direction='column' spacing={2}>
                            <Box display='flex' alignItems='center'>
                                <Typography sx={{ ...LinkMediumFont, color: { ColorPureBlack }, flexGrow: 1 }}>
                                    {props.children.title ?? (props.children.taskTypes ? props.children.taskTypes.description : '')}
                                </Typography>
                                <Stack direction='row' spacing={1} alignItems='center'>
                                    <Typography sx={{ ...TextXSmallFont }}>
                                        Creación:
                                    </Typography>
                                    <Box bgcolor={ColorGrayLight} borderRadius={2} padding={1}>
                                        <Typography sx={{ ...TextXSmallFont }}>
                                            {FormatData.stringDateFormat(props.children.createdAt ?? '')}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            {props.children.taskTypes ?
                                <Box display='flex' alignItems='center'>
                                    <Stack direction='row' spacing={1} alignItems='center' sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ ...TextXSmallFont }}>
                                            Creado por:
                                        </Typography>
                                        <Typography sx={{ ...LinkSmallFont, color: { ColorPureBlack } }}>
                                            {props.children.creator.name + ' ' + props.children.creator.lastName}
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Typography sx={{ ...TextXSmallFont }}>
                                            expira:
                                        </Typography>
                                        <Box bgcolor={ColorGrayLight} borderRadius={2} padding={1}>
                                            <Typography sx={{ ...TextXSmallFont }}>
                                                {FormatData.stringDateFormat(props.children.dueDate) ?? ''}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box> : <></>
                            }
                            <Stack direction='column' spacing={1}>
                                <Typography sx={{ ...TextXSmallFont }}>
                                    Descripción:
                                </Typography>
                                <TextField
                                    disabled
                                    multiline
                                    rows={5}
                                    value={props.children.description}
                                >
                                </TextField>
                            </Stack>
                            <Box display='flex' alignItems='center'>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Button variant="outlined" onClick={props.close}>
                                        <Typography sx={{ ...TextXSmallFont, color: { ColorPink } }}>
                                            Cerrar
                                        </Typography>
                                    </Button>
                                </Box>
                                {props.children.taskTypes ?
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Link href='#' underline='none' color={ColorPureBlack} sx={{ ...LinkMediumFont, color: { ColorPureBlack } }}>
                                            Ver tarea
                                        </Link>
                                        <DocumentComplete color={ColorPink} />
                                    </Stack> : <></>
                                }
                            </Box>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HomeDialog