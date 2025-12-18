import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import {useAuth} from "../context/AuthContext.jsx";
import {usePosts} from "../context/PostContext.jsx";
import "./Feed.scss";

function Feed() {
    const {currentUser, allUsers, sendNotification} = useAuth();
    const { allPosts, addPost, deletePost, toggleLike, addComment, deleteComment } = usePosts();

    const handleAddPost = (newPost) => {
        const postWithLikes = {...newPost, likedBy: []};

        addPost(postWithLikes);

        if (currentUser && currentUser.followers) {
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

    const handleToggleLike = (postId) => {
        toggleLike(postId, currentUser, sendNotification);
    };

    const handleAddComment = (postId, content) => {
        addComment(postId, content, currentUser, sendNotification);
    };

    let filteredPosts;
    if (currentUser) {
        filteredPosts = allPosts.filter(p =>
            p.visibility === "public" ||
            (p.visibility === "friends" && currentUser.friends?.includes(p.author)) ||
            p.author === currentUser.id
        );
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
                    const author = allUsers.find(user => user.id === post.author);
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
                })}
            </div>
        </div>
    );
}

export default Feed;