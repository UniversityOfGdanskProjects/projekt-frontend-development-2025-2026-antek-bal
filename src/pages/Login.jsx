import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx"
import "./Login.scss"


function Login() {
    const navigate = useNavigate();
    const {login, register} = useAuth();

    const [loginUsername, setLoginUsername] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [registerUsername, setRegisterUsername] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerName, setRegisterName] = useState("")
    const [registerSurname, setRegisterSurname] = useState("")
    const [registerAvatar, setRegisterAvatar] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()

        const success = login(loginUsername, loginPassword)
        if (success) {
            navigate('/')
        } else {
            alert("Invalid credentials!")
        }
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (!registerUsername || !registerPassword || !registerName || !registerSurname) {
            alert("Complete all required fields")
            return
        }

        const success = register(
            registerUsername,
            registerPassword,
            registerName,
            registerSurname,
            registerAvatar
        )

        if (success) {
            navigate('/')
        } else {
            alert("This username is already in use!")
        }

    }
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64 = reader.result

                setRegisterAvatar(String(base64))
                setSelectedImage(base64)
            }

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <div className="form-inputs">
                        <input
                            type="text"
                            placeholder="username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <hr/>
            <div className="register">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-inputs">
                        <input
                            type="text"
                            placeholder="username"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="name"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="surname"
                            value={registerSurname}
                            onChange={(e) => setRegisterSurname(e.target.value)}
                        />
                        {selectedImage && (
                            <div className="image-preview">
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    x
                                </button>
                            </div>)}
                        <label className="file-label">Avatar (optional):</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Login;