export interface IFavorites{
    favoriteId:string,
    personId:string,
    url:string,
    description:string
    objectStatusId:number
}


export class Favorites implements IFavorites {
    favoriteId: string = "";
    personId: string = "";
    url: string = "";
    description: string = "";
    objectStatusId: number = 1;
    
  }
export default Favorites