export interface IMediaContact {
    office: string;
    cellPhone: string;

}

export class MediaContact implements IMediaContact {
    office: string = '';
    cellPhone: string = '';
    constructor() { }

}