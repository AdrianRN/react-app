import { Box, Skeleton, Stack } from '@mui/material'
import React from 'react'

function ModalFormUserSkeleton() {
    return (
        <>
            <Box sx={{ pr: 6, pl: 2, pt: 2, pb: 2 }}>
                <Stack direction='column' spacing={4}>
                    <Stack direction='row' spacing={4} >
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={4} >
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={4} >
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={4} >
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                        <Stack direction='column' spacing={1}>
                            <Skeleton variant='rounded' sx={{ width: 70, minHeight: 10 }} />
                            <Skeleton variant='rounded' sx={{ width: 230, minHeight: 45 }} />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default ModalFormUserSkeleton