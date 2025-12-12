import {useParams} from 'react-router-dom';
import {users, posts} from '../data/mockData.js';
import PostCard from "../components/PostCard.jsx";
import './Profile.scss'

function Profile() {
    const {userId} = useParams();
    const user = users.find((user) => user.id === Number(userId));

    if (!user) {
        return (
            <div className="profile-page">404 User not found</div>
        )
    }

    const userPosts = posts
        .filter(p => p.author === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} className="profile-avatar" alt="profile" />

                <div className="profile-info">
                    <h1>{user.name} {user.surname}</h1>
                    <p className="friends-count">{user.friends.length} friends</p>
                </div>
            </div>

            <div className="profile-posts">
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            author={user}
                        />
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </div>
    )
}

export default Profile;