import policySuymary from "../../../../models/PolicySumary";
import Constants from "../../../../utils/Constants";
import ReceiptsService from "../../../../services/receipts.service";
import dayjs, { Dayjs } from "dayjs";

const ROUND = (numb: number) => {
  return Math.ceil(numb * 100) / 100;
};
const TRUNCATE = (numb: number): number => {
  return Math.trunc(numb * 1000) / 1000;
};
const TRUNCATE_2_DECIMALS = (numb: number): number => {
  return Math.trunc(numb * 100) / 100;
};
function truncateToTwoDecimals(num: number) {
  return Math.floor(num * 100) / 100;
}
export default async function receiptsGenerator(paymentData: policySuymary) {
  // console.log("Resumen prima de poliza");
  // console.log(paymentData);
  //Descuento monto = PrimaNeta * (descuento% / 100);
  const discountAmount =
    (paymentData.settingOne ?? 0) + (paymentData.settingTwo ?? 0); //(paymentData.netPremium*(0));
  //netPremiumAmount = PrimaNeta - DescuentoMonto
  const netPremiumAmount = paymentData.netPremium - discountAmount;
  //PrimaTotal = paymentData.netPremium + ivaAmount + paymentData.rights + netPremiumAmount
  const totalPremium =
    paymentData.additionalCharge +
    paymentData.iva +
    paymentData.rights +
    netPremiumAmount;
  const sumary = {
    policyFolio: paymentData.policyFolio,
    createdAt: paymentData?.createdAt, //Emisión
    startValidity: paymentData?.startValidity, //Vigencia De
    endValidity: paymentData?.endValidity, //Vigencia Hasta
    netPremium: paymentData.netPremium,
    surchargeAmount: ROUND(paymentData.additionalCharge),
    surcharge: paymentData.surcharge,
    ivaAmount: paymentData.iva,
    issuingCost: paymentData.rights,
    discountAmount: discountAmount,
    netPremiumAmount: Number(netPremiumAmount.toFixed(2)),
    totalPremium: paymentData.totalPremium,
    //Extras:

    settingOne: paymentData.settingOne,
    settingTwo: paymentData.settingTwo,

    //compania
    insuranceId: paymentData.insuranceId,
    insuranceName: paymentData.insuranceCompany,
    //grupo
    groupsId: paymentData.groups,
    groupsName: paymentData.groupsDescription,
    //cliente
    clientId: paymentData.clientId,
    clientName: paymentData.clientName,
    //ramo
    branchId: paymentData.branchId,
    branchName: paymentData.branch,
    //Informacion de pago
    //payReceipt: paymentData.payReceipt,
    currency: paymentData.currency,
    policyType: paymentData.policyType,
    sellerFolio:paymentData.sellerFolio,

    noPolicy: paymentData?.noPolicy ?? "",

    commissions: paymentData?.commissions ?? 0,
    manufacturingFee:paymentData?.manufacturingFee??0,
  };
  //console.log("Sumary para tablita: ",sumary);
  //console.log(sumary);
  const data:any = monthlyReceipts(sumary, paymentData.paymentMethod);
  let retorno:any;
  //console.log('Datos listos para insertar recibo: ',data);
  //console.log('Recuerda que desactive el post en recibos')

  if(paymentData?.receiptStatus && //Genera recibos dummy
    paymentData?.receiptStatus===Constants.receiptStatus.preview){
    retorno = data;
  }else{
    //console.log('recibos reales',data);
     const result = await ReceiptsService.postReceiptList(data);
     retorno = result.data; 
    //retorno = data;
  }
  return retorno;
}

function monthlyReceipts(sumary: any, paymentMethod: string) {
  // console.log("-------Comienza generacion de recibos-------");
  //console.log('Metodo de pago: '+paymentMethod);
  var months = 1;
  var restOfMonths = 0;
  var suma: number = 0;
  switch (paymentMethod) {
    case "CAVA-234": //ANUAL
      months = 12;
      break;
    case "CAVA-236": //MENSUAL
      months = 1;
      restOfMonths = months - 1;
      break;
    case "CAVA-252": //BIMESTRAL
      months = 2;
      restOfMonths = months - 1;
      break;
    case "CAVA-302": //TRIMESTRAL
      months = 3;
      restOfMonths = months - 1;
      break;
    case "CAVA-235": //SEMESTRAL
      months = 6;
      restOfMonths = months - 1;
      break;
    default:
      //console.log("lal");
  }
  // console.log("Meses: " + months);
  // console.log("Emisión: " + sumary?.createdAt);
  // console.log("Vigencia De: " + sumary?.startValidity);
  // console.log("Vigencia Hasta: " + sumary?.endValidity);

  const createdAtDate = dayjs(sumary?.startValidity);
  const endValidityDate = dayjs(sumary?.endValidity);

  var monthsBetween = endValidityDate.diff(createdAtDate, "months");
  //console.log(`${createdAtDate} - ${endValidityDate} monthsBetween: ${monthsBetween}`); //365 dias para anual

  const iva = 16;
  //Calcular cuantos recibos por metodo de pago
  const receiptsNumber = 12 / months;
  //console.log('Calcular cuantos recibos por metodo de pago: '+receiptsNumber)
  //Primer recibo
  var r_surchargeAmount = ROUND(
    //Actualizado con cambio Simple 20/12/2023
    sumary?.surchargeAmount -
      ROUND(sumary?.surchargeAmount / receiptsNumber) * (receiptsNumber - 1)
  );
  //console.log  (`${sumary?.surchargeAmount}-((${ROUND(sumary?.surchargeAmount / receiptsNumber)})*(${receiptsNumber}-1))=${r_surchargeAmount}`);
  //sumary?.surchargeAmount - (sumary?.surchargeAmount / months) * restOfMonths;
  var issuingCost = sumary?.issuingCost;
  const dayPerMonth = 365 / 12; //(365/12);?
  //console.log("dayPerMonth: " + dayPerMonth);
  const premiumPerDay = sumary?.netPremiumAmount / 365; //365;
  const netPremiumPerMonth = TRUNCATE_2_DECIMALS(
    //Actualizado con cambio Simple 20/12/2023
    TRUNCATE(sumary?.netPremiumAmount / receiptsNumber)
  );
  //dayPerMonth * premiumPerDay;
  const firstnetPremiumMonth = TRUNCATE_2_DECIMALS(
    //Actualizado con cambio Simple 20/12/2023
    sumary?.netPremiumAmount - netPremiumPerMonth * (receiptsNumber - 1)
  );
  //console.log(`${sumary?.netPremiumAmount} - (${netPremiumPerMonth} * (${receiptsNumber} - 1) )`);
  //sumary?.netPremiumAmount - netPremiumPerMonth * restOfMonths; //Solo la primera vez
  //IVA Monto
  var r_ivaAmount = TRUNCATE(
    (issuingCost + r_surchargeAmount + firstnetPremiumMonth) * (iva / 100)
  );
  var totalPremium = ROUND(
    //Para que me diera en mensual antes era dentro de  ROUND ()
    issuingCost + r_surchargeAmount + r_ivaAmount + firstnetPremiumMonth
  );
  //Manejo de fechas
  var days = dayPerMonth+1;
  //Esta variable determina cada que mes se iniciara su vigencia
  const receiptMonthStart = monthsBetween/receiptsNumber;
  //console.log(`${monthsBetween}/${receiptsNumber} Cada recibo se pagara cada ${receiptMonthStart} MES.`);
  var secuencyDate = createdAtDate;

  const receiptsObjectsArray = [];
  var tempEndDate = secuencyDate.add(1, "month");
  //Calculamos la comision
  const commission = sumary?.commissions??0/receiptsNumber;
  receiptsObjectsArray.push({
    policyType: sumary.policyType,//"Seguro",
    policyFolio: sumary?.policyFolio,
    startValidity: secuencyDate.toISOString(), //"2023-12-14T23:11:08.598Z",
    endValidity: tempEndDate.toISOString(), //"2023-12-14T23:11:08.598Z",
    dueDate: tempEndDate.add(1, "day").toISOString(), //"2023-12-14T23:11:08.598Z",
    receiptStatus: Constants.receiptStatus.pending,
    netPremium: sumary?.netPremium,
    settingOne: sumary?.settingOne,
    settingTwo: sumary?.settingTwo,
    additionalCharge: r_surchargeAmount,
    rights: issuingCost,
    financing: 0,
    ivaAmount: r_ivaAmount,
    ivaPercentage: iva,
    surcharge: sumary?.surcharge,
    subtotal: 0,
    grandTotal: totalPremium,
    netPremiumAmount: firstnetPremiumMonth, //Solo el primero RECORDAR netPremiumPerMonth

    //compania
    insuranceId: sumary.insuranceId,
    insuranceName: sumary.insuranceName,
    //grupo
    groupsId: sumary.groupsId,
    groupsName: sumary.groupsName,
    //cliente
    clientId: sumary.clientId,
    clientName: sumary.clientName,
    //ramo
    branchId: sumary.branchId,
    branchName: sumary.branchName,
    //Nuevos ramos
    receiptLogs: null,
    manufacturingFee: sumary.manufacturingFee??0,
    commissions: commission,
    amount: 0,
    limitPayDate: tempEndDate.add(15, "day").toISOString(),//"2024-01-12T21:15:05.151Z",
    paymentMethod: "",
    //Informacion de pago
    payReceipt: null,//tempEndDate.add(15, "day").toISOString(),
    currency: sumary.currency,

    sellerFolio:sumary.sellerFolio,

    noPolicy:  sumary?.noPolicy ?? "",
  });
  secuencyDate = secuencyDate.add((receiptMonthStart), "months");
  suma += totalPremium;
  //Para el resto de los recibos Recibo2
  issuingCost = 0;
  r_surchargeAmount = ROUND(sumary?.surchargeAmount / receiptsNumber);
  //console.log(`(${sumary?.surchargeAmount} / ${receiptsNumber} = ${r_surchargeAmount})`)
  r_ivaAmount = TRUNCATE(
    (issuingCost + r_surchargeAmount + netPremiumPerMonth) * (iva / 100)
  );
  totalPremium =
    issuingCost + r_surchargeAmount + r_ivaAmount + netPremiumPerMonth;
  for (var i = 2; i <= receiptsNumber; i++) {
    tempEndDate = secuencyDate.add(1, "month");//.add(Math.floor(dayPerMonth), "day");
    receiptsObjectsArray.push({
      policyType: sumary.policyType,//"Seguro",
      policyFolio: sumary?.policyFolio,
      startValidity: secuencyDate.toISOString(), //"2023-12-14T23:11:08.598Z",
      endValidity: tempEndDate.toISOString(), //"2023-12-14T23:11:08.598Z",
      dueDate: tempEndDate.add(-1, "day").toISOString(), //"2023-12-14T23:11:08.598Z",
      receiptStatus: Constants.receiptStatus.pending,
      netPremium: sumary?.netPremium,
      settingOne: sumary?.settingOne,
      settingTwo: sumary?.settingTwo,
      additionalCharge: r_surchargeAmount,
      rights: issuingCost,
      financing: 0,
      ivaAmount: r_ivaAmount,
      ivaPercentage: iva,
      surcharge: sumary?.surcharge,
      subtotal: 0,
      grandTotal: totalPremium,
      netPremiumAmount: netPremiumPerMonth,

      //compania
      insuranceId: sumary.insuranceId,
      insuranceName: sumary.insuranceName,
      //grupo
      groupsId: sumary.groupsId,
      groupsName: sumary.groupsName,
      //cliente
      clientId: sumary.clientId,
      clientName: sumary.clientName,
      //ramo
      branchId: sumary.branchId,
      branchName: sumary.branchName,
      //Nuevos ramos
      receiptLogs: null,
      manufacturingFee: sumary.manufacturingFee??0,
      commissions: commission,
      amount: 0,
      limitPayDate: tempEndDate.add(15, "day").toISOString(),//"2024-01-12T21:15:05.151Z",
      paymentMethod: "",
      //Informacion de pago
      payReceipt: null,//tempEndDate.add(15, "day").toISOString(),
      currency: sumary.currency,

      sellerFolio:sumary.sellerFolio,
      noPolicy:  sumary?.noPolicy ?? "",
    });
    secuencyDate = secuencyDate.add(receiptMonthStart, "months");
    suma += totalPremium;
  } //console.log("suma: " + ((suma)));
  //console.log("suma: " + truncateToTwoDecimals(suma));
  return receiptsObjectsArray;
  //console.log(JSON.stringify(receiptsObjectsArray));
}

//Objeto
/*
  createdAt: paymentData?.createdAt, //Emisión
    startValidity: paymentData?.startValidity, //Vigencia De
    endValidity: paymentData?.endValidity, //Vigencia Hasta

    var initialValues: ModelReceipts = {
      receiptFolio: "",
      receiptNumber: 0,
      totalReceipts: 0,
      policyType: ,
      policyFolio:          sumary?.policyFolio,
      startValidity: ,
      endValidity: ,
      validityDate: ,
      dueDate: ,
      receiptStatus: ,
      netPremium:           sumary?.netPremium,
      settingOne:           sumary?.settingOne,
      settingTwo:           sumary?.settingTwo,
      additionalCharge:     r_surchargeAmount,
      rights:               issuingCost,
      financing: ,
      ivaAmount:            r_ivaAmount,
      ivaPercentage:        iva,
      surcharge:            sumary?.surcharge,
      subtotal: ,
      financingPercentage: ,
      grandTotal:           totalPremium,
      objectStatusId: ,
    };
        
//CATA 18 para status
//'https://localhost:7298/api/CatalogValue/GetCatalogValueCatalog/CATA-18'
//'https://localhost:7298/api/CatalogValue/GetCatalogValueFolio/CAVA-94'
*/
