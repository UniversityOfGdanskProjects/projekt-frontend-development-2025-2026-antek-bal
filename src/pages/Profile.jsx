import { useState } from "react"
import { useParams } from "react-router-dom"

import PostCard from "../components/PostCard.jsx"
import EditProfile from "../components/EditProfile.jsx"

import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"
import { usePosts } from "../context/PostContext.jsx"

import "./Profile.scss"


function Profile() {
    const {userId} = useParams();
    const {
        allUsers,
        currentUser,
        toggleFollow,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        sendNotification
    } = useAuth();
    const {openChat} = useChat();

    const { allPosts, toggleLike, addComment, deleteComment, deletePost } = usePosts();

    const [isEditing, setIsEditing] = useState(false);

    const user = allUsers.find((user) => user.id === Number(userId));

    if (!user) {
        return <div className="profile-page">404 User not found</div>;
    }

    const handleToggleLike = (postId) => {
        toggleLike(postId, currentUser, sendNotification);
    }

    const handleAddComment = (postId, content) => {
        addComment(postId, content, currentUser, sendNotification);
    }

    let filteredPosts;
    if (currentUser) {
        filteredPosts = allPosts.filter(p => (p.visibility === "public" || (p.visibility === "friends" && currentUser.friends?.includes(p.author)) || p.author === currentUser.id));
    } else {
        filteredPosts = allPosts.filter(p => p.visibility === "public");
    }
    const userPosts = [...filteredPosts].filter(p => p.author === user.id);
    const sortedPosts = [...userPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    const isMe = currentUser?.id === user.id;
    const isFriend = currentUser?.friends?.includes(user.id);
    const hasSentRequest = user.friendRequests?.includes(currentUser?.id);
    const hasReceivedRequest = currentUser?.friendRequests?.includes(user.id);

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} className="profile-avatar" alt="profile"/>

                <div className="profile-info">
                    <h1>{user.name} {user.surname}</h1>
                    <div className="stats-row">
                        <span><strong>{user.friends?.length || 0}</strong> Friends</span>
                        <span><strong>{user.followers?.length || 0}</strong> Followers</span>
                    </div>

                    {currentUser && isMe ? (
                        <div className="action-buttons">
                            <button className="edit-profile-btn profile-btn" onClick={() => {
                                setIsEditing(true)
                            }}>Edit Profile
                            </button>
                        </div>
                    ) : (currentUser &&
                        <div className="action-buttons">

                            <button
                                className={`follow-btn profile-btn ${currentUser.following?.includes(user.id) ? 'following' : ''}`}
                                onClick={() => toggleFollow(user.id)}
                            >
                                {currentUser.following?.includes(user.id) ? "Unfollow" : "Follow"}
                            </button>

                            {isFriend ? (
                                <>
                                    <button className="remove-btn profile-btn" onClick={() => removeFriend(user.id)}>
                                        Remove Friend
                                    </button>
                                    <button className="profile-btn chat-btn" onClick={() => openChat(user.id)}>
                                        Message
                                    </button>
                                </>
                            ) : hasSentRequest ? (
                                <button className="request-sent-btn profile-btn" disabled>Request Sent</button>
                            ) : hasReceivedRequest ? (
                                <>
                                    <button className="accept-btn profile-btn"
                                            onClick={() => acceptFriendRequest(user.id)}>Accept
                                    </button>
                                    <button className="decline-btn profile-btn"
                                            onClick={() => declineFriendRequest(user.id)}>Decline
                                    </button>
                                </>
                            ) : (
                                <button className="add-btn profile-btn" onClick={() => sendFriendRequest(user.id)}>Add
                                    Friend</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-posts">
                {sortedPosts.length > 0 ? (
                    sortedPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={user}
                            onToggleLike={handleToggleLike}
                            onAddComment={handleAddComment}
                            onDeleteComment={deleteComment}
                            onDeletePost={deletePost}
                        />
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
            {isEditing && (
                <EditProfile onClose={() => setIsEditing(false)}/>
            )}
        </div>
    );
}

export default Profile;