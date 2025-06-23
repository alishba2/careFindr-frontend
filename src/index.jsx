import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { App } from "./app";
createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
