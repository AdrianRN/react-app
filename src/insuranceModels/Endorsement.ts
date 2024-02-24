import ModelPolicy from "./policies";
import IVehiclePolicy from "./vehiclepolicie";

export interface IEndorsement {
    folio: string,
    folioOT: string,
    policy: string,
    endorsementType: string,
    endorsementMovement: string,
    numberEndorsement: string,
    concept: string,
    startDate: string,
    endDate: string,
    terminationDate: string,
    amount: number,
    netPremium: number,
    fees: number,
    issuanceExpenses: number,
    iva: string,
    totalPremium: number,
    attachedFiles: string,
    settingOne: number,
    settingTwo: number,
    rights: number,
    financing: number,
    financingPercentage:number,
    additionalCharge:number;
    subTotal: string;
    transactions:string,
    objectStatusId: number,
    customPackageFolio?: string,
    endorsementStatus?: string,
    policies: ModelPolicy[],
    vehiclePolicy: IVehiclePolicy[],
    createdAt?:string,
}