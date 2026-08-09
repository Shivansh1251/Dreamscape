import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function Layout() {
    return (
        <div className="relative min-h-screen">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
