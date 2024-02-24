import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Card, CardContent, Link, ListItemButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import styles from './Home-styles.module.css';
import { List, ListItem } from '../../OuiComponents/DataDisplay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeModal from './HomeModal';
import Message from '../../../models/Message';
import Task from '../../../models/Task';

function HomeContent(props: any) {
    const [open, setOpen] = React.useState(false);
    const [detail, setDetail] = React.useState<Message | Task>()


    const getMessage = (data: any) => {
        
        setDetail(data)
        setOpen(true)
    }

    return (
        <>
            {detail ? <HomeModal children={detail} open={open} close={() => setOpen(false)} /> : <></>}
            <Box component='h2' m={'20px 0px'}>
                <Typography component='span' sx={{
                    fontFamily: 'sans-serif',
                    fontSize: '22.5px',
                    fontWeight: 'bold',
                    margin: '20px 0px'
                }}>
                    <QuestionAnswerOutlinedIcon />
                    <Box component='span' sx={{
                        paddingLeft: '15px',
                        fontFamily: 'Titillium Web'
                    }}>
                        {props.title}
                    </Box>
                </Typography>
            </Box>
            <Box className={styles['card-scroll']} sx={{ pl: '2px', pb: '2px', pt: '2px', pr: '3px' }}>
                <Card sx={{
                    width: '350px',
                    borderRadius: '15px',
                }}>
                    <CardContent sx={{ paddingBottom: 0 }} >
                    <Box>
                        {props && (
                            (props.task && props.task.length > 0) || (props.message && props.message.length > 0) ? (
                                Object((props.task ? props.task : props.message)
                                .filter((x: any) => x.objectStatusId === 1))
                                .sort((a:any, b:any) => a.createDate < b.createDate ? 1 : -1)
                                .map((data: any) => (
                                    
                                    <List disablePadding key={data.taskId ? data.taskId : data.messageId}>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => getMessage(data)} sx={{
                                                width: '300px',
                                                fontSize: '15px',
                                                fontFamily: 'Titillium Web',
                                                padding: '8px',
                                                justifyContent: 'space-between',
                                                borderBottom: ' 1px solid rgb(247, 247, 252)'
                                            }}>
                                                {data.taskTypes ? data.taskTypes.description : data.title}
                                                <ArrowForwardIcon sx={{
                                                    width: '15px',
                                                    fontWeight: 'normal',
                                                    fontStyle: 'normal',
                                                    height: '15px',
                                                    color: 'rgb(229, 16, 93)'
                                                }} />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                ))
                            ) : (
                                <>
                                    {props.task && <p>no hay tareas disponibles</p>}
                                    {props.message && <p>no hay mensajes disponibles</p>}
                                </>
                            )
                        )}
                    </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

export default HomeContent