import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../UserMenu";
import NavLinkHeader from "../NavLinkHeader";
import ImgLogo from "/src/assets/img/logo.png";
import ImgCasino from "/src/assets/img/casino.png";
import ImgLiveCasino from "/src/assets/img/live-casino.png";
import ImgSports from "/src/assets/img/sports.png";
import ImgLiveSports from "/src/assets/img/live-sports.png";
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
        { link: "/casino", label: "Casino", image: ImgCasino },
        { link: "/live-casino", label: "Casino En Vivo", image: ImgLiveCasino },
        { link: "/sports", label: "Deportes", image: ImgSports },
        { link: "/live-sports", label: "Deportes En Vivo", image: ImgLiveSports }
    ] : [
        { link: "/casino", label: "Casino", image: ImgCasino }
    ];

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
                                            className="image image-light"
                                            src={ImgLogo}
                                            alt=""
                                            style={{ height: "53px", width: "179px" }}
                                        />
                                        <img
                                            className="image image-dark"
                                            src={ImgLogo}
                                            alt=""
                                            style={{ height: "53px", width: "179px" }}
                                        />
                                    </picture>
                                </app-image>
                            </a>
                        </app-logo-image>

                        <div className="headertop-rightmenu">
                            {
                                isLogin ? <>
                                    <div className="headertop-auth">
                                        <div className="headertop-auth-user">
                                            <div className="headertop-auth-user-content">
                                                <app-image
                                                    darksrc="assets/images/header/header-top/user-icon-dark-mode.svg"
                                                    lightsrc="assets/images/header/header-top/user-icon.svg"
                                                    className="headertop-auth-user-icon"
                                                >
                                                    <picture>
                                                        <img
                                                            className="image image-light"
                                                            src="assets/images/header/header-top/user-icon.svg"
                                                            alt=""
                                                        />
                                                        <img
                                                            className="image image-dark"
                                                            src="assets/images/header/header-top/user-icon-dark-mode.svg"
                                                            alt=""
                                                        />
                                                    </picture>
                                                </app-image>

                                                <div className="headertop-auth-user-name">gato1889</div>

                                                <app-image
                                                    darksrc="assets/images/header/header-top/chevron-down-dark-mode.svg"
                                                    lightsrc="assets/images/header/header-top/chevron-down.svg"
                                                    style={{ marginTop: "6px" }}
                                                >
                                                    <picture>
                                                        <img
                                                            className="image image-light"
                                                            src="assets/images/header/header-top/chevron-down.svg"
                                                            alt=""
                                                            style={{ marginTop: "6px" }}
                                                        />
                                                        <img
                                                            className="image image-dark"
                                                            src="assets/images/header/header-top/chevron-down-dark-mode.svg"
                                                            alt=""
                                                            style={{ marginTop: "6px" }}
                                                        />
                                                    </picture>
                                                </app-image>
                                            </div>

                                            <div className="headertop-auth-usermenu">
                                                <a
                                                    routerLink="/my-account"
                                                    className="headertop-auth-usermenu-item"
                                                    href="/es/my-account"
                                                >
                                                    Mi cuenta
                                                </a>

                                                <a className="headertop-auth-usermenu-item">
                                                    Salir
                                                </a>
                                            </div>
                                        </div>

                                        <div className="headertop-pipe"></div>

                                        <app-max-bet-limits className="dark ng-star-inserted">
                                            <div className="totalbonus ng-star-inserted">
                                                <div
                                                    className="totalbonus-content"
                                                    style={{ height: "40px" }}
                                                >
                                                    <div className="totalbonus-maintext is-shown">
                                                        <span className="totalbonus-maintext-label">
                                                            Límites por apuesta
                                                        </span>
                                                        &nbsp;
                                                    </div>

                                                    <ul className="totalbonus-list">
                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Casino:&nbsp; ARS$ 500.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Bingo:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Deportes:&nbsp; ARS$ 500.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Slots:&nbsp; ARS$ 25.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Desconocido:&nbsp; ARS$ 500.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Poker:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Video Bingo:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Mini Slots:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Lotto:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Raspaditas:&nbsp; ARS$ 100.000,00
                                                        </li>

                                                        <li className="totalbonus-list-item ng-star-inserted">
                                                            Caballos:&nbsp; ARS$ 500.000,00
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </app-max-bet-limits>

                                        <a
                                            routerLink="/my-account"
                                            className="headertop-auth-balance"
                                            href="/es/my-account"
                                        >
                                            <span className="headertop-auth-balance-label">
                                                Saldo:
                                            </span>
                                            &nbsp;
                                            <strong>$*****</strong>
                                        </a>
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