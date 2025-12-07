import Navbar from "./Navbar.jsx";

function Layout({ children }) {
    return (
        <main className="layout">
            <Navbar />
            {children}
        </main>
    )
}

export default Layout;