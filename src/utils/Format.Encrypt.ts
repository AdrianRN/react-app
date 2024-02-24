import CryptoJS from 'crypto-js'

const encryptString = (data: string): string => {
    const bytes = CryptoJS.AES.decrypt(data, `${process.env.REACT_APP_ENCRYPTION_KEY}`)

    if (bytes.toString(CryptoJS.enc.Utf8)) {
        return data
    } else {
        return CryptoJS.AES.encrypt(data, `${process.env.REACT_APP_ENCRYPTION_KEY}`).toString()
    }
}

const decryptString = (dataEncrypt: string): string => {
    const bytes = CryptoJS.AES.decrypt(dataEncrypt, `${process.env.REACT_APP_ENCRYPTION_KEY}`)
    return bytes.toString(CryptoJS.enc.Utf8)
}

const FormatEncrypt = {
    encryptString,
    decryptString
}

export default FormatEncrypt