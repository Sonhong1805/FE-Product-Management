import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

const NavbarNested = ({
  item,
  parentSlug = "",
}: {
  item: ICategory;
  parentSlug?: string;
}) => {
  const currentSlug = `${parentSlug}/${item.slug}`;
  return (
    <>
      <li className="d-flex justify-content-between align-items-center py-2 px-3 ">
        <Link
          href={`/shop${currentSlug}`}
          className=" d-block flex-fill link-underline-light text-dark">
          {item.title}
        </Link>
        {item.children && <MdArrowForwardIos />}
        {item.children && (
          <ul className="bg-light text-dark border">
            {item.children.map((child: any) => (
              <NavbarNested
                item={child}
                key={child._id}
                parentSlug={currentSlug}
              />
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default NavbarNested;
