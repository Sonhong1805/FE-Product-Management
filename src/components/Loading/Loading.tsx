import React from "react";
import { Spinner } from "react-bootstrap";
import "./style.scss";

const Loading = () => {
  return (
    <div className="loading">
      <Spinner animation="border" variant="info" />
    </div>
  );
};

export default Loading;
