export interface SubBranch {
    subBranchId: string,
    folio: string,
    title: string,
    description: string,
    branchId: string,
    branch: {
        description: string,
        folio: string
    },
    objectStatusId: number,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string
}

export default SubBranch    