import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppWrapper from "./AppWrapper";

createRoot(document.getElementById("root")).render(
  <AppWrapper>
    <App />
  </AppWrapper>,
);
