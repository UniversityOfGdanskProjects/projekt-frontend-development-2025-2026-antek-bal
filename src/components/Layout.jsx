import Navbar from "./Navbar.jsx";
import './Layout.scss'

function Layout({ children }) {
    return (
        <main className="layout">
            <Navbar />
            {children}
        </main>
    )
}

export default Layout;