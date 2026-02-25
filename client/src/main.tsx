import { createRoot } from "react-dom/client";
import "./index.css";
import { Router } from "./router/mainRouter";
import "@stream-io/video-react-sdk/dist/css/styles.css";

createRoot(document.getElementById("root")!).render(<Router />);
