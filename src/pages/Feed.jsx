import {useMemo, useState} from 'react'
import InfiniteScroll from "react-infinite-scroll-component";

import PostCard from "../components/PostCard"
import PostForm from "../components/PostForm"
import SuggestedFriends from "../components/SuggestedFriends"

import { useAuth } from "../context/AuthContext.jsx"
import { usePosts } from "../context/PostContext.jsx"

import "./Feed.scss"


function Feed() {
    const {currentUser, allUsers, sendNotification} = useAuth();
    const { allPosts, addPost, deletePost, toggleLike, addComment, deleteComment } = usePosts();

    const [page, setPage] = useState(1);
    const max_posts = 5;

    const filteredPosts = useMemo(() => {
        return allPosts
            .filter(post => {
                const author = allUsers.find(u => u.id === post.author);
                if (!author || author.isBlocked) return false;
                if (currentUser && post.author === currentUser.id) return true;

                if (post.visibility === "public") return true;
                if (post.visibility === "friends") {
                    return currentUser.friends.includes(post.author);
                }

                return false;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [allPosts, allUsers, currentUser]);

    const postsToDisplay = useMemo(() => {
        return filteredPosts.slice(0, page * max_posts);
    }, [filteredPosts, page])

    const fetchMoreData = () => {
        setPage(prev => prev + 1);
    };

    const hasMore = postsToDisplay.length < filteredPosts.length;

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

    const suggestedFriends = allUsers.filter(user =>
        user.id !== currentUser.id &&
        !currentUser.friends.includes(user.id) &&
        !user.friendRequests.includes(currentUser.id) &&
        !user.isBlocked
    ).sort((a, b) => {
        const mutualA = a.friends.filter(f => currentUser.friends.includes(f)).length;
        const mutualB = b.friends.filter(f => currentUser.friends.includes(f)).length;

        return mutualB - mutualA;
    }).slice(0, 10);

    return (
        <div className="feed-page">
            <h1>Wall</h1>

            <div className="feed-layout">
                <div className="feed-main">
                    {currentUser && (
                        <PostForm onAddPost={handleAddPost}/>
                    )}

                    <InfiniteScroll
                        dataLength={postsToDisplay.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        className="infinite-scroll"
                    >
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
                    </InfiniteScroll>
                </div>
                <div className="feed-sidebar">
                    <SuggestedFriends friends={suggestedFriends} />
                </div>
            </div>
        </div>
    );
}

export default Feed;