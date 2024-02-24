export interface CoveragePackage {
    _id: string,
    folio: string,
    insuranceCompanyFolio: string,
    branch: string,
    subBranch: string,
    packageName: string,
    coverages: [
        {
            _id: string,
            name: string,
            amount: number,
            conditions: string,
            deductible: number
        }
    ],
}

export default CoveragePackage