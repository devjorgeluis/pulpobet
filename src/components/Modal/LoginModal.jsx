import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgLogo from "/src/assets/img/logo.png";
import IconEye from "/src/assets/svg/eye.svg";
import IconEyeSlash from "/src/assets/svg/eye-off.svg";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isUsernameTouched, setIsUsernameTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const [isApiError, setIsApiError] = useState(false);
    const usernameRef = useRef(null);
    const loginFormRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && usernameRef.current) usernameRef.current.focus();
        if (isOpen) {
            setErrorMsg("");
            setIsApiError(false);
            setIsUsernameTouched(false);
            setIsPasswordTouched(false);
            setIsSubmitAttempted(false);
            setIsLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event) => {
            if (loginFormRef.current && !loginFormRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, onClose]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isLoading) return;
        setIsSubmitAttempted(true);
        setIsUsernameTouched(true);
        setIsPasswordTouched(true);
        setIsApiError(false);

        const cleanUsername = username.trim();
        const cleanPassword = password.trim();
        if (!cleanUsername || !cleanPassword) {
            if (errorMsg) setErrorMsg("");
            return;
        }

        setIsLoading(true);

        const body = {
            username: cleanUsername,
            password: cleanPassword,
            site_label: "main",
        };

        callApi(
            contextData,
            "POST",
            "/login/",
            callbackSubmitLogin,
            JSON.stringify(body)
        );
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);
            setIsApiError(false);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else if (result.status === "country") {
            setErrorMsg(result.message);
            setIsApiError(true);
        } else {
            setErrorMsg("Usuario o contraseña incorrectos");
            setIsApiError(true);
        }
    };

    if (!isOpen) return null;

    return (
        <app-login-form className={`dark ${isOpen ? "is-open" : ""}`}>
            <div className="loginform" ref={loginFormRef}>
                <div className="header-mobile-usermenu-top">
                    <div className="logo-wrapper">
                        <a
                            rel="noopener"
                            onClick={() => navigate("/")}
                            title="Pulpo Mundialito"
                        >
                            <picture>
                                <img
                                    className="image image-dark"
                                    src={ImgLogo}
                                    alt="Pulpo Mundialito"
                                    style={{ height: "53px", width: "179px" }}
                                />
                            </picture>
                        </a>
                    </div>
                </div>

                <form className="loginform-form" onSubmit={handleSubmit}>
                    <span
                        className="loginform-enter"
                        style={{ margin: "20px" }}
                    >
                        Ingresar
                    </span>

                    {errorMsg && <div className="text-error text-center">{errorMsg}</div>}

                    <div className="mb-2" style={{ width: "100%" }}>
                        <div className="cti-label dark">
                            <div className="mt-1">
                                <input
                                    id="username"
                                    type="text"
                                    ref={usernameRef}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (!isUsernameTouched) setIsUsernameTouched(true);
                                        if (errorMsg) setErrorMsg("");
                                        if (isApiError) setIsApiError(false);
                                    }}
                                    onBlur={() => setIsUsernameTouched(true)}
                                    placeholder="Usuario"
                                    maxLength={200}
                                    autoComplete="off"
                                    className={`form-control rounblack${((isSubmitAttempted || isUsernameTouched) && username.trim() === "") || isApiError ? " error" : ""}`}
                                />

                                <div className="icon-container"></div>
                            </div>

                            {(isSubmitAttempted || isUsernameTouched) && username.trim() === "" &&
                                <div className="input-labels-spacing message-container rounblack">
                                    <span className="field-message">
                                        <span>Campo obligatorio</span>
                                    </span>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="mb-2" style={{ width: "100%" }}>
                        <div className="cti-label dark">
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (!isPasswordTouched) setIsPasswordTouched(true);
                                        if (errorMsg) setErrorMsg("");
                                        if (isApiError) setIsApiError(false);
                                    }}
                                    onBlur={() => setIsPasswordTouched(true)}
                                    placeholder="Contraseña"
                                    maxLength={200}
                                    autoComplete="off"
                                    className={`form-control rounblack${((isSubmitAttempted || isPasswordTouched) && password.trim() === "") || isApiError ? " error" : ""}`}
                                />

                                <div className="icon-container">
                                    <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                        <picture>
                                            <img
                                                className="image image-dark"
                                                src={showPassword ? IconEyeSlash : IconEye}
                                                alt="Mostrar contraseña"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>

                            {(isSubmitAttempted || isPasswordTouched) && password.trim() === "" &&
                                <div className="input-labels-spacing message-container rounblack">
                                    <span className="field-message">
                                        <span>Campo obligatorio</span>
                                    </span>
                                </div>
                            }
                        </div>
                    </div>

                    <button
                        className="btn purple btn-block btn-regular w-100 mt-3"
                        type="submit"
                        title="Ingresar"
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <div className="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div> : "Ingresar"
                        }
                    </button>
                </form>
            </div>
        </app-login-form>
    );
};

export default LoginModal;
