import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";

import ImgLogo from "/src/assets/img/logo.png";
import IconEye from "/src/assets/svg/eye.svg";
import IconEyeSlash from "/src/assets/svg/eye-off.svg";

const UserMenu = ({ isOpen, toggleRef, handleLogoutClick, onCloseMenu }) => {
    const { contextData } = useContext(AppContext);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);

    const username = useMemo(() => {
        return contextData?.session?.user?.username || "";
    }, [contextData?.session?.user?.username]);

    const balance = useMemo(() => {
        return contextData?.session?.user?.balance;
    }, [contextData?.session?.user?.balance]);

    const formattedBalance = useMemo(() => {
        const num = parseFloat(balance) || 0;
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [balance]);

    useEffect(() => {
        if (isOpen) setIsBalanceVisible(false);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event) => {
            if (toggleRef?.current && toggleRef.current.contains(event.target)) return;
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onCloseMenu?.();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, onCloseMenu]);

    return (
        <div className="header-mobile-usermenu" ref={menuRef}>
            <div className="header-mobile-usermenu-top">
                <div className="header-mobile-usermenu-top-closebtn" onClick={() => onCloseMenu?.()}></div>

                <app-logo-image>
                    <a
                        rel="noopener"
                        title="Pulpo Mundialito"
                        onClick={() => navigate("/")}
                    >
                        <app-image>
                            <picture>
                                <img
                                    className="image image-dark"
                                    src={ImgLogo}
                                    alt=""
                                    style={{ height: "48px", width: "162px" }}
                                />
                            </picture>
                        </app-image>
                    </a>
                </app-logo-image>
            </div>

            <nav className="header-mobile-usermenu-menu">
                <div className="header-display-flex">
                    <h3>
                        <span>Hola</span>&nbsp;{username ? `, ${username}` : ""}
                    </h3>

                    <a
                        className="headertop-auth-usermenu-item"
                        onClick={() => handleLogoutClick()}
                    >
                        Salir
                    </a>
                </div>

                <div className="header-mobilemenu-user-container">
                    <div className="header-mobilemenu-balance-section">
                        <span className="header-mobilemenu-balance-label">
                            Saldo
                        </span>

                        <div className="header-mobilemenu-balance-container">
                            <span className="header-mobilemenu-balance-value">
                                {isBalanceVisible ? `$${formattedBalance}` : "$*****"}
                            </span>

                            <app-image
                                onClick={() => setIsBalanceVisible((prev) => !prev)}
                            >
                                <picture>
                                    <img
                                        className="image image-dark"
                                        src={isBalanceVisible ? IconEyeSlash : IconEye}
                                        alt={isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
                                    />
                                </picture>
                            </app-image>
                        </div>
                    </div>
                </div>

                <div className="header-mobile-usermenu-options-section">
                    <a
                        className="headertop-auth-usermenu-item"
                        onClick={(e) => {
                            e.preventDefault();
                            onCloseMenu?.();
                            navigate("/profile")
                        }}
                    >
                        Mi cuenta
                    </a>

                    <a
                        className="headertop-auth-usermenu-item"
                        onClick={(e) => {
                            e.preventDefault();
                            onCloseMenu?.();
                            navigate("/profile-transaction")
                        }}
                    >
                        Transacciones
                    </a>

                    <a
                        className="headertop-auth-usermenu-item"
                        onClick={(e) => {
                            e.preventDefault();
                            onCloseMenu?.();
                            navigate("/profile-history")
                        }}
                    >
                        Historial de cuenta
                    </a>
                </div>
            </nav>
        </div>
    );
};

export default UserMenu;
