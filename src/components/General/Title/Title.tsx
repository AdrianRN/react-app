import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useContext } from 'react';
import FavoritesContext from '../../../context/favorite-context';
import Typography from '../../OuiComponents/DataDisplay/Typography';
import { AddFavorite, Star } from '../../OuiComponents/Icons';
import { ColorPink, DisplaySmallBoldFont } from '../../OuiComponents/Theme';


export default function Title(props: any) {
    const [favorite, setFavorite] = React.useState<any | undefined>(undefined)
    /**Use context Favorite */
    const ctxFavorite = useContext(FavoritesContext);
    //const [personId, setPersonId] = React.useState('');
    //const [saveFavorite, setFavorite] = React.useState<Favorites[]>([]);

    React.useEffect(()=>{
        setFavorite(ctxFavorite?.favorites.find((favorite:any) =>  favorite.url === props.url) ?? undefined)
    })

    return (
        <>
            <Box sx={{ pt: 2 ,pb:3}}>

                <Stack direction='row' spacing={1} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'stretch'
                }}>
                    <Typography sx={DisplaySmallBoldFont} >
                        {props.title}
                    </Typography>
                    
                    {favorite ?
                         
                        <Button variant='text' onClick={ () => ctxFavorite?.deleteFavorite(favorite.folio)}>
                            <Star color={ColorPink} />
                        </Button>
                        :
                        <Button variant="text" onClick={ () => ctxFavorite?.addFavorite({personId: ctxFavorite.personId , url: props.url, description: props.title, objectStatusId: 1})} >
                            <AddFavorite color={ColorPink} />
                        </Button>
                        
                    }
                    
                </Stack>
            </Box>

        </>
    );
}





