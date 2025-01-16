import SidebarAccount from "@/components/Sidebar/SidebarAccount";
import { Container, Row } from "react-bootstrap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang cá nhân - Product Management",
  description:
    "Mua sắm hàng hoá giá tốt với chúng tôi. Khám phá hàng ngàn sản phẩm đa dạng từ thời trang, điện tử, gia dụng đến mỹ phẩm, với chất lượng đảm bảo và giá cả hợp lý. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời và dịch vụ khách hàng tận tâm.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-body-secondary py-3">
      <Container>
        <Row>
          <SidebarAccount />
          {children}
        </Row>
      </Container>
    </div>
  );
}
