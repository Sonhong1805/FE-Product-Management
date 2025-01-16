import { useState } from "react";
import CategoryItems from "./CategoryItems";
import ReactPaginate from "react-paginate";

interface IProps {
  itemsPerPage: number;
  items: ICategory[];
  selectedSlugs: string[];
  setSelectedSlugs: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdateCategory: (slug: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryPagination = ({
  itemsPerPage,
  items,
  selectedSlugs,
  setSelectedSlugs,
  onUpdateCategory,
  onDeleteCategory,
}: IProps) => {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <CategoryItems
        itemOffset={itemOffset}
        categories={currentItems}
        selectedSlugs={selectedSlugs}
        setSelectedSlugs={setSelectedSlugs}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          Hiển thị {itemOffset + 1} {" - "}
          {Math.min(itemOffset + itemsPerPage, items.length)} trên{" "}
          {items.length} kết quả.
        </div>
        <ReactPaginate
          breakLabel={"..."}
          nextLabel={">"}
          onPageChange={handlePageClick}
          pageClassName="page-item"
          className="pagination justify-content-end"
          pageLinkClassName="page-link"
          activeClassName="active"
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={"<"}
          renderOnZeroPageCount={null}
          previousLinkClassName={"page-link rounded-start"}
          nextLinkClassName={"page-link rounded-end"}
        />
      </div>
    </>
  );
};

export default CategoryPagination;
