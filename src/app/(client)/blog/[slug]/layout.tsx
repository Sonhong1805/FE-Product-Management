import BlogsService from "@/services/blogs";
import { Metadata } from "next";

interface IProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const productSlug = params.slug || "";
  const response = await BlogsService.detail(productSlug);
  const blogDetail = response.data;

  return {
    title: blogDetail?.title,
    description: `${blogDetail?.topic.label} - ${blogDetail?.title}`,
    openGraph: {
      title: blogDetail?.title,
      description: `${blogDetail?.topic.label} - ${blogDetail?.title}`,
      type: "website",
      images: blogDetail?.thumbnail + "",
    },
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
