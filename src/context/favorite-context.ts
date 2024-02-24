import { createContext } from 'react';
import Favorites from '../models/favorites';

interface FavoritesContextProps {
    favorites: Favorites[] ;
    addFavorite: (data: any) => void;
    deleteFavorite: (folio: string) => void;
    personId: string;
  }
const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export default FavoritesContext;