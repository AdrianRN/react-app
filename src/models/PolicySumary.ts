export default interface policySumary {
  policyFolio: string;
  createdAt: Date; //Emisión
  startValidity: Date; //Vigencia De
  endValidity: Date; //Vigencia Hasta
  paymentMethod: string; //Pago Anual
  netPremium: number; //Prima Neta
  additionalCharge: number; //Recargo Monto
  surcharge?: number; //Recargo %
  iva: number; //Iva Monto
  rights: number; //Derecho Monto/GastoExpedicion
  //Descuento %
  //Descuento Monto
  settingOne?: number; //Descuento 1
  settingTwo?: number; //Descuento 2
  totalPremium: number; //Prima Total
  //compania
  insuranceId?: string;
  insuranceCompany?: string;
  //grupo
  groups?: string;
  groupsDescription?: string;
  //cliente
  clientId?: string;
  clientName?: string;
  //ramo
  branchId?: string;
  branch?: string;
  //Informacion de pago
  payReceipt?:string,
  currency?:string,
  //Tipo de poliza:
  policyType?:string,

  //Es un preview
  receiptStatus?:string,

  //Vendedor:
  sellerFolio?:string,

  //poliza
  noPolicy?:string,

  commissions?: number,
  manufacturingFee?:number,
}
