import Navbar from "./Navbar.jsx";
import "./Layout.scss";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout;