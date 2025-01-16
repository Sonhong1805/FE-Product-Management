interface IBlog {
  _id: string;
  title: string;
  slug: string;
  topic: Option;
  thumbnail: FileList | string;
  content: string;
  author: string;
  status?: boolean;
  updatedAt?: string;
}

type IBlogInputs = Omit<IBlog, "status" | "updatedAt" | "author">;

type IBlogsQueries = {
  keywords: string;
  topic: Option | null;
  status: Option | null;
};
