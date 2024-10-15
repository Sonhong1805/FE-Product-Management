import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

const NavbarNested = ({ item }: { item: any }) => {
  return (
    <>
      <li className="d-flex justify-content-between align-items-center py-2 px-3">
        <Link
          href={""}
          className=" d-block flex-fill link-underline-light text-dark">
          {item.title}
        </Link>
        {item.children && <MdArrowForwardIos />}
        {item.children && (
          <ul className="bg-light text-dark border border-top-0 border-bottom-0">
            {item.children.map((child: any) => (
              <NavbarNested item={child} key={item._id} />
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default NavbarNested;
