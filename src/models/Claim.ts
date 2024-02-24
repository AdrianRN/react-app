export interface Claim {
    claimId:                string;
    folio:                  string;
    carClaim:               string;
    dateClaim:              Date;
    client:                 string;
    policy:                 string;
    insuranceCompany:       string;
    claimNumber:            string;
    liabilityType:          string;
    deductible:             number;
    damagePercentage:       number;
    observations:           string;
    deliveryCommitmentDate: Date;
    objectStatusId:         number;
    createdAt:              Date;
    createdBy:              string;
    updatedAt:              Date;
    updatedBy:              string;
}

export default Claim