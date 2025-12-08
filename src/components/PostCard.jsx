import { FaHeart, FaRegComment, FaShare } from 'react-icons/fa';

function PostCard({post, author}) {
    return (
        <div className="post-card">
            <div className="post-card-header">
                <div className="post-card-header-left">
                    <img className="avatar" src={author.avatar} alt="avatar" />
                    <div className="post-card-header-left-info">
                        <div className="author-name">{author.name} {author.surname}</div>
                        <div className="date">{post.date}</div>
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
                <div className="like"><FaHeart/>{post.likes}</div>
                <div className="comment"><FaRegComment/>{post.comments.length}</div>
                <div className="share"><FaShare/></div>
            </div>
        </div>
    )
}

export default PostCard