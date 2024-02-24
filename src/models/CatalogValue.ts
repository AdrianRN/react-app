export interface ICatalogValue {
  folio: string;
  description: string;
  // Otros campos de la persona
}

export class CatalogValue implements ICatalogValue {
  folio: string = "new";
  description: string = "";
}

export default CatalogValue;
