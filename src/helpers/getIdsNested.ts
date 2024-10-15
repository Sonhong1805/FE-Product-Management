interface TreeNode {
  _id: string | number;
  children?: TreeNode[];
}

const getIdsNested = <T extends TreeNode>(arr: T[]): (string | number)[] => {
  let newArr: (string | number)[] = [];

  arr.forEach((item: T) => {
    newArr.push(item._id);
    if (item.children) {
      newArr = newArr.concat(getIdsNested(item.children));
    }
  });

  return newArr;
};

export default getIdsNested;
