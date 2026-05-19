import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (isOpen && usernameRef.current) usernameRef.current.focus();
        if (isOpen) setErrorMsg("");
    }, [isOpen]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const body = {
            username: username,
            password: password,
            site_label: "zeuspro",
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

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else if (result.status === "country") {
            setErrorMsg(result.message);
        } else {
            setErrorMsg("Usuario o contraseña incorrectos");
        }
    };


    if (!isOpen) return null;

    return (
        <div
            id="login"
            tabIndex="-1"
            aria-labelledby="loginLabel"
            data-bs-backdrop="false"
            className="modal fade show"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'block' }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(60, 60, 60, 0.95)' }}>
                    <div className="modal-header2 p-0">
                        <h6 id="exampleModalLabel" className="modal-title">
                            ENTRAR
                            <button
                                id="closeLogin"
                                type="button"
                                aria-label="Close"
                                className="btn-close"
                                style={{ background: 'transparent', float: 'right', color: 'rgb(204, 204, 204)' }}
                                onClick={onClose}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </h6>
                    </div>
                    <div className="modal-body p-4" style={{ height: '30%' }}>
                        <div className="text-center">
                            <form onSubmit={handleSubmit}>
                                <div className="pb-2 font-size-custom mb-3 my-3" style={{ color: 'white' }}>
                                    <i className="fas fa-user prefix lightgrey-text mx-2"></i>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Usuario"
                                        autoComplete="off"
                                        className="login-user-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        ref={usernameRef}
                                    />
                                </div>
                                <div className="pb-2 font-size-custom mb-3 my-3" style={{ color: 'white' }}>
                                    <i className="fas fa-lock prefix lightgrey-text mx-2"></i>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Contraseña"
                                        maxLength="16"
                                        autoComplete="off"
                                        className="login-user-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <br />
                                <div className="d-flex mb-3">
                                    <button
                                        type="button"
                                        className="btn p-2 mx-2"
                                        style={{ textTransform: 'uppercase', backgroundColor: 'rgb(41, 45, 61) !important', color: 'white', width: '50%' }}
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        id="submit_btn"
                                        type="submit"
                                        className="btn p-2 mx-2"
                                        style={{ backgroundColor: 'rgb(41, 45, 61) !important', color: 'white', width: '50%' }}
                                    >
                                        {isLoading ? 'Cargando...' : 'ENTRAR'}
                                    </button>
                                </div>
                                {errorMsg && (
                                    <div role="alert" className="alert alert-danger">
                                        {errorMsg}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;