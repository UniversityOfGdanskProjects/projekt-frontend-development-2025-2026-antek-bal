import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import PostCard from "../components/PostCard.jsx"
import EditProfile from "../components/EditProfile.jsx"

import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"
import { usePosts } from "../context/PostContext.jsx"

import "./Profile.scss"

const ProfileActions = ({
    isMe, isFriend, isFollowing, requestSent, requestReceived,
    onEdit, onFollow, onMessage, onRemove, onAccept, onDecline, onAdd
}) => {
    if (isMe) {
        return (
            <div className="action-buttons">
                <button className="edit-btn profile-btn" onClick={onEdit}>
                    Edit Profile
                </button>
            </div>
        );
    }

    return (
        <div className="action-buttons">
            <button
                className={`follow-btn profile-btn ${isFollowing ? 'following' : ''}`}
                onClick={onFollow}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </button>

            {isFriend ? (
                <>
                    <button className="remove-btn profile-btn" onClick={onRemove}>
                        Remove Friend
                    </button>
                    <button className="profile-btn chat-btn" onClick={onMessage}>
                        Message
                    </button>
                </>
            ) : requestSent ? (
                <button className="request-sent-btn profile-btn" disabled>
                    Request Sent
                </button>
            ) : requestReceived ? (
                <>
                    <button className="accept-btn profile-btn" onClick={onAccept}>
                        Accept
                    </button>
                    <button className="decline-btn profile-btn" onClick={onDecline}>
                        Decline
                    </button>
                </>
            ) : (
                <button className="add-btn profile-btn" onClick={onAdd}>
                    Add Friend
                </button>
            )}
        </div>
    )
}

function Profile() {
    const {userId} = useParams();
    const [isEditing, setIsEditing] = useState(false);

    const {
        allUsers, currentUser, toggleFollow, sendFriendRequest,
        acceptFriendRequest, declineFriendRequest, removeFriend, sendNotification
    } = useAuth();

    const {openChat} = useChat();
    const { allPosts, toggleLike, addComment, deleteComment, deletePost } = usePosts();

    const profileUser = useMemo(() =>
        allUsers.find(u => u.id === Number(userId)),
        [allUsers, userId]
    )

    const { isMe, isFriend, hasSentRequest, hasReceivedRequest, isFollowing } = useMemo(() => {
        if (!currentUser || !profileUser) return {};

        return {
            isMe: currentUser.id === profileUser.id,
            isFriend: currentUser.friends.includes(profileUser.id),
            hasSentRequest: profileUser.friendRequests.includes(currentUser.id),
            hasReceivedRequest: currentUser.friendRequests.includes(profileUser.id),
            isFollowing: currentUser.following.includes(profileUser.id)
        };
    }, [currentUser, profileUser]);

    const userPosts = useMemo(() => {
        if (!profileUser) return [];

        return allPosts
            .filter(p => p.author === profileUser.id)
            .filter(p => {
                if (isMe) return true;
                if (p.visibility === "public") return true;
                if (p.visibility === "friends") return isFriend;

                return false;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [allPosts, profileUser, isMe, isFriend]);

    const handleToggleLike = (postId) => toggleLike(postId, currentUser, sendNotification)
    const handleAddComment = (postId, content) => addComment(postId, content, currentUser, sendNotification)

    if (!profileUser) {
        return <div className="profile-page">404 User not found</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={profileUser.avatar} className="profile-avatar" alt="profile"/>

                <div className="profile-info">
                    <h1>{profileUser.name} {profileUser.surname}</h1>
                    <div className="stats-row">
                        <span><strong>{profileUser.friends?.length || 0}</strong> Friends</span>
                        <span><strong>{profileUser.followers?.length || 0}</strong> Followers</span>
                    </div>

                    {currentUser && (
                        <ProfileActions
                            isMe={isMe}
                            isFriend={isFriend}
                            isFollowing={isFollowing}
                            requestSent={hasSentRequest}
                            requestReceived={hasReceivedRequest}
                            onEdit={() => setIsEditing(true)}
                            onFollow={() => toggleFollow(profileUser.id)}
                            onMessage={() => openChat(profileUser.id)}
                            onRemove={() => removeFriend(profileUser.id)}
                            onAccept={() => acceptFriendRequest(profileUser.id)}
                            onDecline={() => declineFriendRequest(profileUser.id)}
                            onAdd={() => sendFriendRequest(profileUser.id)}
                        />
                    )}
                </div>
            </div>

            <div className="profile-posts">
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={profileUser}
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