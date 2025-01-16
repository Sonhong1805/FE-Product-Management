import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang đặt hàng - Product Management",
  description:
    "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
