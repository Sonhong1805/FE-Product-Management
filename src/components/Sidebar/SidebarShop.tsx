import React from "react";
import { Col } from "react-bootstrap";
import FilterCategory from "../Filter/FilterCategory";
import FilterPrice from "../Filter/FilterPrice";
import FilterColor from "../Filter/FilterColor";
import FilterTag from "../Filter/FilterTag";

const SidebarShop = ({
  categorySlug,
}: {
  categorySlug: string | undefined;
}) => {
  return (
    <Col xs={3} className="border-end">
      <FilterCategory categorySlug={categorySlug} />
      <FilterPrice />
      <FilterColor />
      <FilterTag />
    </Col>
  );
};

export default SidebarShop;
