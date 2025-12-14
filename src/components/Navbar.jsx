import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext.jsx"
import './Navbar.scss'

function Navbar() {
    const {currentUser, logout} = useAuth();

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Feed</Link></li>
                {currentUser ? (
                        <>
                            <li><Link to={`/profile/${currentUser.id}`}>My Profile</Link></li>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </>
                    ) :
                    <li><Link to="/login">Login</Link></li>
                }
            </ul>
        </nav>
    )
}

export default Navbar;