import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import {useAuth} from "../context/AuthContext";
import {posts as initialPosts} from "../data/mockData.js";
import "./Profile.scss";

function Profile() {
    const {userId} = useParams();
    const {allUsers, currentUser} = useAuth();

    const [allPosts, setAllPosts] = useState(() => {
        const savedPosts = localStorage.getItem("feed-posts");
        return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    });

    useEffect(() => {
        localStorage.setItem("feed-posts", JSON.stringify(allPosts));
    }, [allPosts]);

    const user = allUsers.find((user) => user.id === Number(userId));

    if (!user) {
        return (
            <div className="profile-page">404 User not found</div>
        );
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
                }

                return {...post, likedBy: newLikedBy};
            }
            return post;
        })

        setAllPosts(updatedPosts)
    }

    let filteredPosts;
    if (currentUser) {
        filteredPosts = allPosts.filter(p => (p.visibility === "public" || (p.visibility === "friends" && currentUser.friends.includes(p.author)) || p.author === currentUser.id));
    } else {
        filteredPosts = allPosts.filter(p => p.visibility === "public");
    }
    const userPosts = [...filteredPosts].filter(p => p.author === user.id);
    const sortedPosts = [...userPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} className="profile-avatar" alt="profile"/>

                <div className="profile-info">
                    <h1>{user.name} {user.surname}</h1>
                    <p className="friends-count">{user.friends.length} friends</p>
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
                        />
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;