import { useAppSelector } from "@/lib/hooks";
import { Form } from "react-bootstrap";
import { FiMinus, FiPlus } from "react-icons/fi";

interface IProps {
  item: ICategory;
  expandedItems: Record<string, boolean>;
  onHandleToggleItem: (slug: string) => void;
  onHandleFilterCategory: (slug: string) => void;
}
const SidebarNested = (props: IProps) => {
  const { item, expandedItems, onHandleToggleItem, onHandleFilterCategory } =
    props;
  const categorySlug = useAppSelector(
    (state) => state.products.queries.categorySlug
  );
  return (
    <>
      <li className="d-flex justify-content-between mb-1" key={item._id}>
        <Form.Check
          type="checkbox"
          label={`${item.title} (${item.productIds.length})`}
          id={item._id}
          value={item.slug}
          disabled={item.productIds.length === 0}
          // checked={!!expandedItems[item.slug]}
          checked={categorySlug?.includes(item.slug)}
          onChange={() => onHandleFilterCategory(item.slug)}
        />
        {item.children && (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => onHandleToggleItem(item.slug)}>
            {expandedItems[item.slug] ? (
              <FiMinus color="#36B37E" />
            ) : (
              <FiPlus color="#36B37E" />
            )}
          </span>
        )}
      </li>
      {item.children && (
        <ul
          className={
            expandedItems[item.slug] ? " overflow-auto" : "overflow-hidden"
          }
          style={{
            height: expandedItems[item.slug] ? "auto" : "0",
            paddingLeft: "15px",
          }}>
          {item.children.map((child: ICategory) => (
            <SidebarNested
              item={child}
              expandedItems={expandedItems}
              onHandleToggleItem={onHandleToggleItem}
              key={child._id}
              onHandleFilterCategory={onHandleFilterCategory}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarNested;
