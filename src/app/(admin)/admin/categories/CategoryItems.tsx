import getSlugsNested from "@/helpers/getSlugsNested";
import { useAppSelector } from "@/lib/hooks";
import moment from "moment";
import React from "react";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";

interface IProps {
  itemOffset: number;
  categories: ICategory[];
  selectedSlugs: string[];
  setSelectedSlugs: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdateCategory: (slug: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryItems = (props: IProps) => {
  const {
    itemOffset,
    categories,
    selectedSlugs,
    setSelectedSlugs,
    onUpdateCategory,
    onDeleteCategory,
  } = props;
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );

  const handleSeletedAll = () => {
    if (selectedSlugs.length === getSlugsNested(categories).length) {
      setSelectedSlugs([]);
    } else {
      const slugs: string[] = getSlugsNested(categories);
      setSelectedSlugs(slugs);
    }
  };

  const handleSelectedSlugs = (slug: string) => {
    setSelectedSlugs((prev: string[]) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      return [...prev, slug];
    });
  };

  return (
    <Table striped bordered hover className="mt-3 mb-3 caption-top">
      <caption>Danh sách danh mục sản phẩm</caption>
      <thead className="table-info">
        <tr>
          <th>
            <Form.Check
              type={"checkbox"}
              checked={
                selectedSlugs.length > 0 &&
                selectedSlugs.length === getSlugsNested(categories).length
              }
              onChange={handleSeletedAll}
            />
          </th>
          <th>STT</th>
          <th>Tên danh mục</th>
          <th>Breadcrumbs</th>
          <th>Trạng thái</th>
          <th>Cập nhật</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 ? (
          categories.map((category: ICategory, index: number) => {
            return (
              <tr key={category._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={category._id}
                    checked={selectedSlugs.includes(category.slug)}
                    onChange={() => handleSelectedSlugs(category.slug)}
                  />
                </td>
                <td>{itemOffset + index + 1}</td>
                <td>{category.title}</td>
                <td>{category.breadcrumbs}</td>
                <td>
                  <Badge bg={category.status ? "success" : "danger"}>
                    {category.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(category.updatedAt).format("DD-MM-YYYY")}</td>
                <td className="d-flex gap-2">
                  {userPermissions.includes("categories_update") && (
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() => onUpdateCategory(category.slug)}>
                      <TiEdit />
                    </Button>
                  )}
                  {userPermissions.includes("categories_delete") && (
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => onDeleteCategory(category.slug)}>
                      <TfiTrash />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr className="text-center">
            <td colSpan={7}>Chưa có danh mục nào</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CategoryItems;
