export interface IQuote {
  quoteId: string;
  quoteFolio: string;
  clientId: string;
  insuranceType: string;
  paymentFrequency: string;
  chubbResponse: {
    cotizacionId: number;
    issuanceDate: string;
    expirationDate: string;
    validityDate: string;
    comprehensiveCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    limitedCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    rcCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
  };
  hdiResponse: {
    cotizacionId: number;
    issuanceDate: string;
    expirationDate: string;
    validityDate: string;
    comprehensiveCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    limitedCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    rcCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
  };
  vehicleId: string;
  vehicleType: string;
  vehicleDetails: {
    serialNumber: string;
    plates: string;
    engineNumber: string;
  };
  ownerInfo: {
    genderFolio: string;
    birthDay: string;
    firstName: string;
    lastName: string;
    maternalLastName: string;
    zipCode: string;
    email: string;
    phone: string;
    civilStatus: string;
    addressDetails: {
      typeAddress: number;
      street: string;
      outdoorNumber: string;
      indoorNumber: string;
      colonyId: number;
    };
  };
  driverFolio: string;
  driverInfo: {
    genderFolio: string;
    birthDay: string;
    firstName: string;
    lastName: string;
    maternalLastName: string;
    zipCode: string;
    email: string;
    phone: string;
    civilStatus: string;
    addressDetails: {
      typeAddress: number;
      street: string;
      outdoorNumber: string;
      indoorNumber: string;
      colonyId: number;
    };
  };
  quoteStatus: string;
  objectStatusId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export class Quote implements IQuote {
  quoteId: string = '';
  quoteFolio: string = '';
  clientId: string = '';
  insuranceType: string = '';
  paymentFrequency: string = '';
  chubbResponse: {
    cotizacionId: number;
    issuanceDate: string;
    expirationDate: string;
    validityDate: string;
    comprehensiveCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    limitedCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    rcCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      chubbCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
  } = {
    cotizacionId: 0,
    issuanceDate: '',
    expirationDate: '',
    validityDate: '',
    comprehensiveCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      chubbCoverages: [],
    },
    limitedCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      chubbCoverages: [],
    },
    rcCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      chubbCoverages: [],
    },
  };
  hdiResponse: {
    cotizacionId: number;
    issuanceDate: string;
    expirationDate: string;
    validityDate: string;
    comprehensiveCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    limitedCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
    rcCoverage: {
      versionId: number;
      thirdPartyDamages: string;
      medicalExpenses: string;
      annualPayment: number;
      hdiCoverages: {
        description: string;
        sumAssured: string;
        deductibleValue: string;
        premiumAmount: number;
      }[];
    };
  } = {
    cotizacionId: 0,
    issuanceDate: '',
    expirationDate: '',
    validityDate: '',
    comprehensiveCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      hdiCoverages: [],
    },
    limitedCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      hdiCoverages: [],
    },
    rcCoverage: {
      versionId: 0,
      thirdPartyDamages: '',
      medicalExpenses: '',
      annualPayment: 0,
      hdiCoverages: [],
    },
  };
  vehicleId: string = '';
  vehicleType: string = '';
  vehicleDetails: {
    serialNumber: string;
    plates: string;
    engineNumber: string;
  } = {
    serialNumber: '',
    plates: '',
    engineNumber: '',
  };
  ownerInfo: {
    genderFolio: string;
    birthDay: string;
    firstName: string;
    lastName: string;
    maternalLastName: string;
    zipCode: string;
    email: string;
    phone: string;
    civilStatus: string;
    addressDetails: {
      typeAddress: number;
      street: string;
      outdoorNumber: string;
      indoorNumber: string;
      colonyId: number;
    }
  } = {
    genderFolio: '',
    birthDay: '',
    firstName: '',
    lastName: '',
    maternalLastName: '',
    zipCode: '',
    email: '',
    phone: '',
    civilStatus: '',
    addressDetails: {
      typeAddress: 0,
      street: '',
      outdoorNumber: '',
      indoorNumber: '',
      colonyId: 0,
    },
  };
  driverFolio: string = '';
  driverInfo: {
    genderFolio: string;
    birthDay: string;
    firstName: string;
    lastName: string;
    maternalLastName: string;
    zipCode: string;
    email: string;
    phone: string;
    civilStatus: string;
    addressDetails: {
      typeAddress: number;
      street: string;
      outdoorNumber: string;
      indoorNumber: string;
      colonyId: number;
    };
  } = {
    genderFolio: '',
    birthDay: '',
    firstName: '',
    lastName: '',
    maternalLastName: '',
    zipCode: '',
    email: '',
    phone: '',
    civilStatus: '',
    addressDetails: {
      typeAddress: 0,
      street: '',
      outdoorNumber: '',
      indoorNumber: '',
      colonyId: 0,
    },
  };
  quoteStatus: string = '';
  objectStatusId: number = 0;
  createdAt: string = '';
  createdBy: string = '';
  updatedAt: string = '';
  updatedBy: string = '';
}

export default Quote;
