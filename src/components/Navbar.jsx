import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaBell, FaCommentDots, FaSearch } from "react-icons/fa"

import { useAuth } from "../context/AuthContext.jsx"
import { useChat } from "../context/ChatContext.jsx"
import {formatDate} from "../utils/date.js";

import "./Navbar.scss"

const SearchResults = ({ results, onSelect }) => {
    if (results.length === 0) return null

    return (
        <div className="search-results">
            {results.map((user) => (
                <Link
                    to={`/profile/${user.id}`}
                    key={user.id}
                    className="search-item"
                    onClick={onSelect}
                >
                    <img src={user.avatar} alt="avatar"/>
                    <div className="user-info">
                        <span className="name">{user.name} {user.surname}</span>
                        <span className="username">@{user.username}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

const NotificationDropdown = ({notifications, onNotificationClick}) => {
    if (notifications.length === 0) {
        return (
            <div className="notification-dropdown">
                <div className="no-notifications">No notifications</div>
            </div>
        )
    }

    return (
        <div className="notification-dropdown">
            {notifications.map(n => (
                <div
                    key={n.id}
                    className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                    onClick={() => onNotificationClick(n)}
                >
                    <div className="notification-content">{n.content}</div>
                    <div className="notification-date">{formatDate(n.date)}</div>
                </div>
            ))}
        </div>
    )
}

const highlightPost = (referenceId) => {
    setTimeout(() => {
        const element = document.getElementById(`post-${referenceId}`)
        if (element) {
            element.scrollIntoView({behavior: "smooth", block: "center"})
            element.style.transition = "border 0.5s"
            element.style.border = "2px solid #2196f3"
            setTimeout(() => element.style.border = "none", 2000)
        }
    }, 800)
}

function Navbar() {
    const navigate = useNavigate();
    const {allUsers, currentUser, logout, notifications, markAsRead} = useAuth();
    const {messages, openChat} = useChat();

    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const myNotifications = useMemo(() => {
        return currentUser ? (notifications || []).filter(n => n.receiverId === currentUser.id) : [];
    }, [currentUser, notifications]);

    const unreadCount = useMemo(() =>
        myNotifications.filter(n => !n.isRead).length,
        [myNotifications]
    )

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return [];
        const lowerQuery = searchQuery.toLowerCase();
        return allUsers.filter(user => {
            const searchString = `${user.name} ${user.surname} ${user.username}`.toLowerCase();
            return searchString.includes(lowerQuery)
        });
    }, [searchQuery, allUsers]);

    const unreadMessagesCount = useMemo(() =>
        messages.filter(msg => msg.receiverId === currentUser?.id && !msg.isRead).length,
        [messages, currentUser]
    )

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        setShowNotifications(false);

        const targetUserId = ["post", "follow", "friend"].includes(notification.type)
            ? notification.senderId
            : currentUser.id;

        navigate(`/profile/${targetUserId}`)

        if (["post", "like", "comment"].includes(notification.type)) {
            highlightPost(notification.referenceId);
        }
    }

    const handleOpenUnreadChats = () => {
        const unreadSenders = new Set(
                messages
                    .filter(msg => msg.receiverId === currentUser?.id && !msg.isRead)
                    .map(msg => msg.senderId)
        )
        unreadSenders.forEach(senderId => openChat(senderId));
    };

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
                        <SearchResults
                            results={filteredUsers}
                            onSelect={() => setSearchQuery("")}
                        />
                    </div>
                )}
            </div>

            <ul className="nav-right">
                {currentUser ? (
                    <>
                        {currentUser.role === 'admin' && (
                            <li><Link to="/admin">Admin Panel</Link></li>
                        )}

                        <li className="notification-container">
                            <button className="chat-btn" onClick={handleOpenUnreadChats}>
                                <FaCommentDots />
                                {unreadMessagesCount > 0 && (
                                    <span className="badge">{unreadMessagesCount}</span>
                                )}
                            </button>
                        </li>

                        <li className="notification-container">
                            <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                                <FaBell/>
                                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </button>

                            {showNotifications && (
                                <NotificationDropdown
                                    notifications={myNotifications}
                                    onNotificationClick={handleNotificationClick}
                                />
                            )}
                        </li>

                        <li><Link to="/events">Events</Link></li>

                        <li><Link to={`/profile/${currentUser.id}`}>Profile</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;