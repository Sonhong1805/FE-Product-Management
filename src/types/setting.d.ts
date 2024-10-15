interface ISetting {
  _id: string;
  name: string;
  logo: FileList | string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  updatedAt?: Date;
}
