import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import { endorsementService } from "../../../../services/endorsement.service";

function AddVehicleToCopy(props: any) {
    const originVehicles: any[] = props.map((item: any) => {
      return {
        beneficiaryFolio: item.beneficiaryFolio,
        motor: item.motor,
        noPolicy: item.policyFolio,
        noSerie: item.noSerie,
        plates: item.plates,
        policyFolio: item.policyFolio,
        serviceFolio: item.serviceFolio,
        state: item.state,
        useFolio: item.useFolio,
        vehicleFolio: item.vehicleFolio,
        yearVehicle: item.vehicle.model,
        objectStatusId: 1,
        chubVehicles: [{
          brand: item.vehicle.brand,
          cmst: item.vehicle.cmst,
          description: item.vehicle.description,
          folio: item.vehicle.folio,
          model: item.vehicle.model,
          places: item.vehicle.places,
          shortDescription: item.vehicle.shortDescription,
          subbrand: item.vehicle.subbrand,
          typeVehicle: item.vehicle.typeVehicle,
          vehicle: item.vehicle.vehicle,
          vehicleId: item.vehicle.vehicleId,
          weight: item.vehicle.weight,
          objectStatusId: 1,
        }],
      };
    });
  
    return originVehicles;
  }

  export function SentVehicleToCopy(props: any) {
    const originVehicles: any[] = props.map((item: any) => {
      return {
        beneficiaryFolio: item.beneficiaryFolio,
        motor: item.motor,
        noPolicy: item.policyFolio,
        noSerie: item.noSerie,
        plates: item.plates,
        policyFolio: item.policyFolio,
        serviceFolio: item.serviceFolio,
        state: item.state,
        useFolio: item.useFolio,
        vehicleFolio: item.vehicleFolio,
        yearVehicle: item.yearVehicle,
        objectStatusId: 1,
        vehicle: null,
        // vehicle: [{
        //   brand: item.chubVehicles?.[0].brand,
        //   cmst: item.chubVehicles?.[0].cmst,
        //   description: item.chubVehicles?.[0].description,
        //   folio: item.chubVehicles?.[0].folio,
        //   model: item.chubVehicles?.[0].model,
        //   places: item.chubVehicles?.[0].places,
        //   shortDescription: item.chubVehicles?.[0].shortDescription,
        //   subbrand: item.chubVehicles?.[0].subbrand,
        //   typeVehicle: item.chubVehicles?.[0].typeVehicle,
        //   vehicle: item.chubVehicles?.[0].vehicle,
        //   vehicleId: item.chubVehicles?.[0].vehicleId,
        //   weight: item.chubVehicles?.[0].weight,
        //   objectStatusId: 1,
        // }],
      };
    });
  
    return originVehicles;
  }
const vehicleConverter = {
    AddVehicleToCopy,
    SentVehicleToCopy,
};
export default AddVehicleToCopy;