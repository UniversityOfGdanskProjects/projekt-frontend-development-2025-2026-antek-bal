import {users, posts} from "../data/mockData"
import PostCard from "../components/PostCard"
import PostForm from "../components/PostForm";
import './Feed.scss'
import {useState, useEffect} from "react";


function Feed() {
    const [allPosts, updatePosts] = useState(() => {
        const savedPosts = localStorage.getItem("feed-posts");

        return savedPosts ? JSON.parse(savedPosts) : posts;
    });
    useEffect(() => {
        localStorage.setItem('feed-posts', JSON.stringify(allPosts));
    }, [allPosts]);

    const handleAddPost = (newPost) => {
        updatePosts([...allPosts, newPost]);
    }

    const CURRENT_USER_ID = 1;
    const currentUser = users.find(u => u.id === CURRENT_USER_ID);
    const filteredPosts = allPosts.filter(p => p.visibility === "public" || (p.visibility === "friends" && currentUser.friends.includes(p.author)) || p.author === CURRENT_USER_ID);
    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date))

    return (
        <div className="feed-page">
            <h1>Wall</h1>
            <PostForm onAddPost={handleAddPost} />
            <div className="feed-posts">
                {sortedPosts.map(post => {
                    const author = users.find(user => user.id === post.author)

                    return (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={author}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Feed;