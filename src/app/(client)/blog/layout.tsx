import SettingsService from "@/services/settings";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const response = await SettingsService.index();
  const setting = response.data;

  return {
    title: `Bài viết - ${setting?.name}`,
    description:
      "Khám phá những bài viết chuyên sâu về thương mại điện tử, từ xu hướng mới nhất đến các chiến lược quản lý sản phẩm hiệu quả, giúp bạn nâng cao kỹ năng và tối ưu hóa hoạt động kinh doanh.",
    openGraph: {
      title: `Bài viết - ${setting?.name}`,
      description:
        "Tìm hiểu các bài viết hữu ích về thương mại điện tử và quản lý sản phẩm, với những chia sẻ về mẹo kinh doanh, công nghệ mới và cách phát triển doanh nghiệp trực tuyến.",
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
