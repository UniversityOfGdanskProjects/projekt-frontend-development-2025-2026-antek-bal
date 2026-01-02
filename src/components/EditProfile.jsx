import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext.jsx"
import "./EditProfile.scss"

function EditProfile({onClose}) {
    const {currentUser, updateProfile, deleteAccount} = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ...currentUser,
        password: ""
    })
    const [preview, setPreview] = useState(currentUser.avatar);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData(prev => ({...prev, avatar: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        const updates = {...formData};
        if (!updates.password) {
            delete updates.password;
        } else {
            updates.password = btoa(updates.password);
        }

        updateProfile(currentUser.id, updates);

        if (onClose) onClose()
        navigate(`/profile/${currentUser.id}`);
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteAccount();
            navigate("/login");
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <h1>Personal Info (Step 1/3)</h1>
                        <form>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="First name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <label>Last Name</label>
                            <input
                                type="text"
                                name="surname"
                                placeholder="Last name"
                                value={formData.surname}
                                onChange={handleChange}
                            />

                            <label>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                disabled
                                className="disabled-input"
                            />
                        </form>
                    </div>
                )
            case 2:
                return (
                    <div className="step-content">
                        <h1>Profile Picture (Step 2/3)</h1>
                        <div className="avatar-preview">
                            <img src={preview} alt="Avatar Preview"/>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                )
            case 3:
                return (
                    <div className="step-content">
                        <h1>Security (Step 3/3)</h1>
                        <form>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Leave empty to keep current password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </form>
                        <div className="delete-zone">
                            <p>Danger Zone</p>
                            <button type="button" className="delete-account-btn" onClick={handleDeleteClick}>
                                Delete My Account
                            </button>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="edit-profile">
            <div className="edit-container">
                {renderStepContent()}
                <div className="form-actions">
                    {step > 1 && (
                        <button type="button" onClick={() => setStep(s => s - 1)}>
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button type="button" onClick={() => setStep(s => s + 1)}>
                            Next
                        </button>
                    ) : (
                        <button type="button" className="save-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default EditProfile;