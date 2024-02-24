import { PublicClientApplication } from '@azure/msal-browser';
import { config } from '../src/azureConfig';

const msalConfig = {
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri,
    authority: config.authority,
  },
  cache: {
    cacheLocation: "localStorage", // storing sesionData in localStorage
    storeAuthStateInCookie: true,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;