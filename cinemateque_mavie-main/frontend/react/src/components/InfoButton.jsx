import React from "react";
import { Link } from "react-router-dom";

export default function InfoButton() {
  return (
    <Link to="/about" className="info-btn-floating">
      i
    </Link>
  );
}