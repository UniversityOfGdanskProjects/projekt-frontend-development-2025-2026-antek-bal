import {useRef, useState} from "react"
import { Link } from "react-router-dom"
import { FaImage } from "react-icons/fa"

import { useAuth } from "../context/AuthContext"
import "./PostForm.scss"

const ImagePreview = ({ image, onRemove}) => {
    if (!image) return null;

    return (
        <div className="image-preview">
            <img src={image} alt="Preview"/>
            <button type="button" onClick={onRemove}>x</button>
        </div>
    )
}

const usePostForm = (onAddPost, currentUser) => {
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState('public');
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    }

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim() && !selectedImage) return;

        const newPost = {
            id: Date.now(),
            author: currentUser.id,
            description: content.trim(),
            media: selectedImage,
            date: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            comments: [],
            visibility: visibility
        }

        onAddPost(newPost);

        setContent('');
        removeImage();
        setVisibility('public');
    };

    return {
        content, setContent,
        visibility, setVisibility,
        selectedImage,
        handleImageChange,
        removeImage,
        handleSubmit,
        fileInputRef
    }
}

function CreatePostForm({onAddPost}) {
    const {currentUser} = useAuth();

    const {
        content, setContent,
        visibility, setVisibility,
        selectedImage,
        handleImageChange,
        removeImage,
        handleSubmit,
        fileInputRef
    } = usePostForm(onAddPost, currentUser);

    return (
        <div className="create-post-card">
            <div className="form-header">
                <Link to={`/profile/${currentUser.id}`}>
                    <img src={currentUser.avatar} alt="me" className="avatar"/>
                </Link>

                <div className="inputs">
                    <textarea
                        placeholder={`What's on your mind, ${currentUser.name}?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <ImagePreview image={selectedImage} onRemove={removeImage} />

                    <div className="form-actions">
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="friends">Friends</option>
                            <option value="private">Private</option>
                        </select>

                        <label className="file-label" title="Add Image">
                            <FaImage />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </label>
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && !selectedImage}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePostForm;