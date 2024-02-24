export interface IChubbVehicle {
  vehicleId: string;
  folio: string;
  vehicle: number;
  cmst: string;
  brand: string;
  subbrand: string;
  typeVehicle: string;
  description: string;
  shortDescription: string;
  places: number;
  model: number;
  weight: string;
}

export class ChubbVehicle implements IChubbVehicle {
  vehicleId: string = '';
  folio: string = '';
  vehicle: number = 0;
  cmst: string = '';
  brand: string = '';
  subbrand: string = '';
  typeVehicle: string = '';
  description: string = '';
  shortDescription: string = '';
  places: number = 0;
  model: number = 0;
  weight: string = '';
}


export default ChubbVehicle;
