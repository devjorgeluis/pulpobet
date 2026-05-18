import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../UserMenu";
import NavLinkHeader from "../NavLinkHeader";
import ImgLogo from "/src/assets/img/logo.webp";
import IconCurrency from "/src/assets/svg/currency.svg";
import IconProfile from "/src/assets/svg/profile.svg";
import IconLogout from "/src/assets/svg/logout.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({ isLogin, userBalance, handleLoginClick, handleLogoutClick, isSlotsOnly, supportParent, openSupportModal, openProfileModal }) => {
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
        { path: ["/", "/home"], label: "Inicio" },
        { path: ["/casino"], label: "Casino" },
        { path: ["/live-casino"], label: "Casino En Vivo" },
        { path: ["/sports"], label: "Deportes" },
        { path: ["/live-sports"], label: "Deportes En Vivo" }
    ] : [
        { path: ["/", "/home"], label: "Inicio" },
        { path: ["/casino"], label: "Casino" }
    ];

    return (
        <header className="header-desktop">
            <div className="header-desktop__content py-3">
                <div className="header-desktop__header-menu">
                    <a className="header-desktop__logo-container" onClick={() => navigate("/")}>
                        <div className="header-desktop__logo">
                            <img
                                title="Casino"
                                alt="Casino"
                                src={ImgLogo}
                                className="logo-domain"
                            />
                        </div>
                    </a>
                    <nav className="header-main-menu-desktop">
                        {navItems.map((item, idx) => (
                            <NavLinkHeader
                                key={item.path[0] || idx}
                                title={item.label}
                                pageCode={item.path[0].replace("/", "") || "home"}
                                icon=""
                            />
                        ))}
                    </nav>
                </div>
                <div className="header-desktop__right">
                    <div className="user-block" ref={userMenuRef}>
                        {isLogin ? (
                            <div className="user-block__top">
                                <div className="user-block__info">
                                    <span className="user-block__info-icon">
                                        <span className="SVGInline SVG-component__content">
                                            <img src={IconCurrency} />
                                        </span>
                                    </span>
                                    <span className="user-block__text">$ {userBalance}</span>
                                </div>
                                <div className="user-block__user-wrapper" onClick={openMenu}>
                                    <span className="user-block__user-icon">
                                        <span className="SVGInline SVG-component__content">
                                            <img src={IconProfile} />
                                        </span>
                                    </span>
                                </div>
                                <div className="user-block__user-wrapper" onClick={handleLogoutClick}>
                                    <span className="user-block__user-icon">
                                        <span className="SVGInline SVG-component__content">
                                            <img src={IconLogout} alt="Logout icon" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="header-login-block-desktop">
                                <div className="header-login-block-desktop__button">
                                    <button
                                        type="button"
                                        className="button-desktop button-desktop_color_default"
                                        onClick={handleLoginClick}
                                    >
                                        <span className="header-login-block-desktop__button-text">Ingresar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {showUserMenu && <UserMenu handleLogoutClick={handleLogoutClick} supportParent={supportParent} openSupportModal={openSupportModal} openProfileModal={openProfileModal} onCloseMenu={() => setShowUserMenu(false)} />}
                    </div>

                    <div className="header-desktop__separator"></div>

                    <button className="button-support" onClick={() => { openSupportModal(false); }}>
                        <img src={ImgSupport} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;