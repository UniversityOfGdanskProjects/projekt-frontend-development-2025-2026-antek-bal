import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaRegComment, FaRegTrashAlt, FaShare } from "react-icons/fa"

import { useAuth } from "../context/AuthContext.jsx"
import {formatDate} from "../utils/date.js";

import "./PostCard.scss"

const CommentItem = ({ comment, index, allUsers, currentUser, onDelete, postId}) => {
    const user = allUsers.find(u => u.id === comment.author)

    if (!user) return null;

    const canDelete = currentUser?.id === user.id || currentUser?.role === "admin"

    return (
        <div className="comment-item">
            <Link to={`/profile/${user.id}`} className="link-avatar">
                <img src={user.avatar} className="avatar" alt="avatar"/>
            </Link>
            <Link to={`/profile/${user.id}`} className="link-name">
                <div className="author-name">{user.name} {user.surname}</div>
            </Link>

            <div className="content">
                <span className="content-text">{comment.description}</span>
                {canDelete && (
                    <span className="content-icon">
                        <FaRegTrashAlt onClick={() => onDelete(postId, index)}/>
                    </span>
                )}
            </div>
        </div>
    )
}

const CommentForm = ({ postId, onAdd, currentUser}) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(postId, text)
        setText("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form">
                <img src={currentUser.avatar} className="avatar" alt="avatar"/>
                <input
                    type="text"
                    placeholder="Start writing..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Post</button>
            </div>
        </form>
    )
}

function PostCard({post, author, onToggleLike, onAddComment, onDeleteComment, onDeletePost}) {
    const {currentUser, allUsers} = useAuth();
    const [isCommentVisible, setIsCommentVisible] = useState(false);

    const isLiked = currentUser && (post.likedBy || []).includes(currentUser.id);
    const likeCount = (post.likedBy || []).length + (post.likes || 0);

    const canDeletePost = currentUser?.id === post.author || currentUser?.role === "admin"

    return (
        <div className="post-card" id={`post-${post.id}`}>
            <div className="post-card-header">
                <div className="post-card-header-left">
                    <Link to={`/profile/${post.author}`}>
                        <img className="avatar" src={author.avatar} alt="avatar"/>
                    </Link>
                    <div className="post-card-header-left-info">
                        <div className="author-name">
                            <Link to={`/profile/${post.author}`}>
                                {author.name} {author.surname}
                            </Link>
                        </div>
                        <div className="date">{formatDate(post.date)}</div>
                    </div>
                </div>
                <div className="post-card-header-right">
                    <div className="visibility">{post.visibility}</div>
                    {canDeletePost && (
                        <FaRegTrashAlt className="icon" onClick={() => onDeletePost(post.id)}/>
                    )}
                </div>
            </div>

            <div className="post-card-content">
                <div className="post-card-content-description">
                    {post.description}
                </div>
                <div className="post-card-content-media">
                    {post.media && <img src={post.media} alt="media"/>}
                </div>
            </div>
            <div className="post-card-actions">
                <div
                    className={`like ${isLiked ? 'active' : ''}`}
                    onClick={() => onToggleLike(post.id)}
                >
                    <FaHeart/>{likeCount}
                </div>
                <div
                    className="comment"
                    onClick={() => setIsCommentVisible(!isCommentVisible)}
                >
                    <FaRegComment/>{post.comments.length}
                </div>
                <div className="share"><FaShare/></div>
            </div>

            {isCommentVisible && (
                <>
                    <div className="post-comments">
                        {post.comments.length > 0 ? (
                            post.comments.map((comment, index) => (
                                <CommentItem
                                    key={index}
                                    index={index}
                                    comment={comment}
                                    postId={post.id}
                                    allUsers={allUsers}
                                    currentUser={currentUser}
                                    onDelete={onDeleteComment}
                                />
                            ))
                        ) : (
                            <div className="no-comments">No comments</div>
                        )}
                    </div>

                    {currentUser && (
                        <CommentForm
                            postId={post.id}
                            currentUser={currentUser}
                            onAdd={onAddComment}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default PostCard;