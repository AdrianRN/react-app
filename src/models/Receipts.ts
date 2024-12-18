export interface Receipts {
    receiptFolio: string,
    policyType: string,
    policyFolio: string,
    receiptNumber: number,
    totalReceipts: number,
    startValidity: string,
    endValidity: string,
    validityDate: string,
    dueDate: string,
    receiptStatus: string,
    descriptionReceiptStatus: {
        description: string,
        folio: string
    },
    netPremium: number,
    settingOne: number,
    settingTwo: number,
    additionalCharge: number,
    rights: number,
    limitPayDate?:string,
    financing: number,
    iva?: string,
    payReceipt?:string,
    ivaAmount: number,
    ivaPercentage: number,
    surcharge: number,
    paymentMethod?:string
    subtotal: number,
    financingPercentage: number,
    grandTotal: string,
    netPremiumAmount:number,//
    clientId: string,
    clientName: string,
    createdBy: string,
    branchId: string,
    branchName: string,
    groupsId: string,
    sellerFolio:string,
    noPolicy: string,
    groupsName: string,
    insuranceId: string,
    insuranceName: string,
    manufacturingFee: number,
    commissions: number,
    amount: number,
    currency: any,
    objectStatusId: number,
}

export default Receipts;