// Define the interfaces for the nested objects
interface IFormaPago {
    id: number;
  }
  
  interface IVehiculo {
    vehiculoId: number;
    modelo: number;
    codigoPostal: number;
    usoId: number;
    tipoSumaAseguradaId: number;
  }
  
  interface IPaquete {
    id: number;
  }
  
  interface IDatosGenerales {
    negocioId: number;
    agenteId: number;
    conductoId: string;
    tarifaId: number;
    inicioVigencia: string;
    finVigencia: string;
    productoId: number;
    agrupacionId: number;
    tipoCalculoId: number;
    formasPago: IFormaPago[];
    monedaId: number;
  }
  
  interface IInciso {
    tipoRiesgoId: number;
    PorcentajeDescuento: number;
    vehiculo: IVehiculo;
    paquetes: IPaquete[];
  }
  
  interface ICotizacion {
    cotizacionId: number;
    versionId: number;
    datosGenerales: IDatosGenerales;
    incisos: IInciso[];
  }
  
  // Implement the model classes
  export class FormaPago implements IFormaPago {
    id: number = 0;
  }
  
  export class Vehiculo implements IVehiculo {
    vehiculoId: number = 0;
    modelo: number = 0;
    codigoPostal: number = 0;
    usoId: number = 0;
    tipoSumaAseguradaId: number = 0;
  }
  
  export class Paquete implements IPaquete {
    id: number = 0;
  }
  
  export class DatosGenerales implements IDatosGenerales {
    negocioId: number = 0;
    agenteId: number = 0;
    conductoId: string = "0";
    tarifaId: number = 0;
    inicioVigencia: string = "";
    finVigencia: string = "";
    productoId: number = 0;
    agrupacionId: number = 0;
    tipoCalculoId: number = 0;
    formasPago: FormaPago[] = [new FormaPago()];
    monedaId: number = 0;
  }
  
  export class Inciso implements IInciso {
    tipoRiesgoId: number = 0;
    PorcentajeDescuento: number = 0;
    vehiculo: Vehiculo = new Vehiculo();
    paquetes: Paquete[] = [new Paquete()];
  }
  
  export class Cotizacion implements ICotizacion {
    cotizacionId: number = 0;
    versionId: number = 0;
    datosGenerales: DatosGenerales = new DatosGenerales();
    incisos: Inciso[] = [new Inciso()];
  }
  
export default Cotizacion;
