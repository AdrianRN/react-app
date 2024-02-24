import { StarBorderOutlined } from '@mui/icons-material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import FavoritesContext from '../../../context/favorite-context'
import Message from '../../../models/Message'
import Task from '../../../models/Task'
import Favorites from '../../../models/favorites'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '../../OuiComponents/DataDisplay'
import Typography from '../../OuiComponents/DataDisplay/Typography'
import { Delete, DocumentComplete, Notification } from '../../OuiComponents/Icons'
import { Button, Checkbox } from '../../OuiComponents/Inputs'
import Box from '../../OuiComponents/Layout/Box'
import Menu from '../../OuiComponents/Navigation/Menu'
import { ColorPink, TextXSmallBoldFont, TextXSmallFont } from '../../OuiComponents/Theme'
import HomeModal from '../Home/HomeModal'
import styles from './Layout-styles.module.css'

function NotifyUser(props: any) {
    const [open, setOpen] = React.useState(false);
    const [detail, setDetail] = React.useState<Message | Task | Favorites>()

    const handleMessage = (data: any) => {
        setDetail(data)
        setOpen(true)
    }

    const navigate = useNavigate();

    /**Use context Favorite */

    const ctxFavorite = useContext(FavoritesContext);


    return (
        <>
            {detail ? <HomeModal children={detail} open={open} close={() => setOpen(false)} /> : <></>}
            <Menu
                sx={{ mt: '35px' }}
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
                        width: 400,
                        maxHeight: 200
                    }}
                    className={styles['notify-menu']}
                >
                    <Box>
                        <List
                            subheader={
                                <>
                                    <ListSubheader>
                                        <Typography sx={TextXSmallBoldFont}>
                                            {props.title}
                                        </Typography>
                                    </ListSubheader>
                                </>
                            }>
                            {props.title === "Tareas" ?
                                props.task ?
                                    Object(props.task).map((task: any) => (
                                        <List key={task.taskId}>
                                            <ListItem secondaryAction={<Checkbox edge="end" checked disabled />} disablePadding >
                                                <ListItemButton sx={{ borderRadius: 2 }} onClick={() => handleMessage(task)}>
                                                    <ListItemIcon>
                                                        <DocumentComplete color={ColorPink} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        disableTypography
                                                        primary={<Typography sx={TextXSmallBoldFont}>{task.taskTypes ? task.taskTypes.description : ''}</Typography>}
                                                        secondary={<Typography sx={{ ...TextXSmallFont, wordBreak: 'break-all' }}>{task.description ?? ''}</Typography>} />
                                                </ListItemButton>
                                            </ListItem>
                                            <Divider />
                                        </List>)) :
                                    <>
                                        <List >
                                            <ListItem disablePadding >
                                                <ListItemIcon>
                                                    <DocumentComplete color={ColorPink} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    disableTypography
                                                    primary={<Typography sx={TextXSmallBoldFont}>No hay tareas activas</Typography>}
                                                />
                                            </ListItem>
                                        </List>
                                    </> :
                                props.title === "Favoritos" ?
                                    ctxFavorite?.favorites ?
                                        Object(ctxFavorite?.favorites).map((favorite: any) => (
                                            <List key={favorite.folio}>
                                                <ListItem disablePadding >
                                                    <ListItemButton sx={{ borderRadius: 2 }} onClick={() => navigate(favorite.url)}>
                                                        <ListItemIcon>
                                                            <StarBorderOutlined sx={{ color: ColorPink }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            disableTypography
                                                            primary={<Typography sx={{ ...TextXSmallFont, wordBreak: 'break-all' }}>{favorite.description ? favorite.description : ''}</Typography>}
                                                        />

                                                    </ListItemButton>
                                                    <Button variant='text' onClick={() =>
                                                        ctxFavorite?.deleteFavorite(favorite.folio)
                                                        //handleFavoriteDeleteClick(favorite.favoriteId)
                                                    }>
                                                        <Delete color={ColorPink} />

                                                    </Button>
                                                </ListItem>
                                                <Divider />
                                            </List>)) :
                                        <>
                                            <List >
                                                <ListItem disablePadding >
                                                    <ListItemIcon>
                                                        <StarBorderOutlined />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        disableTypography
                                                        primary={<Typography sx={TextXSmallBoldFont}>No hay favoritos</Typography>}
                                                    />
                                                </ListItem>
                                            </List>
                                        </> :
                                    props.message ?
                                        Object(props.message).map((message: any) => (
                                            <List key={message.messageId}>
                                                <ListItem secondaryAction={<Checkbox edge="end" checked disabled />} disablePadding>
                                                    <ListItemButton sx={{ borderRadius: 2 }} onClick={() => handleMessage(message)}>
                                                        <ListItemIcon>
                                                            <Notification color={ColorPink} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            disableTypography
                                                            primary={<Typography sx={TextXSmallBoldFont}>{message.title ?? ''}</Typography>}
                                                            secondary={<Typography noWrap={false} sx={{ ...TextXSmallFont, wordBreak: 'break-all' }}>{message.description ?? ''}</Typography>} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <Divider />
                                            </List>
                                        )) :
                                        <>
                                            <List >
                                                <ListItem disablePadding >
                                                    <ListItemIcon>
                                                        <Notification color={ColorPink} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        disableTypography
                                                        primary={<Typography sx={TextXSmallBoldFont}>No hay mensajes</Typography>}
                                                    />
                                                </ListItem>
                                            </List>
                                        </>
                            }
                        </List>
                    </Box>
                </Box>
            </Menu >
        </>
    )
}

export default NotifyUser

