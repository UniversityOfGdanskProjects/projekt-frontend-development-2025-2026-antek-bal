import {users, posts} from "../data/mockData"
import PostCard from "../components/PostCard"
import './Feed.scss'

function Feed() {
    const CURRENT_USER_ID = 1;
    const currentUser = users.find(u => u.id === CURRENT_USER_ID);
    const filteredPosts = posts.filter(p => p.visibility === "public" || (p.visibility === "friends" && currentUser.friends.includes(p.author)) || p.author === CURRENT_USER_ID);
    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date))

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