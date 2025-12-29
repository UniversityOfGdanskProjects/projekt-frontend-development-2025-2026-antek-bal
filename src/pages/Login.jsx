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

    const [errors, setErrors] = useState({});

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

    const clearError = (fieldName) => {
        if (errors[fieldName] || errors.general) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                delete newErrors.general;
                return newErrors;
            });
        }
    }

    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        clearError(name);
    }

    const handleRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
        clearError(name);
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

        const newErrors = {};
        if (!loginData.username.trim()) newErrors.username = "Username is required";
        if (!loginData.password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const success = login(loginData.username, loginData.password);
        if (success) {
            handleSuccess();
        } else {
            setErrors({ general: "Invalid credentials" });
        }
    };

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        const { username, password, name, surname, avatar } = registerData;

        const newErrors = {};
        if (!name.trim()) newErrors.name = "First name required";
        if (!surname.trim()) newErrors.surname = "Last name required";
        if (!username.trim()) newErrors.username = "Username required";
        if (!password) newErrors.password = "Password required";
        else if (password.length < 12) newErrors.password = "Password must be at least 12 characters long";
        else if (password.toLowerCase() === password) newErrors.password = "Password must contain uppercase characters"
        else if (password.toUpperCase() === password) newErrors.password = "Password must contain lowercase characters"
        else if (!password.split('').some(char => ("0123456789").includes(char))) newErrors.password = "Password must contain number"
        else if (!password.split('').some( char => ("!@#$%^&*()_+-=[]{}|;':\",./<>?").includes(char))) newErrors.password = "Password must contain special character"


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const success = register(username, password, name, surname, avatar);
        if (success) {
            handleSuccess();
        } else {
            setErrors({ username: "This username is already taken" });
        }
    };

    const toggleView = (view) => {
        setIsLoginView(view);
        setErrors({});
        setLoginData({ username: "", password: "" });
        setRegisterData({ username: "", password: "", name: "", surname: "", avatar: "" });
        setPreview(null);
    }

    return (
        <div className="login-page">
            <div className="card">
                <div className="card-header">
                    {isLoginView ? (
                        <>
                            <h1>Welcome Back!</h1>
                            <p>Enter your details to login</p>
                        </>
                    ) : (
                        <>
                            <h1>Create Account</h1>
                            <p>Fill in the form to get started</p>
                        </>
                    )}
                </div>

                {errors.general && <div className="general-error">{errors.general}</div>}

                {isLoginView ? (
                    <form onSubmit={onLoginSubmit} className="auth-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                className={errors.username ? "input-error" : ""}
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className={errors.password ? "input-error" : ""}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <button type="submit">Login</button>
                    </form>
                ) : (
                    <form onSubmit={onRegisterSubmit} className="auth-form">
                        <div className="row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="First Name"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    className={errors.name ? "input-error" : ""}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Last Name"
                                    value={registerData.surname}
                                    onChange={handleRegisterChange}
                                    className={errors.surname ? "input-error" : ""}
                                />
                                {errors.surname && <span className="error-text">{errors.surname}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                className={errors.username ? "input-error" : ""}
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className={errors.password ? "input-error" : ""}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

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