import CategoriesService from "@/services/categories";
import SettingsService from "@/services/settings";
import { Metadata } from "next";

interface IProps {
  params: { categories?: string[] };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const categorySlug = params.categories?.at(-1) || "";
  const [responseCategory, responseSettings] = await Promise.all([
    CategoriesService.detail(categorySlug),
    SettingsService.index(),
  ]);
  const categoryDetail = responseCategory.data;
  const setting = responseSettings.data;

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
      images: [setting?.logo + ""],
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
