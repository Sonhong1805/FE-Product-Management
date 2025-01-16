interface IContact {
  _id: string;
  fullName: string;
  email: string;
  topic: string;
  content: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
