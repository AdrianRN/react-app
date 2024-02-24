import { API_URL_BLOBCONTAINER_COMPANYLOGO } from '../enviroment/enviroment';

const dateFormat = (props: Date) => {
    return props.toLocaleDateString('en-Gb', { year: 'numeric', month: '2-digit', day: '2-digit', }).split('/').reverse().join('-')
}

const stringDateFormat = (props: string) => {
    return new Date(Date.parse(props))
        .toLocaleDateString('en-Gb', { year: 'numeric', month: '2-digit', day: '2-digit', }).split('/').reverse().join('-')
}

const stringDateFormatDDMMYYY = (props: string) => {
    return new Date(Date.parse(props))
        .toLocaleDateString('en-Gb', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const stringPascalCaseFormat = (props: string) => {
    return props.toLowerCase()
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .trim()
        .split(' ')
        .map(word => word[0]
            .toUpperCase()
            .concat(word.slice(1)))
        .join(' ')
}

const stringPascalClassFormat = (props: string) => {
    const word = props.split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    return word.replace(/\w+/g, function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); })
}

const dateFormatToISO8601 = (dateInput: string) => {
    const [day, month, year] = dateInput.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const dateFormat = date.toISOString();
    return dateFormat;

}

const formatDateConversion = (dateString: string) => {
    // Split the string into day, month, and year
    const [day, month, year] = dateString.split('/');

    // Create a Date object in the "MM/dd/yyyy" format
    const date = new Date(`${month}/${day}/${year}`);
    // Get date and time components in the desired format
    const formattedYear = date.getUTCFullYear();
    const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const formattedDay = String(date.getUTCDate()).padStart(2, '0');
    const formattedHour = String(date.getUTCHours()).padStart(2, '0');
    const formattedMinute = String(date.getUTCMinutes()).padStart(2, '0');
    const formattedSecond = String(date.getUTCSeconds()).padStart(2, '0');
    const formattedMillisecond = String(date.getUTCMilliseconds()).padStart(3, '0');

    // Format the date in the desired format
    const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:${formattedSecond}.${formattedMillisecond}Z`;

    return formattedDate;
}

const dateCurrentYYYYMMDD = () => {
    const dateCurrent = new Date();
    const year = dateCurrent.getFullYear();
    const month = String(dateCurrent.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque los meses van de 0 a 11
    const day = String(dateCurrent.getDate()).padStart(2, '0');
    const dateFormatCurrent = `${year}-${month}-${day}`;
    return dateFormatCurrent;
}

const getUriLogoCompany = (logo: string) => {
    return `${API_URL_BLOBCONTAINER_COMPANYLOGO}/${logo}`
}

const currencyFormat = (value: number) => {
    return '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const convertToValidSeverity = (severityString: string) => {
    switch (severityString) {
        case "success":
        case "info":
        case "warning":
        case "error":
            return severityString;
        default:
            return "info";
    }
};

const getEndValidityByStartValidty = (startValidity: string) => {
    let endValidity: string = ""
    const fecha = startValidity.split('-')

    if (isLeapYear(Number(fecha[0]))) {
        if (fecha[1] === '02' && fecha[2] === '29') {
            endValidity = (Number(fecha[0]) + 1) + '-03-01'
        } else {
            endValidity = (Number(fecha[0]) + 1) + '-' + fecha[1] + '-' + fecha[2]
        }
    } else {
        endValidity = (Number(fecha[0]) + 1) + '-' + fecha[1] + '-' + fecha[2]
    }

    return endValidity
}

const isLeapYear = (year: number) => {
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

const FormatData = {
    dateFormat,
    stringDateFormat,
    stringDateFormatDDMMYYY,
    stringPascalCaseFormat,
    stringPascalClassFormat,
    dateFormatToISO8601,
    formatDateConversion,
    dateCurrentYYYYMMDD,
    getUriLogoCompany,
    currencyFormat,
    convertToValidSeverity,
    getEndValidityByStartValidty
}

export default FormatData

