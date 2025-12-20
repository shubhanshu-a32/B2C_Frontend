import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <NavBar />
            <main className="flex-1 w-full mx-auto px-4 py-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
