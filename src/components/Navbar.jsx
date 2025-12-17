import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext.jsx"
import {FaBell, FaSearch, FaCommentDots} from "react-icons/fa";
import {useChat} from "../context/ChatContext.jsx";
import {useState} from "react";
import "./Navbar.scss"


function Navbar() {
    const navigate = useNavigate();
    const {allUsers, currentUser, logout, notifications, markAsRead} = useAuth();
    const {messages} = useChat();
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

    const handleNotification = (notification) => {
        markAsRead(notification.id);
        setShowNotifications(false);

        let targetUserId;

        if (notification.type === "post") {
            targetUserId = notification.senderId;
        } else if (notification.type === "follow" || notification.type === "friend") {
            targetUserId = notification.senderId;
        } else {
            targetUserId = currentUser.id;
        }

        navigate(`/profile/${targetUserId}`)

        if (["post", "like", "comment"].includes(notification.type)) {
            setTimeout(() => {
                const element = document.getElementById(`post-${notification.referenceId}`);
                if (element) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    element.style.transition = "border 0.5s";
                    element.style.border = "2px solid #2196f3";
                    setTimeout(() => element.style.border = "none", 2000);
                }
            }, 800)
        }
    }

    const unreadMessagesCount = messages.filter(
        msg => msg.receiverId === currentUser?.id && !msg.isRead
    ).length;

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="logo">SocialApp</Link>
            </div>

            <div className="nav-center">
                {currentUser && (
                    <div className="search-bar">
                        <FaSearch className="search-icon"/>
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
                                        <img src={user.avatar} alt="avatar"/>
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
                                <div className="notification-btn">
                                    <FaCommentDots />
                                    {unreadMessagesCount > 0 && (
                                        <span className="badge">{unreadMessagesCount}</span>
                                    )}
                                </div>
                            </li>
                            <li className="notification-container">
                                <button
                                    className="notification-btn"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FaBell/>
                                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                                </button>

                                {showNotifications && (
                                    <div className="notification-dropdown">
                                        {myNotifications.length > 0 ? (
                                            myNotifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                                                    onClick={() => handleNotification(n)}
                                                >
                                                    <div className="notification-content">{n.content}</div>
                                                    <div
                                                        className="notification-date">{new Date(n.date).toLocaleString()}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-notifications">No notifications</div>
                                        )}
                                    </div>
                                )}
                            </li>
                            <li><Link to={`/profile/${currentUser.id}`}>Profile</Link></li>
                            <li>
                                <button onClick={logout}>Logout</button>
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