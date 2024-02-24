import * as React from 'react'
import { Box, IconButton } from '@mui/material';
import styles from './Layout-styles.module.css'
import CardUser from './CardUser';
import NotifyUser from './NotifyUser';
import { Avatar, Typography } from '../../OuiComponents/DataDisplay';
import { StarBorderOutlined } from '@mui/icons-material';

function ListAppBar(props: any) {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElFavorite, setAnchorElFavorite] = React.useState<null | HTMLElement>(null);
    const [anchorElTask, setAnchorElTask] = React.useState<null | HTMLElement>(null);
    const [anchorElMessage, setAnchorElMessage] = React.useState<null | HTMLElement>(null);
    const userImage = localStorage.getItem('userImage')?.toString();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenUserTask = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElTask(event.currentTarget);
    };

    const handleOpenUserMessage = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMessage(event.currentTarget);
    };

    const handleOpenUserFavorite = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElFavorite(event.currentTarget);
    };


    return (
        <>
            <Box component='ul'>
                <Box component='li' className={styles['pr25']}>
                    <Box component='span' className={styles['badge'] + ' ' + styles['badge-pill'] + ' ' + styles['badge-onesta']}>{props.data.favorites ? props.data.favorites.length : 0}</Box>
                    <Box component='a' onClick={handleOpenUserFavorite} sx={{ cursor: 'pointer' }}>
                        <StarBorderOutlined sx={{color:"white"}}/>
                    </Box>
                        
                    {props.data.favorites ? <NotifyUser title={'Favoritos'} favorites={props.data.favorites} open={anchorElFavorite} close={() => setAnchorElFavorite(null)} /> : <></>}
                    
                </Box>
                <Box component='li' className={styles['pr25']}>
                    <Box component='span' className={styles['badge'] + ' ' + styles['badge-pill'] + ' ' + styles['badge-onesta']}>{props.data.task ? props.data.task.length : 0}</Box>
                    <Box component='a' onClick={handleOpenUserTask} sx={{ cursor: 'pointer' }}>
                        <Box component='img' src={"/img/Iconos/tasks.svg"} />
                    </Box>
                    <NotifyUser title={'Tareas'} task={props.data.task} open={anchorElTask} close={() => setAnchorElTask(null)} />
                </Box>
                <Box component='li' className={styles['pr25']}>
                    <Box component='span' className={styles['badge'] + ' ' + styles['badge-pill'] + ' ' + styles['badge-onesta']}>{props.data.message ? props.data.message.length : 0}</Box>
                    <Box component='a' onClick={handleOpenUserMessage} sx={{ cursor: 'pointer' }}>
                        <Box component='img' src={"/img/Iconos/notify.svg"} />
                    </Box>
                    {props.data.message ? <NotifyUser title={'Mensajes'} message={props.data.message} open={anchorElMessage} close={() => setAnchorElMessage(null)} /> : <></>}
                </Box>
                <Box component='li'>
                    <Box component='div' className={styles['dropbtn'] + ' ' + styles['d-flex'] + ' ' + styles['align-items-center']}>
                        <Box component='span'>
                            <Typography variant='h6'>
                                {props.data.user.name + ' ' + props.data.user.lastName + ' ' + props.data.user.maternalLastName}
                            </Typography>
                        </Box>
                        <Box component='span' className={styles['img-user']}>
                            <Avatar src={userImage} />
                        </Box>
                        <Box component='span' className={styles['pl10']} >
                            <IconButton onClick={handleOpenUserMenu}>
                                <Box component='img' src={"/img/Iconos/ArrowChevronDown.svg"} />
                            </IconButton>
                        </Box>
                        <CardUser data={props.data.user} dataCompany={props.dataCompany} open={anchorElUser} close={() => setAnchorElUser(null)} />
                    </Box>
                </Box>
            </Box>
        </>
    )
};

export default ListAppBar;