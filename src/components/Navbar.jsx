import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext.jsx"
import {FaBell, FaSearch} from "react-icons/fa";
import "./Navbar.scss"
import {useState} from "react";

function Navbar() {
    const {allUsers, currentUser, logout, notifications, markAsRead} = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const myNotifications = currentUser ? (notifications || []).filter(n => n.receiverId === currentUser.id) : [];
    const unreadCount = myNotifications.filter(n => !n.isRead).length;

    const filteredUsers = searchQuery.length > 0
        ? allUsers.filter(user => {
            const searchString = `${user.name} ${user.surname} ${user.username}`.toLowerCase();

            return searchString.includes(searchQuery.toLowerCase())
        })
        : [];

    const handleUserClick = () => {
        setSearchQuery("");
    }

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="logo">SocialApp</Link>
            </div>

            <div className="nav-center">
                {currentUser && (
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {filteredUsers.length > 0 && (
                            <div className="search-results">
                                {filteredUsers.map((user) => (
                                    <Link
                                        to={`/profile/${user.id}`}
                                        key={user.id}
                                        className="search-item"
                                        onClick={handleUserClick}
                                    >
                                        <img src={user.avatar} alt="avatar" />
                                        <div className="user-info">
                                            <span className="name">{user.name} {user.surname}</span>
                                            <span className="username">@{user.username}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ul className="nav-right">
                {currentUser ? (
                        <>
                            <li className="notification-container">
                                <button
                                    className="notification-btn"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FaBell />
                                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                                </button>

                                {showNotifications && (
                                    <div className="notification-dropdown">
                                        {myNotifications.length > 0 ? (
                                            myNotifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    <div className="notification-content">{n.content}</div>
                                                    <div className="notification-date">{new Date(n.date).toLocaleString()}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-notifications">No notifications</div>
                                        )}
                                    </div>
                                )}
                            </li>
                            <li><Link to={`/profile/${currentUser.id}`}>Profile</Link></li>
                            <li><button onClick={logout}>Logout</button></li>
                        </>
                    ) :
                    <li><Link to="/login">Login</Link></li>
                }
            </ul>
        </nav>
    );
}

export default Navbar;