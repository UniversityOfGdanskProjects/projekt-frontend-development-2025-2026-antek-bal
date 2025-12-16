import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

function EditProfile() {
    const {currentUser, updateProfile} = useAuth();
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        "id": currentUser.id,
        "username": currentUser.username,
        "password": currentUser.password,
        "name": currentUser.name,
        "surname": currentUser.surname,
        "avatar": currentUser.avatar,
    })
    const [preview, setPreview] = useState(currentUser.avatar);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData({...formData, avatar: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        const data = { ...formData };
        if (!data.password) {
            delete data.password;
        } else {
            data.password = btoa(data.password);
        }

        updateProfile(currentUser.id, data);
        navigate(`/profile/${currentUser.id}`);
    };

    return (
        <div className="edit-profile">
            <div className="edit-container">

                {step === 1 && (
                    <div className="step-content">
                        <h1>Personal Info (Step 1/3)</h1>
                        <form>
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="First name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />

                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last name"
                                value={formData.surname}
                                onChange={(e) => setFormData({...formData, surname: e.target.value})}
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
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h1>Profile Picture (Step 2/3)</h1>
                        <div className="avatar-preview">
                            <img src={preview} alt="Avatar Preview" style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h1>Security (Step 3/3)</h1>
                        <form>
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Leave empty to keep current password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </form>
                    </div>
                )}

                <div className="form-actions" style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                    {step > 1 && (
                        <button type="button" onClick={prevStep}>Back</button>
                    )}

                    {step < 3 ? (
                        <button type="button" onClick={nextStep}>Next</button>
                    ) : (
                        <button type="button" onClick={handleSave} style={{backgroundColor: '#00e676'}}>Save Changes</button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default EditProfile;