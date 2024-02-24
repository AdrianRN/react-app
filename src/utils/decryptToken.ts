import { AES, enc } from 'crypto-js';

export const getToken = () => {
    const encryptedToken = localStorage.getItem('token');
  
    try {
      if (encryptedToken) {
        const decryptedBytes = AES.decrypt(encryptedToken, `${process.env.REACT_APP_ENCRYPTION_KEY}`);
        const decryptedToken = decryptedBytes.toString(enc.Utf8);
  
        if (decryptedToken) {
          console.log(decryptedToken);
        } else {
          console.log('Could not decrypt token.');
        }
      } else {
        console.log('Encrypted token not found in localStorage.');
      }
    } catch (error) {
      console.log('Error decrypting token:', error);
    }
  };