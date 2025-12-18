import {createContext, useContext, useEffect, useState} from "react";
import {posts as initialPosts} from "../data/mockData.js";

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
    const [allPosts, setAllPosts] = useState(() => {
        const savedPosts = localStorage.getItem("feed-posts");
        return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    });

    useEffect(() => {
        localStorage.setItem('feed-posts', JSON.stringify(allPosts));
    }, [allPosts]);

    const addPost = (newPost) => {
        setAllPosts(prev => [newPost, ...prev]);
    }

    const deletePost = (postId) => {
        setAllPosts(prev => prev.filter(p => p.id !== postId));
    }

    const toggleLike = (postId, currentUser, sendNotification) => {
        if (!currentUser) return;

        setAllPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const currentLikes = post.likedBy || [];
                const isLiked = currentLikes.includes(currentUser.id);

                let newLikedBy;
                if (isLiked) {
                    newLikedBy = currentLikes.filter(id => id !== currentUser.id);
                } else {
                    newLikedBy = [...currentLikes, currentUser.id];

                    if (post.author !== currentUser.id && sendNotification) {
                        sendNotification(
                            post.author,
                            `${currentUser.name} liked your post!`,
                            "like",
                            post.id
                        );
                    }
                }
                return {...post, likedBy: newLikedBy};
            }
            return post;
        }));
    };

    const addComment = (postId, content, currentUser, sendNotification) => {
        if (!currentUser) return;

        setAllPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const newComment = {
                    "author": currentUser.id,
                    "description": content,
                    "date": new Date().toISOString()
                };

                if (p.author !== currentUser.id && sendNotification) {
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
        }));
    };

    const deleteComment = (postId, commentIndex) => {
        setAllPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const newComments = p.comments.filter((_, i) => i !== commentIndex);
                return {...p, comments: newComments};
            }
            return p;
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