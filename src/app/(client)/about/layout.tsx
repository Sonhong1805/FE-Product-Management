import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu - Product Management",
  description:
    "Khám phá trang thương mại điện tử hiện đại, nơi bạn có thể mua sắm hàng ngàn sản phẩm với giá cả hợp lý, giao hàng nhanh chóng và dịch vụ hỗ trợ tận tâm.",
  openGraph: {
    title: "Giới thiệu - Product Management",
    description:
      "Tìm hiểu về nền tảng thương mại điện tử hàng đầu, cung cấp sản phẩm đa dạng, dịch vụ chất lượng và trải nghiệm mua sắm trực tuyến tuyệt vời.",
    type: "website",
    images: [process.env.NEXT_PUBLIC_MY_URL + "/images/logo.png"],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
