import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import "./SuggestedFriends.scss"

const SuggestionItem = ({user, onDelete}) => {
    const { sendFriendRequest, toggleFollow, currentUser } = useAuth();
    const [requestSent, setRequestSent] = useState(false);

    const isFollowing = currentUser?.following?.includes(user.id);

    const handleAddFriend = () => {
        sendFriendRequest(user.id);
        setRequestSent(true);
    };

    const handleFollow = () => {
        toggleFollow(user.id);
    };

    return (
        <div className="suggested-friend">
            <p className="delete-suggestion" onClick={() => onDelete(user.id)}>×</p>

            <div className="info-box">
                <Link to={`/profile/${user.id}`}>
                    <img src={user.avatar} alt={user.name} />
                </Link>

                <Link to={`/profile/${user.id}`} className="name-link">
                    <p>{user.name} {user.surname}</p>
                </Link>

                <div className="buttons">
                    <button
                        className={`add-btn ${requestSent ? 'sent' : ''}`}
                        onClick={handleAddFriend}
                        disabled={requestSent}
                    >
                        {requestSent ? "Request Sent" : "Add Friend"}
                    </button>

                    <button
                        className={`follow-btn ${isFollowing ? 'active' : ''}`}
                        onClick={handleFollow}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SuggestedFriend ({friends}) {

    const [visibleSuggestions, setVisibleSuggestions] = useState([]);

    useEffect(() => {
        setVisibleSuggestions(friends);
    }, [friends]);

    const handleDismiss = (userId) => {
        setVisibleSuggestions(prev => prev.filter(u => u.id !== userId));
    };

    if (visibleSuggestions.length === 0) return null;
    return (
        <div className="suggested-friends-box">
            <h3>Suggested for you</h3>
            <div className="suggestions-list">
                {visibleSuggestions.map((f) => (
                    <SuggestionItem
                        key={f.id}
                        user={f}
                        onDismiss={handleDismiss}
                    />
                ))}
            </div>
        </div>
    )
}