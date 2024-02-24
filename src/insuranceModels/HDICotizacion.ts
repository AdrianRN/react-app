export interface ICoverage {
    coverageRule: number;
    coverageKey: number;
    coverageDescription: string;
    coverageSumAssured: string;
    deductible: number;
    assistanceProvider: number;
    netPremium: number;
    isCalculated: boolean;
  }
  
  export interface ICoveragePackage {
    key: number;
    description: string;
    mandatoryCoverages: {
      coverages: ICoverage[];
    };
    optionalMandatoryCoverages: {
      coverages: ICoverage[];
    };
    optionalCoverages: {
      coverages: ICoverage[];
    };
    adjusment: {
      adjustmentPercentage: number;
      adjusmentType: number;
    };
    conditions: {
      deductibleDM: number;
      deductibleRT: number;
    };
  }
  
  export interface IHDICotizacion {
    body: {
      packagesRequest: {
        city: string;
        state: string;
        idPaymentForm: string;
        user: string;
        vehicleData: {
          vechicleId: string;
          brandId: string;
          modelId: string;
          typeId: string;
          versionId: string;
          transmissionId: string;
          useId: string;
          vehicleType: string;
          engineNumber: string;
          plates: string;
          color: string;
          serialNumber: string;
          passengers: string;
          circulationZoneId: string;
          tonnageId: string;
          serviceId: string;
          loadRiskId: string;
          additionalAjusment: {
            collectionConduitId: string;
          };
          additionalData: {
            renovations: string;
            trailerId: string;
            circulationPostalCode: string;
          };
        };
        validity: {
          initial: string;
          final: string;
        };
        getAllPackages: boolean;
        packagesWithChanges: {
          coveragePackagesRequest: ICoveragePackage;
        };
        idTypeSumInsured: string;
        sumAssured: string;
        ivaPercentage: string;
      };
    };
  }
  
  export class HDICotizacion implements IHDICotizacion {
    body = {
      packagesRequest: {
        city: '',
        state: '',
        idPaymentForm: '',
        user: '',
        vehicleData: {
          vechicleId: '',
          brandId: '',
          modelId: '',
          typeId: '',
          versionId: '',
          transmissionId: '',
          useId: '',
          vehicleType: '',
          engineNumber: '',
          plates: '',
          color: '',
          serialNumber: '',
          passengers: '',
          circulationZoneId: '',
          tonnageId: '',
          serviceId: '',
          loadRiskId: '',
          additionalAjusment: {
            collectionConduitId: '',
          },
          additionalData: {
            renovations: '',
            trailerId: '',
            circulationPostalCode: '',
          },
        },
        validity: {
          initial: '',
          final: '',
        },
        getAllPackages: false,
        packagesWithChanges: {
          coveragePackagesRequest: {
            key: 0,
            description: '',
            mandatoryCoverages: {
              coverages: [] as ICoverage[],
            },
            optionalMandatoryCoverages: {
              coverages: [] as ICoverage[],
            },
            optionalCoverages: {
              coverages: [] as ICoverage[],
            },
            adjusment: {
              adjustmentPercentage: 0,
              adjusmentType: 0,
            },
            conditions: {
              deductibleDM: 0,
              deductibleRT: 0,
            },
          },
        },
        idTypeSumInsured: '',
        sumAssured: '',
        ivaPercentage: '',
      },
    };
  }

  const DEFAULT_HDI_QUOTE_VALUES: HDICotizacion = {
    body: {
      packagesRequest: {
        city: '0',
        state: '0',
        idPaymentForm: '327',
        user: '105760',
        vehicleData: {
          vechicleId: '2083317',
          brandId: '0',
          modelId: '2015',
          typeId: '0',
          versionId: '0',
          transmissionId: '0',
          useId: '4581',
          vehicleType: '4579',
          engineNumber: '0',
          plates: '0',
          color: '0',
          serialNumber: '0',
          passengers: '0',
          circulationZoneId: '0',
          tonnageId: '0',
          serviceId: '4601',
          loadRiskId: '0',
          additionalAjusment: {
            collectionConduitId: '1',
          },
          additionalData: {
            renovations: '0',
            trailerId: '4603',
            circulationPostalCode: '11000',
          },
        },
        validity: {
          initial: '2023-06-09T00:00:00',
          final: '2024-06-09T00:00:00',
        },
        getAllPackages: false,
        packagesWithChanges: {
          coveragePackagesRequest: {
            key: 19,
            description: '',
            mandatoryCoverages: {
              coverages: [
                {
                  coverageRule: 287,
                  coverageKey: 233,
                  coverageDescription: 'Daños Materiales',
                  coverageSumAssured: '0',
                  deductible: 5,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 339,
                  coverageKey: 236,
                  coverageDescription: 'Robo Total',
                  coverageSumAssured: '0',
                  deductible: 10,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 655,
                  coverageKey: 253,
                  coverageDescription: 'Responsabilidad Civil (Límite Único y Co',
                  coverageSumAssured: '3000000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 295,
                  coverageKey: 242,
                  coverageDescription: 'Asistencia Jurídica',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 6923,
                  netPremium: 0,
                  isCalculated: true,
                },
              ],
            },
            optionalMandatoryCoverages: {
              coverages: [
                {
                  coverageRule: 292,
                  coverageKey: 239,
                  coverageDescription: 'Gastos Médicos Ocupantes (Límite Único Combinado)',
                  coverageSumAssured: '20000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 317,
                  coverageKey: 264,
                  coverageDescription: 'Extensión de Responsabilidad Civil para Automóvil Particular',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 653,
                  coverageKey: 366,
                  coverageDescription: 'Responsabilidad Civil Exceso por Muerte',
                  coverageSumAssured: '2000000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 398,
                  coverageKey: 267,
                  coverageDescription: 'Responsabilidad Civil Familiar',
                  coverageSumAssured: '100000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 2806,
                  coverageKey: 249,
                  coverageDescription: 'Asistencia en viajes',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 2923,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 322,
                  coverageKey: 269,
                  coverageDescription: 'Asistencia Médica',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 6923,
                  netPremium: 0,
                  isCalculated: true,
                },
                {
                  coverageRule: 513,
                  coverageKey: 365,
                  coverageDescription: 'Asistencia Funeraria',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 22765,
                  netPremium: 0,
                  isCalculated: true,
                },
              ],
            },
            optionalCoverages: {
              coverages: [
                {
                  coverageRule: 301,
                  coverageKey: 248,
                  coverageDescription: 'Exención de Deducible Por Pérdida Total Por Daños Materiales',
                  coverageSumAssured: '0',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 409,
                  coverageKey: 250,
                  coverageDescription: 'Gastos médicos al conductor',
                  coverageSumAssured: '20000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 689,
                  coverageKey: 355,
                  coverageDescription: 'Responsabilidad Civil por daños a los Ocupantes',
                  coverageSumAssured: '350000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 361,
                  coverageKey: 235,
                  coverageDescription: 'Accidentes Automovilísticos al Conductor',
                  coverageSumAssured: '100000',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 308,
                  coverageKey: 255,
                  coverageDescription: 'Responsabilidad Civil al Viajero',
                  coverageSumAssured: '3160',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 2931,
                  coverageKey: 266,
                  coverageDescription: 'Responsabilidad USA y Canadá',
                  coverageSumAssured: '150000',
                  deductible: 0,
                  assistanceProvider: 23295,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 321,
                  coverageKey: 268,
                  coverageDescription: 'Ayuda para gastos de transporte',
                  coverageSumAssured: '300',
                  deductible: 0,
                  assistanceProvider: 0,
                  netPremium: 0,
                  isCalculated: false,
                },
                {
                  coverageRule: 414,
                  coverageKey: 342,
                  coverageDescription: 'Auto siempre',
                  coverageSumAssured: '5',
                  deductible: 0,
                  assistanceProvider: 6923,
                  netPremium: 0,
                  isCalculated: false,
                },
              ],
            },
            adjusment: {
              adjustmentPercentage: 0,
              adjusmentType: 4612,
            },
            conditions: {
              deductibleDM: 5,
              deductibleRT: 10,
            },
          },
        },
        idTypeSumInsured: '4452',
        sumAssured: '0',
        ivaPercentage: '16',
      },
    },
  };
  
const HDIQuote = {
    HDICotizacion,
    DEFAULT_HDI_QUOTE_VALUES
};

export default HDIQuote;