export interface Branches {
    branchId: string,
    catalogValueId: string,
    catalogValue: {
        description: string
    },
    expirationDates: number,
    objectStatusId: number,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string
}

export default Branches