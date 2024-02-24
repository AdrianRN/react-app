// #region Declaración Constantes

// #region Folios Catalogos
const useCatalogFolio = 'CATA-52' //FOLIO CATALOGO USO
const serviceCatalogFolio = 'CATA-53' //FOLIO CATALOGO SERVICIO
const originsCatalogFolio = 'CATA-19' //FOLIO CATALOGO ORIGEN
const groupsCatalogFolio = 'CATA-22' //FOLIO CATALOGO GRUPO
const beneficiaryGroupFolio = 'CATA-81' //FOLIO CATALOGO GRUPO BENEFICIARIO
const suretiesCatalogFolio = 'CATA-75' //FOLIO CATALOGO AFIANZADORAS
const subBranchI = 'CATA-28233fe1461b' //FOLIO CATALOGO SUBRAMOS
const subBranchFidelityBondCatalogFolio = 'CATA-77'
const subBranchJudicialBondCatalogFolio = 'CATA-78'
const subBranchCreditBondCatalogFolio = 'CATA-79'
const subBranchTrustBondCatalogFolio = 'CATA-80'
const companyTypeCatalogFolio = 'CATA-0' //FOLIO CATALOGO TIPO DE COMPAÑIA
const prorratingCatalogFolio = 'CATA-37' //FOLIO CATALOGO PRORRATEO
const branchesCatalogFolio = 'CATA-1' //FOLIO CATALOGO RAMO
const subBranchesCatalogFolio = 'CATA-2' //FOLIO CATALOGO SUBRAMO
const statusCatalogFolio = 'CATA-15'
const currencyCatalogFolio = 'CATA-12'//TIPO DE MONEDAS DE PAGO
const tasaIVACatalogFolio = 'CATA-59'
const projectCatalogFolio = 'CATA-60'
const sourceDocumentCatalogFolio = 'CATA-4'
const maturityTypeCatalogFolio = 'CATA-61'
const nationalitiesCatalogFolio = 'CATA-45'
const gendersCatalogFolio = 'CATA-9'
const typePersonCatalogFolio = 'CATA-48'
const paymentMethodCatalogFolio = 'CATA-11'//FOLIO METODO DE PAGO
const collectionTypeCatalogFolio = 'CATA-38'
const countriesCatalogFolio = 'CATA-54'
const paymentFrequencyCatalogFolio = 'CATA-56'
const naturalPersonCatalogFolio = 'CATA-62'
const juridicalPersonCatalogFolio = 'CATA-84'
const bondEndorsementTypeCatalogFolio = 'CATA-71'
const typeCarResponsibilityFolio = 'CATA-23'
const insuranceTypeFolio = 'CATA-55'
const vehicleOriginFolio = 'CATA-57'
const civilStatusFolio = 'CATA-58'
const endorsmentTypeFolio = 'CATA-3'
const insuranceCompaniesFolio = 'CATA-20'
const clasificationSubsectionFolio = 'CATA-68'
const sectorFolio = 'CATA-74'
const endorsementInsuranceCatalogFolio = 'CATA-63'
const endorsementInsuranceTypeACatalogFolio = 'CATA-64'
const endorsementInsuranceTypeBCatalogFolio = 'CATA-65'
const endorsementInsuranceTypeDCatalogFolio = 'CATA-66'
const statusEndosermentInsuranceCatalogFolio = 'CATA-82'
const maquilaPercentagesCatalogFolio = 'CATA-ded913830a1b'
// #endregion

// #region variables generales
const typeSuretyCompany = "AFIANZADORA"; //TEXTO TIPO AFIANZADORA
const typeInsuranceCompany = "ASEGURADORA"; //TEXTO TIPO ASEGURADORA
const sureties = "FIANZAS"; //TEXTO FIANZAS
const statusActive = "VIGENTE"; //TEXTO ESTATUS VIGENTE
const statusPending = "EN PROCESO"; //TEXTO ESTATUS EN PROCESO
const statusExpired = "VENCIDA";
const typePersonSeller = "VENDEDOR";
const typePersonLead = "LIDER";
const typePersonEjecutive = "EJECUTIVO_FIANZAS";
const folioInsuranceCompany = "CAVA-183"; //FOLIO TIPO ASEGURADORA
const folioSuretyCompany = "CAVA-197"; //FOLIO TIPO AFIANZADORA
const folioCurrencyMXN = "CAVA-68"; //FOLIO MONEDA MEXICANA
const folioBondBranch = "CAVA-4b372a68944c"; //FOLIO RAMO FIANZA
const folioCarBranch = "CAVA-1"; //FOLIO RAMO AUTO
const folioFleetsBranch = "CAVA-0"; //FOLIO RAMO FLOTILLA
const folioGroupHealthBranch = "CAVA-3"; //FOLIO RAMO SALUD GRUPO
const folioIndividualHealthBranch = "CAVA-4"; //FOLIO RAMO SALUD INDIVIDUAL
const folioGroupLifeBranch = "CAVA-5"; //FOLIO RAMO VIDA GRUPO
const folioIndividualLifeBranch = "CAVA-223"; //FOLIO RAMO VIDA INDIVIDUAL
const folioPersonalAccidentsBranch = "CAVA-224"; //FOLIO RAMO ACCIDENTES PERSONALES
const folioDiverseBranch = "CAVA-2"; //FOLIO RAMO DIVERSO
const folioSavingBranch = "CAVA-226"; //FOLIO RAMO AHORRO
const folioCreditInsurance = 'CAVA-525f635e1d22'; // FOLIO SEGURO DE CREDITO
const folioA0BondEndorsementType = "CAVA-8c94943c21a1"; //FOLIO TIPO ENDOSO A0
const folioABondEndorsementType = "CAVA-291"; //FOLIO TIPO ENDOSO A
const folioDBondEndorsementType = "CAVA-292"; //FOLIO TIPO ENDOSO D
const folioBBondEndorsementType = "CAVA-293"; //FOLIO TIPO ENDOSO B
const folioAmountIncreaseBondEndorsementMovType = "CAVA-295"; //FOLIO TIPO MOVIMIENTO AUMENTO FIANZA
const folioAmountIncreaseAndExtensionBondEndorsementMovType = "CAVA-296"; //FOLIO TIPO MOVIMIENTO AUMENTO Y PRORROGA FIANZA
const folioAmountDecreaseBondEndorsementMovType = "CAVA-af2805005599"; //FOLIO TIPO MOVIMIENTO DISMINUCION FIANZA
const folioAmountDecreaseAndExtensionBondEndorsementMovType =
  "CAVA-8c61bae5275f"; //FOLIO TIPO MOVIMIENTO DISMINUCION Y PRORROGA FIANZA
const folioConsentBondEndorsementMovType = "CAVA-a24712c81fc6"; //FOLIO TIPO MOVIMIENTO ANUENCIA FIANZA
const folioTextBondEndorsementMovType = "CAVA-a8ab3d100cd9"; //FOLIO TIPO MOVIMIENTO TEXTO FIANZA
const folioExtensionEndorsementMovType = "CAVA-f393ef1c7e4a"; //FOLIO TIPO MOVIMIENTO PRORROGA FIANZA
const statusActiveFolio = "CAVA-78"; //FOLIO ESTATUS VIGENTE
const statusCancelledFolio = "CAVA-79"; //FOLIO ESTATUS CANCELADA
const statusAnnulledFolio = "CAVA-80"; //FOLIO ESTATUS ANULADA
const statusClaimedFolio = "CAVA-81"; //FOLIO ESTATUS RECLAMADA
const statusExpireFolio = "CAVA-82"; //FOLIO ESTATUS VENCIDA
const statusExpiredDateFolio = "CAVA-83"; //FOLIO ESTATUS TERMINO VIGENCIA
const statusPendingFolio = "CAVA-242"; //FOLIO ESTATUS EN PROCESO
const folioMoralPerson = "CAVA-202"; //FOLIO PERSONA MORAL
const folioNaturalPerson = "CAVA-201"; //FOLIO PERSONA FÍSICA
const folioMalePerson = "CAVA-59";
const folioFemalePerson = "CAVA-60";
const folioNationalCar = "CAVA-237";
const folioUsdCurrency = "CAVA-69";
const folioTitular = "CAVA-283";
const folioSubBranchSerie = [
  "SUBR-29",
  "SUBR-31",
  "SUBR-33",
  "SUBR-34",
  "SUBR-46",
]; //SubRamos diverso alta serie
const folioSubBranchLocation = [
  "SUBR-28",
  "SUBR-32",
  "SUBR-37",
  "SUBR-42",
  "SUBR-43",
  "SUBR-45",
]; //SubRamos diverso alta ubicacion
const folioSubBranchDestination = ["SUBR-49"]; //SubRamos diverso alta destino
const folioSubBranchText = [
  "SUBR-30",
  "SUBR-40",
  "SUBR-44",
  "SUBR-47",
  "SUBR-48",
]; //SubRamos diverso alta texto
const folioMexico = "CAVA-221";
const folioPaidReceipts = "CAVA-333";
const folioBranchFianza = "CAVA-4b372a68944c";
// #endregion

// #region metas compañias CATA-49
const annualGoalApproved = "CAVA-ef1e2a42be35"; //FOLIO CATA-49 APROBADO
const annualGoalPlanning = "CAVA-aea18f019240"; //FOLIO CATA-49 PLANEACION

// #region blob contenedores
const companyContainerName = "companylogo";
const personContainerName = "personproceedings";
const logsErrorsContainerName = "errorlogs";
const actuarialAnalysisContainerName = "customeractuarialanalysis";
const accidentRateContainerName = "accidentrate";
const insurancePoliciesCoverContainerName = "insurancepoliciescover";
const amountScoreDebtor = 90;
const receiptdocumentsContainerName = "receiptdocuments";
const claimContainerName = "claimdocument";

// #endregion
// #endregion
//#region status de recibos CATA-83
const folioStatusInForce = "CAVA-332"; //PENDIENTE
const payedReceipt = "CAVA-333"; //PAGADO
const reconciledReceipt = "CAVA-334"; //CONCILIADO
const canceledReceipt = "CAVA-e2c345f5417c"; //CANCELADO

//Recibos estatus CATA-18
const receiptStatus = {
  payed: "CAVA-88", //PAGADO
  pending: "CAVA-89", //PENDIENTE
  term: "CAVA-90", //PLAZO
  overdueNonPayment: "CAVA-91", //VENCIDO VIGENTE SIN COBERTURA POR FALTA DE PAGO
  canceled: "CAVA-92", //CANCELADO
  reconciled: "CAVA-93", //CONCILIADO
  extension: "CAVA-94", //PRORROGA
  commissiones: "CAVA-95", //COMISSIONADO
  preview: "CAVA-535c9100dbd5", //PREVIEW
};

//#Region de movimiento endoso
const endorsementTransactions = {
  //Endoso tipo A
  //INCLUSION COBERTURA
  addCoverage: "CAVA-270",
  //CAMBIO DE FORMA DE PAGO
  switchPayment: "CAVA-271",
  //CAMBIO EN EL PLAN
  switchPackage: "CAVA-272",
  //EXTENSION DE VIGENCIA
  extendVigency: "CAVA-273",
  //ALTA DE ASEGURADO/ UNIDAD
  addEntity: "CAVA-274",

  //Endoso tipo B
  //CAMBIO DE CONTRATANTE
  switchContractor: "CAVA-275",
  //BENEFICIARIO PREFERETE
  addPolicyholder: "CAVA-276",
  //MODIFICAR ENDOSO GENERAL
  modify: "CAVA-277",

  //Endoso tipo D
  //BAJA DE COBERTURA CAVA-278
  cancelCoverage: "CAVA-278",
  //BAJA DE ASEGURADO/ UNIDAD CAVA-280
  removeEntity: "CAVA-280",
  //CANCELACION DE POLIZA
  cancelPolicy: "CAVA-279",
};
const endorsementStatus = {
  pending: "CAVA-328",
  current: "CAVA-329",
  canceled: "",
};
//CATA-56 TIPO DE PAGO
//CAVA-234 ANUAL

//#region policyStatus  CATA-15
//Para llamar a un valor ---> policyStatus['CAVA-78']
const policyStatus: any = {
  "CAVA-78": {
    folio: "CAVA-78",
    description: "VIGENTE",
  },
  "CAVA-79": {
    folio: "CAVA-79",
    description: "CANCELADA",
  },
  "CAVA-80": {
    folio: "CAVA-80",
    description: "ANULADA",
  },
  "CAVA-81": {
    folio: "CAVA-81",
    description: "RECLAMADA",
  },
  "CAVA-82": {
    folio: "CAVA-82",
    description: "VENCIDA",
  },
  "CAVA-83": {
    folio: "CAVA-83",
    description: "TERMINO SU VIGENCIA",
  },
  "CAVA-242": {
    folio: "CAVA-242",
    description: "EN PROCESO",
  },
  "CAVA-258": {
    folio: "CAVA-258",
    description: "ELIMINADA",
  },
};

//Recibos estatus CATA-18
const receiptStatusObject: any = {
  "CAVA-88": {
    folio: "CAVA-88",
    description: "PAGADO",
  },
  "CAVA-89": {
    folio: "CAVA-89",
    description: "PENDIENTE",
  },
  "CAVA-90": {
    folio: "CAVA-90",
    description: "PLAZO",
  },
  "CAVA-91": {
    folio: "CAVA-91",
    description: "VENCIDO VIGENTE SIN COBERTURA POR FALTA DE PAGO",
  },
  "CAVA-92": {
    folio: "CAVA-92",
    description: "CANCELADO",
  },
  "CAVA-93": {
    folio: "CAVA-93",
    description: "CONCILIADO",
  },
  "CAVA-94": {
    folio: "CAVA-94",
    description: "PRORROGA",
  },
  "CAVA-95": {
    folio: "CAVA-95",
    description: "COMISIONADO",
  },
  "CAVA-535c9100dbd5": {
    folio: "CAVA-535c9100dbd5",
    description: "PREVIEW",
  },
};

// "folio": "CATA-75",
// "description": "RAMOS FIANZAS",
const bondBranchesIndexed: any = {
  "CAVA-306": {
    "folio": "CAVA-306",
    "description": "I FIDELIDAD"
  },
  "CAVA-309": {
    "folio": "CAVA-309",
    "description": "II JUDICIALES"
  },
  "CAVA-312": {
    "folio": "CAVA-312",
    "description": "III ADMINISTRATIVAS"
  },
  "CAVA-315": {
    "folio": "CAVA-315",
    "description": "IV CREDITO"
  },
  "CAVA-318": {
    "folio": "CAVA-318",
    "description": "V FIDEICOMISO"
  },
  //NEW DATA
  "CAVA-8296480ef031": {
    "folio": "CAVA-8296480ef031",
    "description": "I FIDELIDAD"
  },
  "CAVA-67864177bf86": {
    "folio": "CAVA-67864177bf86",
    "description": "II JUDICIALES"
  },
  "CAVA-2c7d8089dcd1": {
    "folio": "CAVA-2c7d8089dcd1",
    "description": "III ADMINISTRATIVAS"
  },
  "CAVA-8faf437864da": {
    "folio": "CAVA-8faf437864da",
    "description": "IV CREDITO"
  },
  "CAVA-d03a7fe5cf43": {
    "folio": "CAVA-d03a7fe5cf43",
    "description": "V FIDEICOMISO"
  },

};

//#region Constantes tipo de persona
const typePhysicalPerson = "FÍSICA";
const typeMoralPerson = "MORAL";
// #endregion

//#region Constantes de multicotizador
const chubbInsuranceName = "CHUBB";
const hdiInsuranceName = "HDI";
// #endregion

//#region Constantes de comisiones
const statusComisionado = "COMISIONADO";
// #endregion

// #region Exportación
const Constants = {
  // #region Folios Catalogos
  useCatalogFolio,
  serviceCatalogFolio,
  originsCatalogFolio,
  beneficiaryGroupFolio,
  groupsCatalogFolio,
  companyTypeCatalogFolio,
  prorratingCatalogFolio,
  branchesCatalogFolio,
  suretiesCatalogFolio,
  subBranchI,
  subBranchesCatalogFolio,
  statusCatalogFolio,
  currencyCatalogFolio,
  tasaIVACatalogFolio,
  projectCatalogFolio,
  sourceDocumentCatalogFolio,
  maturityTypeCatalogFolio,
  nationalitiesCatalogFolio,
  gendersCatalogFolio,
  typePersonCatalogFolio,
  paymentMethodCatalogFolio,
  collectionTypeCatalogFolio,
  countriesCatalogFolio,
  paymentFrequencyCatalogFolio,
  naturalPersonCatalogFolio,
  juridicalPersonCatalogFolio,
  bondEndorsementTypeCatalogFolio,
  typeCarResponsibilityFolio,
  insuranceTypeFolio,
  vehicleOriginFolio,
  civilStatusFolio,
  endorsmentTypeFolio,
  insuranceCompaniesFolio,
  clasificationSubsectionFolio,
  sectorFolio,
  endorsementInsuranceCatalogFolio,
  endorsementInsuranceTypeACatalogFolio,
  endorsementInsuranceTypeBCatalogFolio,
  endorsementInsuranceTypeDCatalogFolio,
  subBranchFidelityBondCatalogFolio,
  subBranchJudicialBondCatalogFolio,
  subBranchCreditBondCatalogFolio,
  subBranchTrustBondCatalogFolio,
  statusEndosermentInsuranceCatalogFolio,
  maquilaPercentagesCatalogFolio,
  // #endregion

  // #region variables generales
  typeSuretyCompany,
  typeInsuranceCompany,
  sureties,
  statusActive,
  folioInsuranceCompany,
  folioSuretyCompany,
  folioCurrencyMXN,
  folioBondBranch,
  statusPending,
  statusExpired,
  typePersonSeller,
  typePersonLead,
  typePersonEjecutive,
  folioCarBranch,
  folioFleetsBranch,
  folioGroupHealthBranch,
  folioIndividualHealthBranch,
  folioGroupLifeBranch,
  folioIndividualLifeBranch,
  folioPersonalAccidentsBranch,
  folioDiverseBranch,
  folioSavingBranch,
  folioCreditInsurance,
  folioA0BondEndorsementType,
  folioABondEndorsementType,
  folioDBondEndorsementType,
  folioBBondEndorsementType,
  folioAmountIncreaseBondEndorsementMovType,
  folioAmountIncreaseAndExtensionBondEndorsementMovType,
  folioAmountDecreaseBondEndorsementMovType,
  folioAmountDecreaseAndExtensionBondEndorsementMovType,
  folioConsentBondEndorsementMovType,
  folioTextBondEndorsementMovType,
  folioExtensionEndorsementMovType,
  statusActiveFolio,
  statusCancelledFolio,
  statusAnnulledFolio,
  statusClaimedFolio,
  statusExpireFolio,
  statusExpiredDateFolio,
  statusPendingFolio,
  folioMoralPerson,
  folioNaturalPerson,
  folioMalePerson,
  folioFemalePerson,
  folioNationalCar,
  folioUsdCurrency,
  folioTitular,
  folioSubBranchSerie,
  folioSubBranchLocation,
  folioSubBranchDestination,
  folioSubBranchText,
  folioMexico,
  folioPaidReceipts,
  folioBranchFianza,
  // #endregion

  // #region metas compañía CATA-49
  annualGoalApproved,
  annualGoalPlanning,

  // #region blob contenedores
  companyContainerName,
  personContainerName,
  amountScoreDebtor,
  logsErrorsContainerName,
  receiptdocumentsContainerName,
  actuarialAnalysisContainerName,
  accidentRateContainerName,
  insurancePoliciesCoverContainerName,
  claimContainerName,
  // #endregion
  //#region status recibos pago
  folioStatusInForce,
  payedReceipt,
  reconciledReceipt,
  canceledReceipt,

  receiptStatus, //CATA-18
  receiptStatusObject,
  //#endregion
  //#region Transacciones de Endosos
  endorsementTransactions,
  endorsementStatus,
  //#region Estatus de la poliza:
  policyStatus,

  //#endregion
  //Region ramos fianzas
  bondBranchesIndexed,

  //#region Constantes de multicotizados
  chubbInsuranceName,
  hdiInsuranceName,
  // #endregion

  //#region Constantes tipo de persona
  typePhysicalPerson,
  typeMoralPerson,
  // #endregion
  //#region Constantes de comisiones
  statusComisionado,
  // #endregion
};

// #endregion

export default Constants;
