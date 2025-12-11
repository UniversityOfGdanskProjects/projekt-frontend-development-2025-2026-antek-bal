import {useState} from 'react';
import './PostForm.scss';
import {users} from '../data/mockData';

function CreatePostForm({onAddPost}) {
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [selectedImage, setSelectedImage] = useState(null);

    const currentUser = users.find(u => u.id === 1);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim() && !selectedImage) return;

        const newPost = {
            id: Date.now(),
            author: currentUser.id,
            description: content,
            media: selectedImage,
            date: new Date().toISOString(),
            likes: 0,
            comments: [],
            visibility: visibility
        };

        onAddPost(newPost);

        setContent('');
        setSelectedImage(null);
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

                    {selectedImage && (
                        <div className="image-preview">
                            <img
                                src={selectedImage}
                                alt="Preview"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                            >
                                x
                            </button>
                        </div>
                    )}

                    <div className="form-actions">
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="friends">Friends</option>
                            <option value="private">Private</option>
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <button onClick={handleSubmit} disabled={!content.trim() && !selectedImage}>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePostForm;