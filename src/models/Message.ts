export interface IMessage {
  messageId: string;
  title: string;
  description: string;
  personId: string;
  person: Person;
  expectedDate: Date;
  objectStatusId: number;
  createdAt: string;
  createDate: Date;
  createdBy: Date;
  updatedAt: Date;
  updatedBy: Date;
}

interface IPerson {
  folio: string,
  email: string;
  lastName: string;
  maternalLastName: string;
}


export class Person implements IPerson {
  folio: string = "";
  email: string ="";
  lastName: string = "";
  maternalLastName: string = "";
}

export class Message implements IMessage {
  messageId: string = "";
  title: string = "";
  description: string = "";
  personId: string = "";
  person: Person = new Person();
  expectedDate: Date =new Date() ;
  objectStatusId: number = 0;
  createdAt: string = "";
  createDate: Date =new Date() ;
  createdBy: Date =new Date() ;
  updatedAt: Date =new Date() ;
  updatedBy: Date =new Date() ;
}

export default Message;
