const flattenCategories = (
  categories: ICategory[]
): Omit<ICategory, "children">[] => {
  return categories.reduce(
    (acc: Omit<ICategory, "children">[], category: ICategory) => {
      const { children, ...rest } = category;
      const flattened = [...acc, rest];
      if (children && children.length > 0) {
        return [...flattened, ...flattenCategories(children)];
      }
      return flattened;
    },
    []
  );
};

export default flattenCategories;
