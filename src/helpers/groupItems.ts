const groupItems = (array: TProductInCart[]) => {
  const groupArray = array?.reduce(
    (groups: IOrderGroup[], item: TProductInCart) => {
      const existingGroup = groups.find(
        (group: IOrderGroup) => group.productId === item.productId
      );
      if (existingGroup) {
        existingGroup.products.push(item);
      } else {
        groups.unshift({
          productId: item.productId,
          products: [item],
        });
      }
      return groups;
    },
    []
  );
  return groupArray;
};

export default groupItems;
