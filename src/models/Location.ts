export interface Location {
    _id: string,
    cvE_ENT: number,
    noM_ENT: string,
    noM_ABR: string,
    cvE_MUN: number,
    noM_MUN: string,
    cvE_LOC: number,
    noM_LOC: string
}

export default Location
export interface IEntities {
    _id: string,
    cvE_ENT: number,
    noM_ENT: string,
    noM_ABR: string
}

export interface IMunicipalities {
    _id: string,
    cvE_ENT: number,
    noM_ENT: string,
    noM_ABR: string,
    cvE_MUN: number,
    noM_MUN: string,
    cvE_LOC: number,
    noM_LOC: string
}