interface TreeNode {
  slug: string | number;
  parent_slug?: string | number;
  children?: TreeNode[];
}

const createNested = <T extends TreeNode>(
  arr: T[],
  parentSlug: string | number = ""
): T[] => {
  const nested: T[] = [];
  arr.forEach((item: T) => {
    if (item.parent_slug === parentSlug) {
      const newItem = { ...item } as T;
      const children = createNested(arr, item.slug);
      if (children.length > 0) {
        newItem.children = children;
      }
      nested.push(newItem);
    }
  });

  return nested;
};

export const nested = <T extends TreeNode>(arr: T[]): T[] => {
  if (!Array.isArray(arr)) {
    return [];
  }
  return createNested(arr);
};
