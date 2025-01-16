import SettingsService from "@/services/settings";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const response = await SettingsService.index();
  const setting = response.data;

  return {
    title: `Giới thiệu - ${setting?.name}`,
    description:
      "Khám phá trang thương mại điện tử hiện đại, nơi bạn có thể mua sắm hàng ngàn sản phẩm với giá cả hợp lý, giao hàng nhanh chóng và dịch vụ hỗ trợ tận tâm.",
    openGraph: {
      title: `Giới thiệu - ${setting?.name}`,
      description:
        "Khám phá trang thương mại điện tử hiện đại, nơi bạn có thể mua sắm hàng ngàn sản phẩm với giá cả hợp lý, giao hàng nhanh chóng và dịch vụ hỗ trợ tận tâm.",
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
