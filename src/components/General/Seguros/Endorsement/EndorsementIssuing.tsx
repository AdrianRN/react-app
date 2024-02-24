import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import { endorsementService } from "../../../../services/endorsement.service";
import ReceiptsService from "../../../../services/receipts.service";
import Constants from "../../../../utils/Constants";
import { SentVehicleToCopy } from "./AddVehicleToCopy";
import policySuymary from "../../../../models/PolicySumary";
import PeopleService from "../../../../services/people.service";
import CacheService from "../../../../services/cache.service";
import receiptsGenerator from "../Policies/ReceiptsGenerator";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
async function EndorsementIssuing(
  transaction: string,
  policy: any,
  customPackage: string
) {
  //console.log('EndorsementIssuing poliza',policy?.[0],' transaccion: ',transaction)
  //console.log("policy: ", policy);
  let filteredRows: any = undefined;
  if (policy?.[0]?.personPolicie) {
    filteredRows = (policy?.[0]?.personPolicie).filter(
      (row: any) => row.objectStatusId === 1
    );
    //console.log("filteredRowsÑ ", filteredRows);
  }
  let policyPatch: any = {
    //EXTENSION DE VIGENCIA
    endValidity: policy?.[0]?.endValidity,

    //CAMBIO DE CONTRATANTE
    clientName: policy?.[0]?.clientName,
    rfc: policy?.[0]?.rfc,
    street: policy?.[0]?.street,
    state: policy?.[0]?.state,
    municipality: policy?.[0]?.municipality,
    locality: policy?.[0]?.locality,
    zip: policy?.[0]?.zip,
    country: policy?.[0]?.country,

    //CANCELACION DE POLIZA
    policyStatusFolio: policy?.[0]?.policyStatusFolio,

    //ALTA/BAJA DE ASEGURADO/ UNIDAD
    personPolicie: filteredRows ?? policy?.[0]?.personPolicie,

    //Modificacion alguna en el paquete de coberturas
    coveragePackageFolio: customPackage ?? policy?.[0]?.coveragePackageFolio,

  };
  switch (transaction) {
    case Constants.endorsementTransactions.switchPayment: //CAMBIO DE FORMA DE PAGO
        receiptsManagement(policy);
        //console.log('policyPatch: ',policyPatch)
      break;
    case Constants.endorsementTransactions.extendVigency: //EXTENSION DE VIGENCIA
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    case Constants.endorsementTransactions.switchContractor: //CAMBIO DE CONTRATANTE
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    case Constants.endorsementTransactions.cancelPolicy: //CANCELACION DE POLIZA
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    case Constants.endorsementTransactions.addEntity: //ALTA DE ASEGURADO/ UNIDAD
      if (
        policy?.[0]?.personPolicie !== null &&
        policy?.[0]?.vehiclePolicy.length === 0
      ) {
        //console.log('policy?.[0]?.personPolicie: ',policy?.[0]?.personPolicie);
        await endorsementService
          .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
          .then((response) => console.log(""));
      }
      if (
        policy?.[0]?.vehiclePolicy !== null &&
        policy?.[0]?.personPolicie.length === 0
      ) {
        //console.log('policy?.[0]?.vehiclePolicy: ',policy?.[0]?.vehiclePolicy)
        const newVehicles = SentVehicleToCopy(policy?.[0]?.vehiclePolicy);
        await VehiclePolicy.afterPostVehiclePolicy(
          policy?.[0]?.folio,
          newVehicles
        )
          // await VehiclePolicy.postVehiclePolicyList(newVehicles)
          .then((response: any) => {
            //console.log(response)
          })
          .catch((e: Error) => {
            console.error("error sin falla", e);
          });
      }
      break;
    case Constants.endorsementTransactions.removeEntity: //BAJA DE ASEGURADO/ UNIDAD CAVA-280
      if (
        policy?.[0]?.personPolicie !== null &&
        policy?.[0]?.vehiclePolicy.length === 0
      ) {
        //console.log('policy?.[0]?.personPolicie: ',policy?.[0]?.personPolicie);
        await endorsementService
          .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
          .then((response) => console.log(""));
      }
      if (
        policy?.[0]?.vehiclePolicy !== null &&
        policy?.[0]?.personPolicie.length === 0
      ) {
        //console.log('policy?.[0]?.vehiclePolicy: ',policy?.[0]?.vehiclePolicy)
        const newVehicles = SentVehicleToCopy(policy?.[0]?.vehiclePolicy);
        await VehiclePolicy.afterPostVehiclePolicy(
          policy?.[0]?.folio,
          newVehicles
        )
          .then((response: any) => {
            //console.log(response)
          })
          .catch((e: Error) => {
            console.error("error sin falla", e);
          });
      }
      break;
    case Constants.endorsementTransactions.addCoverage: //INCLUSION COBERTURA
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    case Constants.endorsementTransactions.switchPackage: //CAMBIO EN EL PLAN
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    case Constants.endorsementTransactions.cancelCoverage: //BAJA DE COBERTURA CAVA-278
      await endorsementService
        .policyEndorsementIssuance(policy?.[0]?.folio, policyPatch)
        .then((response) => console.log(""));
      break;
    default:
      console.log("No action");
  }
}

export default EndorsementIssuing;
async function receiptsManagement(policy: any) {
  if (policy) {
    const policyPatch = {
        //CAMBIO DE FORMA DE PAGO
    paymentFrequency: policy?.[0]?.paymentFrequency,
    netPremium: policy?.[0]?.netPremium,
    settingOne: policy?.[0]?.settingOne,
    settingTwo: policy?.[0]?.settingTwo,
    rights: policy?.[0]?.rights,
    financing: policy?.[0]?.financing,
    iva: policy?.[0]?.iva,
    totalPremium: policy?.[0]?.totalPremium,
    additionalCharge: policy?.[0]?.additionalCharge,
    subtotal: policy?.[0]?.subtotal,
    commissionPercentage: policy?.[0]?.commissionPercentage,
    }
    //Actualizamos los datos en la poliza    
    await endorsementService.policyEndorsementPayment(policy?.[0]?.folio, policyPatch).then((response)=>console.log(''));
    //console.log('poliza actualizada')
    //Comienza generacion de nuevos recibos
    //1. recuperamos los recibos de la poliza:
    const receipts = await ReceiptsService.getReceiptsByPolicyFolio(policy?.[0]?.folio);
    //2. filtramos aquellos recibos que han sido pagados
    const payedReceipts = (receipts.data).filter((row:any) => 
            row.receiptStatus === Constants.receiptStatus.payed);
    //3. creamos variable la cual almacenara  el total de los recibos pagados
    var sumaGrandTotal = 0;
    if(payedReceipts.length>0){//recibos pagados
        sumaGrandTotal = payedReceipts.reduce((acumulador:any, recibo:any) => {
            return acumulador + recibo.grandTotal;
        }, 0);
    }
    //console.log('sumaGrandTotal: ',sumaGrandTotal)
    //4.Construimos el objeto sumary para generar recibos
    const responseClient = await PeopleService.getById(policy?.[0]?.clientId);
    //console.log('responseClient: ',responseClient)
    const responseGroupsCatalog = await CacheService.getByFolioCatalog(Constants.groupsCatalogFolio);
    const groupIndexed = (responseGroupsCatalog.data.values).reduce((acc: any, el: any) => {
       acc[el.folio] = el;
       return acc;
     }, {});
     const responseBranchesCatalog = await CacheService.getByFolioCatalog(Constants.branchesCatalogFolio);
     const branch = Object(responseBranchesCatalog.data.values ?? [])
.       find((branch: any) => branch.folio === policy?.[0]?.branchId);
     //console.log('branch: ',branch)
        //setGroupsData({ group: responseClient.data.groupId, description: groupIndexed?.[responseClient.data.groupId].description })
      //Recalculando la prima menos lo ya pagado en recibos en caso de existir
    //   const netPremium = Number(policy?.[0]?.netPremium)-sumaGrandTotal;
    //   const additionalCharge = (netPremium - (policy?.[0]?.settingOne + policy?.[0]?.settingTwo)) * (policy?.[0]?.financing / 100);
    //   const subtotal = Number(netPremium) -
    //                     Number(policy?.[0]?.settingOne) -
    //                     Number(policy?.[0]?.settingTwo) +
    //                     additionalCharge +
    //                     Number(policy?.[0]?.rights);
    //   const iva = Number(((Number(subtotal) * 16) / 100 ).toFixed(2));
    //   const totalPremium = Number((Number(subtotal) + Number(iva) ).toFixed(2));
    const valuesData = await CompaniesBranchesService.getBranchesByCompanyFolio(policy?.[0]?.insuranceCompany);
    let commissionsONESTA: number = 0; 
    const indexedBranchData = Object(valuesData.data).reduce((acc: any, el: any)=>{
      acc[el.branch.folio] = el
      return acc
    },{});
    if(indexedBranchData.length>0){
      if(indexedBranchData[policy?.[0]?.branchId].branch.commissionPercentage){
        commissionsONESTA=indexedBranchData[policy?.[0]?.branchId].branch.commissionPercentage;//(policy?.[0]?.netPremium*( Number(indexedBranchData[policy?.[0]?.branchId].branch.commissionPercentage) ??0/100));
      }
    }else{
      //Compania sin ramos :(
    }
    const sumary: policySuymary = {
        policyFolio: policy?.[0]?.folio,
        createdAt: policy?.[0]?.issuanceDate, //Emisión
        startValidity: policy?.[0]?.startValidity, //Vigencia De
        endValidity: policy?.[0]?.endValidity, //Vigencia Hasta
        paymentMethod: policy?.[0]?.paymentFrequency, //Pago Anual CATALOG
        netPremium: policy?.[0]?.netPremium,//netPremium //Prima Neta
        additionalCharge:       policy?.[0]?.additionalCharge, //Number(additionalCharge.toFixed(4)),//Recargo Monto
        surcharge: policy?.[0]?.financing,//surcharge, //Recargo %
        iva:      policy?.[0]?.iva, //iva,//iva,                //Iva Monto
        rights: policy?.[0]?.rights, //Derecho Monto/GastoExpedicion
        settingOne: policy?.[0]?.settingOne ?? 0,
        settingTwo: policy?.[0]?.settingTwo ?? 0, 
        //compania
        insuranceId: policy?.[0]?.insuranceId,
        insuranceCompany: policy?.[0]?.insuranceCompany,
        //grupo
        groups: responseClient.data.groupId,//policyDataHook?.groups,
        groupsDescription: groupIndexed?.[responseClient.data.groupId].description,
        //cliente
        clientId: policy?.[0]?.clientId,
        clientName: policy?.[0]?.clientName,
        //ramo
        branchId: policy?.[0]?.branchId,
        branch: branch.description,//'',
        totalPremium:     policy?.[0]?.totalPremium, //totalPremium,//Prima Total
        //payReceipt: '',
        currency: policy?.[0]?.currency,  
        policyType: "Seguros",
      sellerFolio: policy?.[0]?.salesPerson,
      noPolicy: policy?.[0]?.noPolicy,
      commissions: (policy?.[0]?.netPremium-(policy?.[0]?.settingOne+policy?.[0]?.settingTwo))*(commissionsONESTA??0/100),
    };
    //console.log('sumary: ',sumary)
    //Logica para cancelar recibos, mandarlos a CANCELADO CAVA-92
    await ReceiptsService.changeAllStatusReceipts(policy?.[0]?.folio);
    //Ya cancelados se crean los nuevos recibos
    const newReceipts = await receiptsGenerator(sumary);
    //console.log('newReceipts: ',newReceipts);
    //ahora verificamos si existieron recibos pagados por medio del monto pagado 
    //almacenado en sumaGrandTotal
    if(sumaGrandTotal>0){//En caso de existir se descontara cierta cantidad en cada recibo hasta que sumaGrantotal sea 0
        //newReceipts.data;
        //Extraemos los nuevos recibos pendientes
        const pendingReceipts = (newReceipts.data).filter((row:any) => 
            row.receiptStatus === Constants.receiptStatus.pending);
        
    }
    

  }
}
/*
{
    //EXTENSION DE VIGENCIA
    endValidity:'',

    //CAMBIO DE CONTRATANTE
    clientName:'',
    rfc:'',
    street:'',
    state:'',
    municipality:'',
    locality:'',
    zip:'',
    country:'',

    //CANCELACION DE POLIZA
    policyStatusFolio:'',

    //ALTA/BAJA DE ASEGURADO/ UNIDAD
    personPolicie:[],
}
*/
