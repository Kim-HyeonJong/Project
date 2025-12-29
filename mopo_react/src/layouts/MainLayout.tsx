import { Outlet } from "react-router-dom";
import Header from "../components/common/Header.tsx"
import "../App.css";

export default function MainLayout() {
    return (
        <div className="app-layout">
            {/*헤더영역*/}
            <Header />
            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}