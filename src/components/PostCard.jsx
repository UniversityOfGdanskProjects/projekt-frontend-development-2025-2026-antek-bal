import {FaHeart, FaRegComment, FaShare} from 'react-icons/fa';
import './PostCard.scss'
import {useState} from 'react';

function PostCard({post, author}) {

    // =============== Handling like button ===============
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);
    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }
    }

    return (
        <div className="post-card">
            <div className="post-card-header">
                <div className="post-card-header-left">
                    <img className="avatar" src={author.avatar} alt="avatar"/>
                    <div className="post-card-header-left-info">
                        <div className="author-name">{author.name} {author.surname}</div>
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
                <div className={`like ${isLiked ? 'active' : ''}`} onClick={handleLike}><FaHeart/>{likes}</div>
                <div className="comment"><FaRegComment/>{post.comments.length}</div>
                <div className="share"><FaShare/></div>
            </div>
        </div>
    )
}

export default PostCard