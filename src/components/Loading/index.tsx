import React from "react";
import { Spinner } from "react-bootstrap";
import "./style.scss";

const Loading = () => {
  return (
    <div className="loading">
      <Spinner className="spinner" animation="border" variant="danger" />
    </div>
  );
};

export default Loading;
