import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext.jsx"
import {FaBell} from "react-icons/fa";
import "./Navbar.scss"
import {useState} from "react";

function Navbar() {
    const {currentUser, logout, notifications, markAsRead} = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const myNotifications = currentUser ? (notifications || []).filter(n => n.receiverId === currentUser.id) : [];
    const unreadCount = myNotifications.filter(n => !n.isRead).length;

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
                        </>
                    ) :
                    <li><Link to="/login">Login</Link></li>
                }
            </ul>
        </nav>
    );
}

export default Navbar;