export interface damagePolicy {
    folio: string,
    policyFolio: string,
    subcategories: [{
        folio: string,
        subcategory: string,
        series: string
    }],
    objectStatusId: number
}

export default damagePolicy