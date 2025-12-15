import {Link} from "react-router-dom";
import {FaHeart, FaRegComment, FaShare} from "react-icons/fa";
import {useAuth} from "../context/AuthContext.jsx";
import "./PostCard.scss";

function PostCard({post, author, onToggleLike}) {
    const {currentUser} = useAuth();

    const isLiked = currentUser && (post.likedBy || []).includes(currentUser.id);
    const likeCount = (post.likedBy || []).length + (post.likes || 0)

    return (
        <div className="post-card" id={`post-${post.id}`}>
            <div className="post-card-header">
                <div className="post-card-header-left">
                    <Link to={`/profile/${post.author}`}><img className="avatar" src={author.avatar}
                                                              alt="avatar"/></Link>
                    <div className="post-card-header-left-info">
                        <div className="author-name"><Link
                            to={`/profile/${post.author}`}>{author.name} {author.surname}</Link></div>
                        <div className="date">{new Date(post.date).toLocaleString()}</div>
                    </div>
                </div>
                <div className="post-card-header-right">
                    <div className="visibility">{post.visibility}</div>
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
                <div className={`like ${isLiked ? 'active' : ''}`} onClick={() => onToggleLike(post.id)}><FaHeart/>{likeCount}</div>
                <div className="comment"><FaRegComment/>{post.comments.length}</div>
                <div className="share"><FaShare/></div>
            </div>
        </div>
    );
}

export default PostCard;