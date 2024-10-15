interface IBlog {
  _id: string;
  title: string;
  thumbnail: FileList | string;
  content: string;
  author: string;
  status?: boolean;
  updatedAt?: string;
}

type IBlogInputs = Omit<IBlog, "status" | "updatedAt" | "author">;

interface IBlogsSearch {
  keywords: string;
  filter: Option | null;
}