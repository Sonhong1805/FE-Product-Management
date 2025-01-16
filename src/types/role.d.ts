interface IRole {
  _id: string;
  title: string;
  description: string;
  permissions: string[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type IRoleInputs = Omit<
  IRole,
  "_id" | "permissions" | "status" | "updatedAt" | "createdAt"
>;

interface IRoleSearch {
  keywords: string;
  status: Option | null;
}
