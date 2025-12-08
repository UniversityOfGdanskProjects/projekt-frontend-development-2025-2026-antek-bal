import {users, posts} from "../data/mockData"
import PostCard from "../components/PostCard"
import './Feed.scss'

function Feed() {
    return (
        <div className="feed-page">
            <h1>Wall</h1>
            <div className="feed-posts">
                {posts.map(post => {
                    const author = users.find(user => user.id === post.author)

                    return (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={author}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Feed;