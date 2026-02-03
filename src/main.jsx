import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// 1. Import BrowserRouter
import { BrowserRouter } from "react-router-dom";
// Import LenisProvider
import { LenisProvider } from "./contexts/LenisContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Bungkus App dengan BrowserRouter dan LenisProvider */}
    <LenisProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LenisProvider>
  </React.StrictMode>,
);
