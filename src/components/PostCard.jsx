import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaRegComment, FaRegTrashAlt, FaShare } from "react-icons/fa"

import { useAuth } from "../context/AuthContext.jsx"

import {formatDate} from "../utils/date.js";

import "./PostCard.scss"



function PostCard({post, author, onToggleLike, onAddComment, onDeleteComment, onDeletePost}) {
    const {currentUser, allUsers} = useAuth();

    const isLiked = currentUser && (post.likedBy || []).includes(currentUser.id);
    const likeCount = (post.likedBy || []).length + (post.likes || 0);

    const [isComment, setIsComment] = useState(false);
    const [commentText, setCommentText] = useState("");


    return (
        <div className="post-card" id={`post-${post.id}`}>
            <div className="post-card-header">
                <div className="post-card-header-left">
                    <Link to={`/profile/${post.author}`}><img className="avatar" src={author.avatar}
                                                              alt="avatar"/></Link>
                    <div className="post-card-header-left-info">
                        <div className="author-name"><Link
                            to={`/profile/${post.author}`}>{author.name} {author.surname}</Link></div>
                        <div className="date">{formatDate(post.date)}</div>
                    </div>
                </div>
                <div className="post-card-header-right">
                    <div className="visibility">{post.visibility}</div>
                    {post.author === currentUser.id && (
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
                <div className={`like ${isLiked ? 'active' : ''}`} onClick={() => onToggleLike(post.id)}>
                    <FaHeart/>{likeCount}</div>
                <div className="comment" onClick={() => setIsComment(!isComment)}><FaRegComment/>{post.comments.length}
                </div>
                <div className="share"><FaShare/></div>
            </div>
            {isComment && (
                <>
                    <div className="post-comments">
                        {post.comments.length > 0 ? (
                            post.comments.map((comment, index) => {
                                const user = allUsers.find(u => u.id === comment.author);
                                const content = comment.description

                                if (!user) {
                                    return null
                                }

                                return (
                                    <div className="comment-item" key={index}>
                                        <Link to={`/profile/${user.id}`} className="link-avatar"><img src={user.avatar} className="avatar" alt="avatar"/></Link>
                                        <Link to={`/profile/${user.id}`} className="link-name"><div className="author-name">{user.name} {user.surname}</div></Link>
                                        {currentUser.id === user.id ? (
                                            <div className="content"><span className="content-text">{content}</span><span className="content-icon"><FaRegTrashAlt onClick={() => onDeleteComment(post.id, index)}/></span></div>
                                        ) : (
                                            <div className="content"><span className="content-text">{content}</span></div>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="no-comments">No comments</div>
                        )}
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onAddComment(post.id, commentText);
                        setCommentText("");
                    }}>
                        <div className="comment-form">
                            <img src={currentUser.avatar} className="avatar" alt="avatar"/>
                            <input type="text" placeholder="Start writing..." value={commentText}
                                   onChange={(e) => setCommentText(e.target.value)}/>
                            <button type="submit">Post</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default PostCard;