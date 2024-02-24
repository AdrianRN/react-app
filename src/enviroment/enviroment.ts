export const Enviroment = {
  apiAddress: "api/Address",
  apiCatalog: "api/Catalog",
  apiMessage: "api/Message",
  apiAccidents: "api/accident-logs",
  apiAuthentication: "api/Authentication",
  apiBondQuotation: "api/BondQuotation",
  apiPeople: "api/People",
  apiUser: "api/User",
  apiCompanies: "api/Companies",
  apiCompaniesBranches: "api/CompaniesBranches",
  apiCatalogValue: "api/CatalogValue",
  apiMenu: "api/Menu",
  apiTasks: "api/Tasks",
  apiPolicies: "api/Policies",
  apiSourceDocument: "api/SourceDocument",
  apiFavorite: "api/Favorites",
  apiBonds: "api/Bonds",
  apiBondEndorsement: "api/bondEndorsement",
  apiBranches: "api/Branches",
  apiChubbVehicles: "api/ChubbCatalogVehicles",
  apiCotizacion: "api/Policies/PostPolicieChubb",
  apiChubbInsurance: "api/ChubbInsurance",
  apiHDIInsurance: "api/hdiInsurance",
  apiChubbIssuance: "api/AllPoliciesIssuance",
  apiChubbVehiclesCache: "api/Cache/ChubbVehicles",
  apiCompaniesContact: "api/CompaniesContact",
  apiCompaniesPortal: "api/CompaniesPortals",
  apiCacheCatalogValue: "api/Cache",
  apiAnnualGoals: "api/AnnualGoals",
  apiClaims: 'api/Claims',
  apiLocation: 'api/Location',
  apiEndorsement: 'api/EndorSement',
  apiChubbCatalogVehicle: "api/ChubbCatalogVehicles",
  apiQuotes: "api/quotes",
  apiVehiclePolicy: "api/vehicle-policies",
  apiVehiclePolicyList: "api/vehicle-policies/list",
  apiSubBranch: "api/SubBranch",
  apiCoveragePackage: "api/coverage-packages",
  apiCoveragePackagePolicy: "api/coverage-packages-policy",
  apiFileStorage: "api/FileStorage",
  apiReceipts: "api/receipts",
  apiFilter: "api/collection-filter",
  apiProspects: "api/Prospects",
  apiDamagePolicy: "api/DamagePolicies",
  apiCommissions: "api/Commissions",
  apiCommissionsAgents: "api/commissions-X-agents",
  apiConceptsAgent: "api/conceptsXagent",
  apiLogBooks: "api/LogBooks",
};

export const API_BONDS_URL = process.env.REACT_APP_API_URL_BONDS;
export const WEB_URL = process.env.REACT_APP_WEB_URL;
export const API_URL = process.env.REACT_APP_API_URL;
export const API_URL_INSURANCE = process.env.REACT_APP_API_URL_INSURANCE;

export const API_URL_BLOB = process.env.REACT_APP_API_URL_POLICYLOAD;
export const API_URL_BLOBCONTAINER_COMPANYLOGO = process.env.REACT_APP_URL_LOGOCOMPANY
export const SIZE_WEB_URL = (process.env.REACT_APP_WEB_URL +"/index/").length;