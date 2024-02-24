// agregar al gitignore ¿?
import { API_URL, Enviroment, WEB_URL } from './enviroment/enviroment';


export const config = {
    appId: '861926e3-d5af-4a91-9c6a-8a0ab3da6751',
    redirectUri: WEB_URL + "/index",
    scopes: [
        'user.read'
    ],
    authority: 'https://login.microsoftonline.com/a784ea0e-d2b3-4959-a5b8-cd26fe5ce0de/'
};
/*export const config = {
    appId: '57296e34-63cf-4c06-8e9c-a84f2fac34fa',
    redirectUri: 'http://localhost:3000',
    scopes: [
        'user.read'
    ],
    authority: 'https://login.microsoftonline.com/e2e80e7d-4ed9-4b92-a82a-852b6105dfa4/'
};*/