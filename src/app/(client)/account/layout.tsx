import SidebarAccount from "@/components/Sidebar/SidebarAccount";
import { Container, Row } from "react-bootstrap";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Container>
        <Row>
          <SidebarAccount />
          {children}
        </Row>
      </Container>
    </div>
  );
}
