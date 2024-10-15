import { Fragment } from "react";

const OptionsNested = ({
  categories,
  title,
  selectedId,
}: {
  categories: ICategory[];
  title: string;
  selectedId: string;
}) => {
  return (
    <>
      {categories.map((category) => {
        const newParentTitle = title
          ? `${title} / ${category.title}`
          : category.title;
        return (
          <Fragment key={category._id}>
            <option value={category._id} hidden={category._id === selectedId}>
              {newParentTitle}
            </option>
            {category.children && (
              <OptionsNested
                categories={category.children}
                title={newParentTitle}
                selectedId={selectedId}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default OptionsNested;
