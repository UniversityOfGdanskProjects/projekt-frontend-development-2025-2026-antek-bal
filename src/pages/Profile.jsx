import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import EditProfile from "../components/EditProfile.jsx";
import {useAuth} from "../context/AuthContext";
import {posts as initialPosts} from "../data/mockData.js";
import {useChat} from "../context/ChatContext";
import "./Profile.scss";

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

    const [allPosts, setAllPosts] = useState(() => {
        const savedPosts = localStorage.getItem("feed-posts");
        return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem("feed-posts", JSON.stringify(allPosts));
    }, [allPosts]);

    const user = allUsers.find((user) => user.id === Number(userId));

    if (!user) {
        return <div className="profile-page">404 User not found</div>;
    }

    const handleToggleLike = (postId) => {
        if (!currentUser) return;

        const updatedPosts = allPosts.map(post => {
            if (post.id === postId) {
                const currentLikes = post.likedBy || [];
                const isLiked = currentLikes.includes(currentUser.id)

                let newLikedBy;
                if (isLiked) {
                    newLikedBy = currentLikes.filter(id => id !== currentUser.id);
                } else {
                    newLikedBy = [...currentLikes, currentUser.id]

                    if (post.author !== currentUser.id) {
                        sendNotification(
                            post.author,
                            `${currentUser.name} liked your post!`,
                            "like",
                            post.id
                        )
                    }
                }

                return {...post, likedBy: newLikedBy};
            }
            return post;
        })

        setAllPosts(updatedPosts)
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

    const handleAddComment = (postId, content) => {
        if (!currentUser) return;

        const updatedPosts = allPosts.map(p => {
            if (p.id === postId) {
                const newComment = {
                    "author": currentUser.id,
                    "description": content,
                    "date": new Date().toISOString()
                };

                if (p.author !== currentUser.id) {
                    sendNotification(
                        p.author,
                        `${currentUser.name} commented on your post`,
                        "comment",
                        p.id
                    );
                }

                return {...p, comments: [...(p.comments || []), newComment]};
            }
            return p;
        });

        setAllPosts(updatedPosts);
    }

    const handleDeleteComment = (postId, commentId) => {
        if (!currentUser) return;

        const updatedPosts = allPosts.map(p => {
            if (p.id === postId) {
                const newComments = p.comments.filter((_, i) => i!== commentId);

                return {...p, comments: newComments};
            }
            return p;
        })

        setAllPosts(updatedPosts);
    }

    const handleDeletePost = (postId) => {
        if (!currentUser) return;
        const updatedPosts = allPosts.filter(p => p.id !== postId);
        setAllPosts(updatedPosts);
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} className="profile-avatar" alt="profile"/>

                <div className="profile-info">
                    <h1>{user.name} {user.surname}</h1>
                    <div className="stats-row" style={{color: '#888', marginBottom: '15px'}}>
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
                            onDeleteComment={handleDeleteComment}
                            onDeletePost={handleDeletePost}
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