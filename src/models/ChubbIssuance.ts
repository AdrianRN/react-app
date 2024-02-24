export interface IChubbIssuance {
  CotizacionId: number;
  VersionId: number;
  formaPagoId: number;
  asegurado: {
    tranId: number;
    aseguradoId: number;
    direccionId: number;
  };
  Incisos: {
    numeroInciso: number;
    paqueteId: number;
    vehiculo: {
      serie: string;
      placa: string;
      motor: string;
      referencia: string;
    };
    propietario: {
      tranId: number;
      propietarioId: number;
      direccionId: number;
    };
    beneficiario: {
      tranId: number;
      beneficiarioId: number;
    };
  }[];
  Facturacion: {
    PersonalidadJuridicaId: number;
    Rfc: string;
    Nombre: string;
    CodigoPostal: string | number;
    RegimenFiscalId: number;
    usoCFDIId: number;
    email: string;
    emailComplementoPago: string;
    comentarios: string;
    ordenCompra: string;
  };
  CompanyData : {
    companyFolioIssuance: string,
    companyNameIssuance: string,
    salesPersonEmail: string
  }
}

export class ChubbIssuance implements IChubbIssuance {
  CotizacionId: number = 0;
  VersionId: number = 0;
  formaPagoId: number = 0;
  asegurado = {
    tranId: 0,
    aseguradoId: 0,
    direccionId: 0,
  };
  Incisos = [
    {
      numeroInciso: 0,
      paqueteId: 0,
      vehiculo: {
        serie: '',
        placa: '',
        motor: '',
        referencia: '',
      },
      propietario: {
        tranId: 0,
        propietarioId: 0,
        direccionId: 0,
      },
      beneficiario: {
        tranId: 0,
        beneficiarioId: 0,
      },
    },
  ];
  Facturacion = {
    PersonalidadJuridicaId: 0,
    Rfc: '',
    Nombre: '',
    CodigoPostal: '',
    RegimenFiscalId: 0,
    usoCFDIId: 0,
    email: '',
    emailComplementoPago: '',
    comentarios: '',
    ordenCompra: '',
  };
  CompanyData = {
    companyFolioIssuance: '',
    companyNameIssuance: '',
    salesPersonEmail: ''
  }
}

export default ChubbIssuance;
