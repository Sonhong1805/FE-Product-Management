import React from "react";
import { Container } from "react-bootstrap";
import ProductItem from "./ProductItem";
import { useAppSelector } from "@/lib/hooks";

const ProductList = ({ products }: { products: IProduct[] }) => {
  const view = useAppSelector((state) => state.products.view);
  return (
    <Container
      className={`product-container ${view === "GRID" ? "grid" : "list"} mb-4`}>
      {products.map((product: IProduct) => (
        <ProductItem product={product} key={product._id} />
      ))}
    </Container>
  );
};

export default ProductList;
