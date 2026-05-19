import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.png";
import ImgCasino from "/src/assets/img/casino.png";
import ImgLiveCasino from "/src/assets/img/live-casino.png";
import ImgSports from "/src/assets/img/sports.png";
import ImgLiveSports from "/src/assets/img/live-sports.png";
import ImgUserIcon from "/src/assets/svg/user-icon.svg";
import ImgDarkUserIcon from "/src/assets/svg/user-icon-dark-mode.svg";
import ImgChevronDown from "/src/assets/svg/chevron-down.svg";
import ImgDarkChevronDown from "/src/assets/svg/chevron-down-dark-mode.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({ isLogin, userBalance, handleLoginClick, handleLogoutClick, isSlotsOnly, supportParent, openSupportModal }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const openMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showUserMenu]);

    const navItems = isSlotsOnly === "false" ? [
        { link: "/casino", label: "Casino", image: ImgCasino },
        { link: "/live-casino", label: "Casino En Vivo", image: ImgLiveCasino },
        { link: "/sports", label: "Deportes", image: ImgSports },
        { link: "/live-sports", label: "Deportes En Vivo", image: ImgLiveSports }
    ] : [
        { link: "/casino", label: "Casino", image: ImgCasino }
    ];

    const formatBalance = (value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <header className="ng-star-inserted">
            <app-header-top>
                <div className="headertop-wrapper">
                    <div className="headertop">
                        <app-logo-image>
                            <a
                                rel="noopener"
                                onClick={() => navigate("/")}
                                title="Pulpo Mundialito"
                                className="ng-star-inserted"
                            >
                                <app-image>
                                    <picture>
                                        <img
                                            className="image image-light logo"
                                            src={ImgLogo}
                                            alt=""
                                        />
                                        <img
                                            className="image image-dark logo"
                                            src={ImgLogo}
                                            alt=""
                                        />
                                    </picture>
                                </app-image>
                            </a>
                        </app-logo-image>

                        <div className="headertop-rightmenu">
                            {
                                isLogin ? <>
                                    <div className="headertop-auth">
                                        <div className="headertop-auth-user" ref={userMenuRef}>
                                            <div className="headertop-auth-user-content" onClick={openMenu}>
                                                <app-image
                                                    className="headertop-auth-user-icon"
                                                >
                                                    <picture>
                                                        <img
                                                            className="image image-light"
                                                            src={ImgUserIcon}
                                                            alt=""
                                                        />
                                                        <img
                                                            className="image image-dark"
                                                            src={ImgDarkUserIcon}
                                                            alt=""
                                                        />
                                                    </picture>
                                                </app-image>

                                                <div className="headertop-auth-user-name">gato1889</div>

                                                <app-image
                                                    style={{ marginTop: "6px" }}
                                                >
                                                    <picture>
                                                        <img
                                                            className="image image-light"
                                                            src={ImgChevronDown}
                                                            alt=""
                                                            style={{ width: "16px" }}
                                                        />
                                                        <img
                                                            className="image image-dark"
                                                            src={ImgDarkChevronDown}
                                                            alt=""
                                                            style={{ width: "16px" }}
                                                        />
                                                    </picture>
                                                </app-image>
                                            </div>

                                            <div className={`headertop-auth-usermenu ${showUserMenu ? 'is-open' : ''}`}>
                                                <a
                                                    className="headertop-auth-usermenu-item"
                                                    onClick={() => navigate("/profile")}
                                                >
                                                    Mi cuenta
                                                </a>

                                                <a
                                                    className="headertop-auth-usermenu-item"
                                                    onClick={() => handleLogoutClick()}
                                                >
                                                    Salir
                                                </a>
                                            </div>
                                        </div>

                                        <div className="headertop-pipe"></div>
                                        <a
                                            className="headertop-auth-balance"
                                            onClick={() => navigate("/profile")}
                                        >
                                            <span className="headertop-auth-balance-label">
                                                Saldo:
                                            </span>
                                            &nbsp;
                                            <strong>${formatBalance(userBalance)}</strong>
                                        </a>

                                        {
                                            supportParent && 
                                            <button className="button-support" onClick={() => { openSupportModal(true); }}>
                                                <img src={ImgSupport} />
                                            </button>
                                        }
                                    </div>
                                </> :
                                <div className="headertop-notauth d-flex flex-row ng-star-inserted">
                                    <app-button
                                        label="Ingresar"
                                        style={{ display: "block", width: "100%" }}
                                    >
                                        <button
                                            className="btn white btn-block btn-regular"
                                            type="button"
                                            title="Ingresar"
                                            onClick={handleLoginClick}
                                        >
                                            <span className="ng-star-inserted">Ingresar</span>
                                        </button>
                                    </app-button>
                                    <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                        <img src={ImgSupport} />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="headertop-bottom">
                        <div className="headertop-bottom-inner">
                            <div className="headertop-menu">
                                {navItems.map((item, idx) => (
                                    <a
                                        key={idx}
                                        className="headertop-menu-item ng-star-inserted"
                                        onClick={() => navigate(item.link)}
                                        style={{ "--hover-color": "rgba(5,26,69,0.58)" }}
                                    >
                                        <img
                                            aria-hidden="true"
                                            className="headertop-menu-item-img ng-star-inserted"
                                            src={item.image}
                                            alt={item.label}
                                        />
                                        <span className="headertop-menu-item-label ng-star-inserted">
                                            {item.label}
                                        </span>
                                    </a>
                                ))}
                            </div>

                            <div className="headertop-bottom-sidemenu">
                                <input
                                    type="text"
                                    placeholder="Buscar juego"
                                    className="headertop-bottom-sidemenu-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </app-header-top>
        </header>
    );
};

export default Header;