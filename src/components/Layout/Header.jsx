import { useState, useRef, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
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
import ImgTodo from "/src/assets/img/todo.png";
import ImgHot from "/src/assets/img/hot.png";
import ImgJoker from "/src/assets/img/joker.png";
import ImgCrash from "/src/assets/img/crash.png";
import ImgMegaway from "/src/assets/img/megaway.png";
import ImgRuleta from "/src/assets/img/ruleta.png";

export const getHeaderTags = (isSlotsOnly) => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    return isSlotsOnlyFalse
        ? [
            { name: "Lobby", code: "home", image: ImgTodo },
            { name: "Hot", code: "hot", image: ImgHot },
            { name: "Jokers", code: "joker", image: ImgJoker },
            { name: "Ruletas", code: "roulette", image: ImgRuleta },
            { name: "Crash", code: "arcade", image: ImgCrash },
            { name: "Megaways", code: "megaways", image: ImgMegaway },
        ]
        : [
            { name: "Lobby", code: "home", image: ImgTodo },
            { name: "Hot", code: "hot", image: ImgHot },
            { name: "Jokers", code: "joker", image: ImgJoker },
            { name: "Megaways", code: "megaways", image: ImgMegaway },
        ];
};

const Header = ({ isLogin, userBalance, handleLoginClick, handleLogoutClick, isSlotsOnly, supportParent, openSupportModal }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [activeSubmenuLink, setActiveSubmenuLink] = useState(null);
    const [isLoadingLiveCasinoCategories, setIsLoadingLiveCasinoCategories] = useState(false);
    const userMenuRef = useRef(null);
    const { contextData } = useContext(AppContext);
    const { liveCasinoCategories, setLiveCasinoCategories } = useContext(LayoutContext);

    const openMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const tags = useMemo(() => getHeaderTags(isSlotsOnly), [isSlotsOnly]);
    const submenuItems = activeSubmenuLink === "/live-casino" ? liveCasinoCategories : tags;
    const isLiveCasinoSubmenu = activeSubmenuLink === "/live-casino";

    const handleNavHover = (link) => {
        if (link === "/casino" || link === "/live-casino") {
            setActiveSubmenuLink(link);
        } else {
            setActiveSubmenuLink(null);
        }
    };

    const clearSubmenu = () => setActiveSubmenuLink(null);

    const getSubmenuHref = (item) => {
        return isLiveCasinoSubmenu
            ? `/live-casino#${item.table_name || item.id || item.name}`
            : `/casino#${item.code}`;
    };

    const getSubmenuKey = (item) => item.code || item.id || item.table_name || item.name;

    useEffect(() => {
        if (liveCasinoCategories.length === 0 && !isLoadingLiveCasinoCategories) {
            setIsLoadingLiveCasinoCategories(true);
            callApi(
                contextData,
                "GET",
                "/get-page?page=livecasino",
                (result) => {
                    setIsLoadingLiveCasinoCategories(false);
                    if (result && result.data && result.data.categories) {
                        setLiveCasinoCategories(result.data.categories);
                    }
                },
                null,
            );
        }
    }, [liveCasinoCategories.length, contextData, setLiveCasinoCategories, isLoadingLiveCasinoCategories]);

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
                                    <div className="headertop-notauth d-flex flex-row">
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

                    <div className="headertop-bottom-hover-group" onMouseLeave={clearSubmenu}>
                        <div className="headertop-bottom">
                            <div className="headertop-bottom-inner">
                                <div className="headertop-menu">
                                    {navItems.map((item, idx) => (
                                        <a
                                            key={idx}
                                            className="headertop-menu-item"
                                            onMouseEnter={() => handleNavHover(item.link)}
                                            onClick={() => navigate(item.link)}
                                            style={{ "--hover-color": "rgba(5,26,69,0.58)" }}
                                        >
                                            <img
                                                aria-hidden="true"
                                                className="headertop-menu-item-img"
                                                src={item.image}
                                                alt={item.label}
                                            />
                                            <span className="headertop-menu-item-label">
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
                        {activeSubmenuLink !== null && (
                            <div
                                className="headertop-submenu-wrapper"
                                style={{ backgroundColor: "rgba(5, 26, 69, 0.58)" }}
                            >
                            <div className="headertop-submenu">
                                {submenuItems.map((item) => (
                                    <a
                                        key={getSubmenuKey(item)}
                                        className="headertop-submenu-item"
                                        href={getSubmenuHref(item)}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            navigate(getSubmenuHref(item));
                                        }}
                                    >
                                        {(item.image_local || item.image || item.image_url) && (
                                            <img
                                                aria-hidden="true"
                                                className="headertop-submenu-item-img"
                                                src={
                                                    item.image_local
                                                        ? contextData.cdnUrl + item.image_local
                                                        : item.image || item.image_url
                                                }
                                                alt={item.name}
                                            />
                                        )}
                                        <span className="headertop-submenu-item-label">
                                            {item.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </app-header-top>
        </header>
    );
};

export default Header;