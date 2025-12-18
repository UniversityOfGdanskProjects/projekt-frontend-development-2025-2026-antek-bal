import {useMemo} from 'react'

import PostCard from "../components/PostCard"
import PostForm from "../components/PostForm"

import { useAuth } from "../context/AuthContext.jsx"
import { usePosts } from "../context/PostContext.jsx"

import "./Feed.scss"


function Feed() {
    const {currentUser, allUsers, sendNotification} = useAuth();
    const { allPosts, addPost, deletePost, toggleLike, addComment, deleteComment } = usePosts();

    const postsToDisplay = useMemo(() => {
        return allPosts
            .filter(post => {
                const author = allUsers.find(u => u.id === post.author);
                if (!author || author.isBlocked) return false;
                if (currentUser && post.author === currentUser.id) return true;

                if (post.visibility === "public") return true;
                if (post.visibility === "friends") {
                    return currentUser?.friends?.includes(post.author);
                }

                return false;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [allPosts, allUsers, currentUser]);

    const handleAddPost = (newPost) => {
        const postDefaults = {...newPost, likedBy: [], comments: []};

        addPost(postDefaults);

        if (currentUser?.followers?.length > 0) {
            currentUser.followers.forEach(followerId => {
                sendNotification(
                    followerId,
                    `${currentUser.name} just uploaded a new post!`,
                    "post",
                    newPost.id
                );
            });
        }
    }

    const handleToggleLike = (postId) => toggleLike(postId, currentUser, sendNotification);
    const handleAddComment = (postId, content) => addComment(postId, content, currentUser, sendNotification);

    return (
        <div className="feed-page">
            <h1>Wall</h1>

            {currentUser && (
                <PostForm onAddPost={handleAddPost}/>
            )}

            <div className="feed-posts">
                {postsToDisplay.length > 0 ? (
                    postsToDisplay.map((post) => {
                        const author = allUsers.find(u => u.id === post.author);
                        if (!author) return null;

                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                author={author}
                                onToggleLike={handleToggleLike}
                                onAddComment={handleAddComment}
                                onDeleteComment={deleteComment}
                                onDeletePost={deletePost}
                            />
                        )
                    })
                ) : (
                    <div className="no-posts">No posts to show</div>
                )}
            </div>
        </div>
    );
}

export default Feed;