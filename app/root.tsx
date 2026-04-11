import { Outlet } from "react-router";
import "./app.css";

export { Layout } from "@/layouts/main.layout";
export { ErrorBoundary } from "./error";

export default function App() {
	return <Outlet />;
}
