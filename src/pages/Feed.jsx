import {users, posts} from "../data/mockData"
import PostCard from "../components/PostCard"
import './Feed.scss'

function Feed() {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

    return (
        <div className="feed-page">
            <h1>Wall</h1>
            <div className="feed-posts">
                {sortedPosts.map(post => {
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