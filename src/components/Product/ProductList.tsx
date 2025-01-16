import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import ProductItem from "./ProductItem";
import { useAppSelector } from "@/lib/hooks";

const ProductList = ({ products }: { products: IProduct[] }) => {
  const view = useAppSelector((state) => state.products.view);

  const renderedProducts = useMemo(() => {
    return products.map((product: IProduct) => (
      <ProductItem product={product} key={product._id} />
    ));
  }, [products]);

  return (
    <Container
      className={`product-container ${
        view === "GRID" ? "grid grid-4" : "list"
      } mb-4`}>
      {renderedProducts}
    </Container>
  );
};

export default ProductList;
