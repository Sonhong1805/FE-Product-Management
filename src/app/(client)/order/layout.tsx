import SettingsService from "@/services/settings";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const response = await SettingsService.index();
  const setting = response.data;

  return {
    title: `Đặt hàng - ${setting?.name}`,
    description:
      "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
    openGraph: {
      title: `Đặt hàng - ${setting?.name}`,
      description:
        "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
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
