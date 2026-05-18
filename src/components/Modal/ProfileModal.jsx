import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "../Layout/LayoutContext";
import { callApi } from "../../utils/Utils";
import ProfileHistory from "../../pages/Profile/ProfileHistory";
import ProfileTransaction from "../../pages/Profile/ProfileTransaction";

const ProfileModal = ({ onClose, activeSection = "transaction", isMobile = false }) => {
    const [mobileTab, setMobileTab] = useState(activeSection || "transaction");
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);

    const logout = () => {
        callApi(contextData, "POST", "/logout", callbackLogout, null);
    };

    const callbackLogout = () => {
        localStorage.removeItem("session");
        window.location.href = "/";
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        if (activeSection) {
            setMobileTab(activeSection);
        }
    }, [activeSection]);

    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content data-container" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
                    <div className="modal-body row">
                        <span className="modal-header2">
                            Bienvenido al Área Personal !
                        </span>

                        <button
                            id="closemyAccountJm"
                            type="button"
                            aria-label="Close"
                            className="btn-close modal-header2"
                            style={{ color: "rgb(204, 204, 204)", padding: 0 }}
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="row">
                            <div className="col-lg-4 col-xl-4 col-sm-12 mt-sm-5">
                                <div
                                    className="user-info p-4"
                                    style={{
                                        position: "relative",
                                        color: "white",
                                        fontFamily: "Roboto, Arial, sans-serif",
                                        background:
                                            "linear-gradient(2.19deg, rgb(14, 9, 207) -2.5%, rgb(141, 142, 159) 97.48%)",
                                    }}
                                >
                                    <div className="d-flex">
                                        <div style={{ width: "10%" }}>
                                            <span>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.023 15.416C7.491 17.606 9.695 19 12.16 19C14.624 19 16.829 17.607 18.296 15.416C16.6317 13.8606 14.4379 12.9968 12.16 13C9.88171 12.9966 7.68751 13.8604 6.023 15.416ZM12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8C15 7.20435 14.6839 6.44129 14.1213 5.87868C13.5587 5.31607 12.7956 5 12 5C11.2044 5 10.4413 5.31607 9.87868 5.87868C9.31607 6.44129 9 7.20435 9 8C9 8.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11Z"
                                                        fill="#EDEDED"
                                                    />
                                                </svg>
                                            </span>
                                        </div>

                                        <div
                                            className="py-1"
                                            style={{
                                                lineHeight: "3px",
                                                width: "90%",
                                                position: "relative",
                                            }}
                                        >
                                            <span className="user-name mx-3">
                                                ID: {contextData.session.user.id}
                                            </span>

                                            <br />

                                            <span className="user-name mx-3">
                                                {contextData.session.user.username}
                                            </span>

                                            <span
                                                style={{
                                                    float: "right",
                                                    position: "absolute",
                                                    right: 0,
                                                    top: 0,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => logout()}
                                            >
                                                <svg
                                                    viewBox="0 0 28 28"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                        width: "2rem",
                                                        height: "2rem",
                                                    }}
                                                >
                                                    <path
                                                        d="M20 10L24 14M24 14L20 18M24 14H11M17 6.20404C15.7252 5.43827 14.2452 5 12.6667 5C7.8802 5 4 9.02944 4 14C4 18.9706 7.8802 23 12.6667 23C14.2452 23 15.7252 22.5617 17 21.796"
                                                        stroke="white"
                                                        strokeWidth="2.4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-4">
                                        <span>Saldo:</span>
                                        <br />
                                        <span className="modal-header2">
                                            $ {parseFloat(contextData.session.user.balance).toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-xl-8 col-sm-12 mt-5">
                                <div
                                    className="user-info p-4"
                                    style={{
                                        position: "relative",
                                        color: "white",
                                        fontFamily: "Roboto, Arial, sans-serif",
                                        background:
                                            "linear-gradient(rgb(4, 6, 63) 0%, rgb(0, 18, 47) 100%)",
                                    }}
                                >
                                    {isMobile ? (
                                        <>
                                            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                                                <button
                                                    className={`p-2 login-btn btn ${mobileTab === "history" ? "active" : ""}`}
                                                    style={{
                                                        flex: 1,
                                                        color: "white",
                                                        fontFamily: "Roboto, Arial, sans-serif",
                                                        background: mobileTab === "history" 
                                                            ? "linear-gradient(113.27deg, rgb(40, 69, 180) 15.04%, rgb(57, 117, 226) 84.96%)"
                                                            : "rgb(60, 90, 180)",
                                                        border: "none",
                                                        borderRadius: "6.25rem",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => setMobileTab("history")}
                                                >
                                                    Historial del Juego
                                                </button>
                                                <button
                                                    className={`p-2 login-btn btn ${mobileTab === "transaction" ? "active" : ""}`}
                                                    style={{
                                                        flex: 1,
                                                        color: "white",
                                                        fontFamily: "Roboto, Arial, sans-serif",
                                                        background: mobileTab === "transaction" 
                                                            ? "linear-gradient(113.27deg, rgb(40, 69, 180) 15.04%, rgb(57, 117, 226) 84.96%)"
                                                            : "rgb(60, 90, 180)",
                                                        border: "none",
                                                        borderRadius: "6.25rem",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => setMobileTab("transaction")}
                                                >
                                                    Transacciones
                                                </button>
                                            </div>
                                            {mobileTab === "transaction" ? (
                                                <ProfileTransaction />
                                            ) : (
                                                <ProfileHistory />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    overflow: "hidden",
                                                    borderRadius: "6.25rem",
                                                }}
                                            >
                                                <button
                                                    className="p-2 login-btn btn"
                                                    style={{
                                                        color: "white",
                                                        fontFamily:
                                                            "Roboto, Arial, sans-serif",
                                                        background:
                                                            "linear-gradient(113.27deg, rgb(40, 69, 180) 15.04%, rgb(57, 117, 226) 84.96%)",
                                                    }}
                                                >
                                                    Cargar Movimientos
                                                </button>

                                            </div>

                                            {activeSection === "transaction" ? (
                                                <ProfileTransaction />
                                            ) : (
                                                <ProfileHistory />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;