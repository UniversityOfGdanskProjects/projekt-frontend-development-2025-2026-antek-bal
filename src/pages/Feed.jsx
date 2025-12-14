import {useState, useEffect} from "react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import {useAuth} from "../context/AuthContext.jsx";
import {posts} from "../data/mockData";
import "./Feed.scss";


function Feed() {
    const {currentUser, allUsers} = useAuth();
    const [allPosts, updatePosts] = useState(() => {
        const savedPosts = localStorage.getItem("feed-posts");

        return savedPosts ? JSON.parse(savedPosts) : posts;
    });
    useEffect(() => {
        localStorage.setItem('feed-posts', JSON.stringify(allPosts));
    }, [allPosts]);

    const handleAddPost = (newPost) => {
        const postLikes = {...newPost, likedBy: []}
        updatePosts([...allPosts, postLikes]);
    }

    const handleToggleLike = (postId) => {
        if (!currentUser) return;

        const updatedPosts = allPosts.map(post => {
            if (post.id === postId) {
                const currentLikes = post.likedBy || [];
                const isLiked = currentLikes.includes(currentUser.id);

                let newLikedBy;
                if (isLiked) {
                    newLikedBy = currentLikes.filter(id => id !== currentUser.id);
                } else {
                    newLikedBy = [...currentLikes, currentUser.id];
                }

                return { ...post, likedBy: newLikedBy };
            }
            return post;
        });

        updatePosts(updatedPosts);
    };

    let filteredPosts;
    if (currentUser) {
        filteredPosts = allPosts.filter(p => p.visibility === "public" || (p.visibility === "friends" && currentUser.friends.includes(p.author)) || p.author === currentUser.id);
    } else {
        filteredPosts = allPosts.filter(p => p.visibility === "public");
    }

    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date));


    return (
        <div className="feed-page">
            <h1>Wall</h1>
            {currentUser && (
                <PostForm onAddPost={handleAddPost}/>
            )}
            <div className="feed-posts">
                {sortedPosts.map(post => {
                    const author = allUsers.find(user => user.id === post.author)

                    return (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={author}
                            onToggleLike={handleToggleLike}
                        />
                    )
                })}
            </div>
        </div>
    );
}

export default Feed;