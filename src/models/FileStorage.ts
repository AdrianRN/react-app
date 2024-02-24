/*export interface IFileStorage{
    externalFolio: string,
    fileName: string,
    description: string,
    fileExtension: string,
    fileBytes: string,
    containerName: string,
    objectStatusId: number
}

export default IFileStorage;*/
export interface FileStorage {
  fileStorageId?: string,
  folio?: string,
  externalFolio?: string,
  fileName?: string,
  description?: string,
  notes?: string,
  fileExtension?: string,
  fileBytes?: string,
  fileUrl?: string,
  containerName?: string,
  objectStatusId?: number,
  effectiveDate?:string,
  issueDate?: string
}


 

export default FileStorage

