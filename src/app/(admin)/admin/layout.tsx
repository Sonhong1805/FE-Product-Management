import StoreProvider from "@/contexts/StoreProvider";
import type { Metadata } from "next";
import UserAuthentication from "@/contexts/UserAuthentication";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import LayoutAdmin from "@/components/Layout/LayoutAdmin";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm - Product Management",
  description:
    "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <UserAuthentication>
        <ProtectedRoute>
          <LayoutAdmin>{children}</LayoutAdmin>
        </ProtectedRoute>
      </UserAuthentication>
    </StoreProvider>
  );
}
