import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import React from "react";
import { Container, Breadcrumb as BreadcrumbBootstrap } from "react-bootstrap";

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

const BreadcrumbItem = ({
  category,
  parentSlug = "",
}: {
  category: ICategory;
  parentSlug: string;
}) => {
  const currentSlug = `${parentSlug}/${category.slug}`;
  return (
    <>
      <BreadcrumbBootstrap.Item active>
        <Link
          href={`/shop${currentSlug}`}
          className="link-body-emphasis link-underline-opacity-0">
          {category.title}
        </Link>
      </BreadcrumbBootstrap.Item>
      {category.children &&
        category.children.map((child: ICategory) => (
          <BreadcrumbItem
            category={child}
            key={child._id}
            parentSlug={currentSlug}
          />
        ))}
    </>
  );
};

export default Breadcrumb;
