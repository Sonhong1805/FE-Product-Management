import CategoriesService from "@/services/categories";
import { Metadata } from "next";

interface IProps {
  params: { categories?: string[] };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const categorySlug = params.categories?.at(-1) || "";
  const response = await CategoriesService.detail(categorySlug);
  const categoryDetail = response.data;

  return {
    title: categoryDetail?.title
      ? categoryDetail?.title + " - Product Management"
      : "Cửa hàng - Product Management",
    description:
      "khám phá và mua sắm các sản phẩm từ các danh mục khác nhau. Tại đây, bạn có thể tìm thấy một loạt các sản phẩm đa dạng và chất lượng, từ đó đáp ứng nhu cầu mua sắm của mình một cách đầy đủ và thoải mái.",
    openGraph: {
      title: categoryDetail?.title
        ? categoryDetail?.title + " - Product Management"
        : "Cửa hàng - Product Management",
      description:
        "khám phá và mua sắm các sản phẩm từ các danh mục khác nhau. Tại đây, bạn có thể tìm thấy một loạt các sản phẩm đa dạng và chất lượng, từ đó đáp ứng nhu cầu mua sắm của mình một cách đầy đủ và thoải mái.",
      type: "website",
      images: [process.env.NEXT_PUBLIC_MY_URL + "/images/logo.png"],
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
