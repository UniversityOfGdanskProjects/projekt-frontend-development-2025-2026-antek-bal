import {useState} from 'react';
import './PostForm.scss';
import {users} from '../data/mockData';

function CreatePostForm({onAddPost}) {
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');

    const currentUser = users.find(u => u.id === 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        const newPost = {
            id: Date.now(),
            author: currentUser.id,
            description: content,
            media: null,
            date: new Date().toISOString(),
            likes: 0,
            comments: [],
            visibility: visibility
        };

        onAddPost(newPost);

        setContent('');
    };

    return (
        <div className="create-post-card">
            <div className="form-header">
                <img src={currentUser.avatar} alt="me" className="avatar"/>
                <div className="inputs">
                    <textarea
                        placeholder={`What's on your mind, ${currentUser.name}?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="form-actions">
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="friends">Friends</option>
                            <option value="private">Private</option>
                        </select>

                        <button onClick={handleSubmit} disabled={!content.trim()}>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePostForm;