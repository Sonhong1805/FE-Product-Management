import StoreProvider from "@/contexts/StoreProvider";
import UserAuthentication from "@/contexts/UserAuthentication";
import LayoutClient from "@/components/Layout/LayoutClient";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Trang chủ - Product Management",
  description:
    "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
  openGraph: {
    title: "Trang chủ - Product Management",
    description:
      "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
    type: "website",
    images: [process.env.NEXT_PUBLIC_MY_URL + "/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <UserAuthentication>
        <Suspense>
          <LayoutClient>{children}</LayoutClient>
        </Suspense>
      </UserAuthentication>
    </StoreProvider>
  );
}
