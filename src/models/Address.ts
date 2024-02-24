export interface Address {
    addressId: string,
    folio: string,
    alias: string,
    street: string,
    numberIn: string,
    numberOut: string,
    colony: string,
    city: string,
    state: string,
    country: string,
    zip: number,
    personId: string,
    companyId: string,
    objectStatusId: number,
    person: [],
    companies: []
}

export default Address