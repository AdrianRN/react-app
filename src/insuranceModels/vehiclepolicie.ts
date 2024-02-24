export interface IVehiclePolicy{
    vehiclePolicyId: string, 
    folio: string,
    policyFolio: string,
    noPolicy: string,
    vehicleFolio: string,
    noSerie: string,
    motor: string,
    useFolio: string,
    serviceFolio: string,
    state: string,
    plates: string,
    beneficiaryFolio: string,
    vehicle: {
        vehicleId: string,
        folio: string,
        vehicle: number,
        cmst: string,
        brand: string,
        subbrand: string,
        typeVehicle: string,
        description: string,
        shortDescription: string,
        places: number,
        model: number,
        weight: string
      }
}

export default IVehiclePolicy