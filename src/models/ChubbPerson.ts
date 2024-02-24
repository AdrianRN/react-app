export interface IChubbPerson {
  chubbPersonId: string;
  folio: string;
  personalidadJuridicaId: number;
  personFolio: string;
  rfc: string;
  homoclave: string;
  giroId: number;
  primerNombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoSociedadId: number;
  razonSocial: string;
  fechaNacimientoConstitucion: string;
  generoId: number;
  curp: string;
  estadoCivilId: number;
  direccion: {
    tipoDireccionId: number;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    coloniaId: number;
  };
  email: string;
  telefonoPersonal: {
    lada: string;
    numero: string;
  };
  celular: {
    lada: string;
    numero: string;
  };
  isSuccess: boolean;
  isPersonDriver: boolean;
  messages: Array<{
    message: string;
    messageCode: number;
    messageType: number;
  }>;
  responseData: {
    tranId: number;
    personaId: number;
    direccionId: number;
  };
  objectStatusId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}


export class ChubbPerson implements IChubbPerson {
  chubbPersonId: string = "";
  folio: string = "";
  personalidadJuridicaId: number = 0;
  personFolio: string = "";
  rfc: string = "";
  homoclave: string = "";
  giroId: number = 0;
  primerNombre: string = "";
  segundoNombre: string = "";
  apellidoPaterno: string = "";
  apellidoMaterno: string = "";
  tipoSociedadId: number = 0;
  razonSocial: string = "";
  fechaNacimientoConstitucion: string = "";
  generoId: number = 0;
  curp: string = "";
  estadoCivilId: number = 0;
  direccion: {
    tipoDireccionId: number;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    coloniaId: number;
  } = {
    tipoDireccionId: 0,
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    coloniaId: 0,
  };
  email: string = "";
  telefonoPersonal: {
    lada: string;
    numero: string;
  } = {
    lada: "",
    numero: "",
  };
  celular: {
    lada: string;
    numero: string;
  } = {
    lada: "",
    numero: "",
  };
  isSuccess: boolean = false;
  isPersonDriver: boolean = false;
  messages: Array<{
    message: string;
    messageCode: number;
    messageType: number;
  }> = [];
  responseData: {
    tranId: number;
    personaId: number;
    direccionId: number;
  } = {
    tranId: 0,
    personaId: 0,
    direccionId: 0,
  };
  objectStatusId: number = 0;
  createdAt: string = "";
  createdBy: string = "";
  updatedAt: string = "";
  updatedBy: string = "";
}

export default ChubbPerson;
