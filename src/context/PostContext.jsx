import { createContext, useContext } from "react"
import { posts as initialPosts } from "../data/mockData.js"
import useLocalStorage from "../hooks/useLocalStorage.jsx"

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
    const [allPosts, setAllPosts] = useLocalStorage("feed-posts", initialPosts);

    const updatePost = (postId, updateCb) => {
        setAllPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return updateCb(post)
            }
            return post
        }))
    }

    const addPost = (newPost) => {
        setAllPosts(prev => [newPost, ...prev]);
    }

    const deletePost = (postId) => {
        setAllPosts(prev => prev.filter(p => p.id !== postId));
    }

    const toggleLike = (postId, currentUser, sendNotification) => {
        if (!currentUser) return;

        updatePost(postId, (post) => {
            const currentLikes = post.likedBy || [];
            const isLiked = currentLikes.includes(currentUser.id);

            if (isLiked) {
                return {
                    ...post,
                    likedBy: currentLikes.filter(id => id !== currentUser.id)
                }
            } else {
                if (post.author !== currentUser.id && sendNotification) {
                    sendNotification(
                        post.author,
                        `${currentUser.name} liked your post!`,
                        "like",
                        post.id
                    );
                }
                return {
                    ...post,
                    likedBy: [...currentLikes, currentUser.id]
                }
            }
        });
    };

    const addComment = (postId, content, currentUser, sendNotification) => {
        if (!currentUser) return;

        updatePost(postId, (post) => {
            const newComment = {
                "author": currentUser.id,
                "description": content,
                "date": new Date().toISOString()
            };

            if (post.author !== currentUser.id && sendNotification) {
                sendNotification(
                    post.author,
                    `${currentUser.name} commented on your post`,
                    "comment",
                    post.id
                );
            }

            return {...post, comments: [...(post.comments || []), newComment]};
        });
    };

    const deleteComment = (postId, commentIndex) => {
        updatePost(postId, (post) => ({
            ...post,
            comments: post.comments.filter((_, i) => i !== commentIndex)
        }));
    };

    const value = {
        allPosts,
        addPost,
        deletePost,
        toggleLike,
        addComment,
        deleteComment
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => useContext(PostContext);