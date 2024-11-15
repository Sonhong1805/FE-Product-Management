import SidebarAccount from "@/components/Sidebar/SidebarAccount";
import { Container, Row } from "react-bootstrap";

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
