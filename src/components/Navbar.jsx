import {Link} from "react-router-dom"
import './Navbar.scss'

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/">Feed</Link></li>
                <li><Link to="/profile/1">Profile</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;