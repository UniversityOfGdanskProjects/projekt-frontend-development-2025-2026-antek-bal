import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {FaImage} from "react-icons/fa"

import { useAuth } from "../context/AuthContext.jsx"
import "./Login.scss"

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const {login, register} = useAuth();

    const [isLoginView, setIsLoginView] = useState(true);

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        name: "",
        surname: "",
        avatar: ""
    })

    const [preview, setPreview] = useState(null)

    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    }

    const handleRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setRegisterData(prev => ({ ...prev, [name]: reader.result }));
            }
            reader.readAsDataURL(file);
        }
    };

    const handleSuccess = () => {
        const from = location.state?.from?.pathname || "/";
        navigate(from, {replace: true});
    }

    const onLoginSubmit = (e) => {
        e.preventDefault();
        const success = login(loginData.username, loginData.password);
        if (success) {
            handleSuccess();
        } else {
            alert("Invalid credentials!");
        }
    };

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        const { username, password, name, surname, avatar } = registerData;

        if (!username || !password || !name || !surname) {
            alert("Complete all required fields");
            return;
        }

        const success = register(username, password, name, surname, avatar);
        if (success) {
            handleSuccess();
        } else {
            alert("This username is already in use!");
        }
    };

    return (
        <div className="login-page">
            <div className="card">
                <div className="card-header">
                    <h1>{isLoginView ? "Welcome Back" : "Create Account"}</h1>
                    <p>
                        {isLoginView
                            ? "Enter your details to login"
                            : "Fill in the form to get started"}
                    </p>
                </div>

                {isLoginView ? (
                    <form onSubmit={onLoginSubmit} className="auth-form">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                        />
                        <button type="submit">Login</button>
                    </form>
                ) : (
                    <form onSubmit={onRegisterSubmit} className="auth-form">
                        <div className="row">
                            <input
                                type="text"
                                name="name"
                                placeholder="First Name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Last Name"
                                value={registerData.surname}
                                onChange={handleRegisterChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                        />

                        <div className="file-input-container">
                            {preview && <img src={preview} alt="Preview" className="avatar-preview" />}
                            <label className="file-label">
                                {preview ? "Change Avatar" : "Upload Avatar (Optional)"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </label>
                        </div>

                        <button type="submit">Register</button>
                    </form>
                )}

                <div className="toggle-view">
                    {isLoginView ? (
                        <p>Don't have an account? <span onClick={() => setIsLoginView(false)}>Register</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setIsLoginView(true)}>Login</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;