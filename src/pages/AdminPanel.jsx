import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {usePosts} from "../context/PostContext.jsx"

const AdminPanel = () => {
    const {allUsers, toggleBlockUser} = useAuth()
    const {allPosts, deletePost} = usePosts()
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="admin-page">
            <div className="container">
                <h1>Admin Panel</h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'users' && (
                        <div className="section-users">
                            <h2>Manage Users</h2>
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>#{user.id}</td>
                                            <td>
                                                <div className="user-cell">
                                                    <img src={user.avatar} alt="avatar" />
                                                    <div className="info">
                                                        <span className="name">{user.name} {user.surname}</span>
                                                        <span className="username">@{user.username}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                    <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                                                        {user.role || 'user'}
                                                    </span>
                                            </td>
                                            <td>
                                                    <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                            </td>
                                            <td>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                                                        onClick={() => toggleBlockUser(user.id)}
                                                    >
                                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'posts' && (
                        <div className="section-posts">
                            <h2>Manage Posts</h2>
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Content</th>
                                        <th>Author</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allPosts.map(post => {
                                        const author = allUsers.find(u => u.id === post.author);
                                        return (
                                            <tr key={post.id}>
                                                <td>#{post.id}</td>
                                                <td>
                                                    <div className="post-content-cell">
                                                        {post.media && <img src={post.media} alt="media" className="post-thumb"/>}
                                                        <p>{post.description ? post.description.substring(0, 50) + '...' : 'No description'}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    {author ? (
                                                        <div className="author-cell">
                                                            <img src={author.avatar} alt="author" />
                                                            <span>{author.name}</span>
                                                        </div>
                                                    ) : 'Unknown'}
                                                </td>
                                                <td>{new Date(post.date).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => deletePost(post.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}