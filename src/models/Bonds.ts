export interface IBonds {
  folio: string,
  folioOT: string,
  noPolicy: string,
  suretyCompany: string, // AFIANZADORA
  debtor: string,
  beneficiaryName:string, //BENEFICIARIO
  currency: string,
  exchangeRate: string,
  branch: string, //RAMO
  subBranch: string,
  salesperson: string,
  beneficiary: string,
  rateIva: string, //TASA IVA
  relatedTo: string,
  group: string,
  project: string,
  transactionAmount: number,  //MONTO MOVIMIENTO
  issuanceExpensesBonds: number, //GASTOS DE EXP.
  issuanceExpensesReceipt: number,//GASTOS DE EXP. //Esto es para recibo fianza
  investigationExpenses: number,//GASTOS INVESTIGACIÓN
  netPremium: number, //PRIMA NETA //Esto es para recibo fianza
  fees: number, //DERECHOS //Esto es para recibo fianza
  commissionPercentage: number,
  bonus: number,
  maquilaPercentage: number,
  tariff: number,   //TARIFA
  bureauExpenses: number,//GASTOS BURO
  rppExpenses: number,  //GASTOS RPP
  subtotal: number, //SUBTOTAL //Esto es para recibo fianza
  iva: number   //IVA //Esto es para recibo fianza
  totalAmount: number, //MONTO TOTAL //Esto es para recibo fianza
  commissionAmount: number,
  maquila: number,
  startCoverage: string,      //INICIO DE VIGENCIA
  endExecutionPeriod: string, //FECHA FIN PLAZO DE EJECUCIÓN
  maximumClaim: string,     //FECHA MAX DE RECLAMACIÓN
  applicationDate: string,     //FECHA MAX DE SOLICITUD
  authorizationDate: string,     //FECHA MAX DE AUTORIZACION
  sourceDocument: string,
  sourceDocumentType: string,
  sourceDocumentAmount: number,
  maturityType: string,
  endCoverage: string,    //FIN DE VIGENCIA
  issuanceDate: string,   //FECHA DE EMISIÓN
  statuteLimitationsDate: string,//FECHA DE PREESCRIPCIÓN
  number: string,
  sourceDocumentDate: string,
  titleSourceDocument: string,
  bondStatusFolio: string,
  objectStatusId: number,
  xmlUrl?: string,
  uuid?: string
}

export default IBonds;