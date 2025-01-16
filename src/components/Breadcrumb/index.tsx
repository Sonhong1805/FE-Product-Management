import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import React from "react";
import { Container, Breadcrumb as BreadcrumbBootstrap } from "react-bootstrap";
import BreadcrumbItem from "./BreadcrumbItem";

interface IProps {
  title: string;
  href: string;
}

const Breadcrumb = (props: IProps) => {
  const { title, href } = props;
  const parentCategories = useAppSelector(
    (state) => state.categories.parentCategories
  );
  return (
    <div className="bg-light">
      <Container className="py-2">
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
          {parentCategories.length > 0 &&
            parentCategories.map((category: ICategory) => (
              <BreadcrumbItem
                category={category}
                key={category._id}
                parentSlug={""}
              />
            ))}
        </BreadcrumbBootstrap>
      </Container>
    </div>
  );
};

export default Breadcrumb;
