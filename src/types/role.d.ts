interface IRole {
  _id: string;
  title: string;
  description: string;
  permissions: string[];
  status?: boolean;
  updatedAt?: Date;
}

type IRoleInputs = Omit<IRole, "_id" | "permissions" | "status" | "updatedAt">;

interface IRoleSearch {
  keywords: string;
  filter: Option | null;
}
