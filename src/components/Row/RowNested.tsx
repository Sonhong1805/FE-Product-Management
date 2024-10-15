"use client";
import moment from "moment";
import { Fragment } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";

const RowNested = ({
  categories,
  parentPath,
  onUpdateCategory,
  onDeleteCategory,
  selectedIds,
  setSelectedIds,
}: {
  categories: ICategory[];
  parentPath: string;
  onUpdateCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  selectedIds: (string | number)[];
  setSelectedIds: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}) => {
  const handleSelectedIds = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <>
      {categories.length > 0 ? (
        categories.map((category: ICategory, index: number) => {
          const newParentPath = parentPath
            ? `${parentPath} / ${category.title}`
            : category.title;

          return (
            <Fragment key={category._id}>
              <tr>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={category._id}
                    checked={selectedIds.includes(category._id)}
                    onChange={() => handleSelectedIds(category._id)}
                  />
                </td>
                <td>{category.title}</td>
                <td>{newParentPath}</td>
                <td>
                  <Badge bg={category.status ? "success" : "danger"}>
                    {category.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(category.updatedAt).format("DD-MM-YYYY")}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    className="center"
                    onClick={() => onUpdateCategory(category._id)}>
                    <TiEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="center"
                    onClick={() => onDeleteCategory(category._id)}>
                    <TfiTrash />
                  </Button>
                </td>
              </tr>
              {category.children && category.children.length > 0 && (
                <RowNested
                  categories={category.children}
                  parentPath={newParentPath}
                  onUpdateCategory={onUpdateCategory}
                  onDeleteCategory={onDeleteCategory}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              )}
            </Fragment>
          );
        })
      ) : (
        <tr className="text-center">
          <td colSpan={6}>Chưa có danh mục nào</td>
        </tr>
      )}
    </>
  );
};

export default RowNested;
