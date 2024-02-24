export interface FileProspect {
  name: string;
  base64Content: string;
  fileExtension: string;
  containerName: string;
  categoryFile: string;
}

export interface Prospect {
    folioPerson: string;
    trafficLights: string;
    insuranceId: string;
    branchFolio: string;
    fileActuarialAnalysis: FileProspect;
    fileAccidentReport: FileProspect;
    objectStatusId: number;
}

