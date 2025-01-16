import Link from "next/link";
import { memo } from "react";
import { Breadcrumb as BreadcrumbBootstrap } from "react-bootstrap";

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
          className="link-body-emphasis link-underline-opacity-0"
          prefetch={true}>
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

export default memo(BreadcrumbItem);
