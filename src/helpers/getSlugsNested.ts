interface TreeNode {
  slug: string;
  children?: TreeNode[];
}

const getSlugsNested = <T extends TreeNode>(arr: T[]): string[] => {
  let newArr: string[] = [];

  arr.forEach((item: T) => {
    newArr.push(item.slug);
    if (item.children) {
      newArr = newArr.concat(getSlugsNested(item.children));
    }
  });

  return newArr;
};

export default getSlugsNested;
