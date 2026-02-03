// src/components/PagePlaceholder.jsx
import React from "react";

const PagePlaceholder = ({ title }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-gray-600">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

export default PagePlaceholder;
