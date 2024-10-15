import Link from "next/link";
import React from "react";
import { Container, Breadcrumb as BreadcrumbBootstrap } from "react-bootstrap";

interface IProps {
  title: string;
  href: string;
}
const Breadcrumb = (props: IProps) => {
  const { title, href } = props;
  return (
    <div className="bg-light">
      <Container className="py-2 mb-3">
        <BreadcrumbBootstrap>
          <BreadcrumbBootstrap.Item active>
            <Link
              href="/"
              className="link-body-emphasis link-underline-opacity-0">
              Trang chủ
            </Link>
          </BreadcrumbBootstrap.Item>
          <BreadcrumbBootstrap.Item active>
            <Link
              href={href}
              className="link-body-emphasis link-underline-opacity-0">
              {title}
            </Link>
          </BreadcrumbBootstrap.Item>
        </BreadcrumbBootstrap>
      </Container>
    </div>
  );
};

export default Breadcrumb;
