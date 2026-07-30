import { createRoot } from "react-dom/client";
import Workspace from "../app/Workspace";
import "../app/globals.css";

const section = new URLSearchParams(window.location.search).get("section") || "今日";
createRoot(document.getElementById("root")!).render(<Workspace initialActive={section} />);