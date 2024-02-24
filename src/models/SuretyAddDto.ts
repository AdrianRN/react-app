interface SuretyAddDto {
    // Datos Generales
    numeroCompaniaAfianzadora?: string;
    folioOT?: string;
    noPoliza?: string;
    fiado?: string;
    fiadoRegistrado?:boolean;
    fiadoScore?: number;
    folioFiado?: string;
    beneficiario?: string;
    beneficiarioRegistrado?: boolean;
    moneda?: string;
    tasaIva: number;
    ramo?: string;
    subRamo?: string;
    vendedor?: string;
    grupo?: string;
    proyecto?: string;
  
    // Importes
    montoMovimiento: number;
    tarifa: number;
    gastosExpedicion: number;
    gastosBuro: number;
    gastosInvestigacion: number;
    gastosRPP: number;
  
    // Recibo Fianza
    primaNeta: number;
    subtotal: number;
    derechos: number;
    iva: number;
    recibosGastosExpedicion: number;
    montoTotaL: number;
  
    // Comision
    comision: number;
    importeComision: number;
    bono: number;
    maquila: number;
    importeMaquila: number;
  
    // Vigencia
    inicioVigencia: Date;
    finVigencia: Date;
    fechaFinPlazoEjecucion: Date;
    fechaEmision: Date;
    fechaMaxReclamacion: Date;
    fechaInscripcion: Date;
    fechaSolicitud: Date;
    fechaAutorizacion: Date;
  
    // Documento Fuente
    tipoDocumentoFuente?: string;
    numero: number;
    montoDocumentoFuente: number;
    fechaDocumentoFuente: Date;
    tipoVencimiento?: string;
    archivoDocumentoFuente?: string;
    xmlUrl: string;

    beneficiarioPerson?:any;
    fiadoPerson?:any,
  }
  
  export default SuretyAddDto;
  