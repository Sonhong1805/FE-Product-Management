import ProductsService from "@/services/products";
import { Metadata } from "next";

interface IProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const productSlug = params.slug || "";
  const response = await ProductsService.detail(productSlug);
  const productDetail = response.data;

  return {
    title: productDetail?.title,
    description: productDetail?.description,
    openGraph: {
      title: productDetail?.title,
      description: productDetail?.description,
      type: "website",
      images: productDetail?.thumbnail + "",
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
