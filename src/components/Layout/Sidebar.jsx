import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import { LayoutContext } from "./LayoutContext";
import { getHeaderTags } from "./Header";

import ImgLogo from "/src/assets/img/logo.png";
import ImgCasino from "/src/assets/img/casino.png";
import ImgLiveCasino from "/src/assets/img/live-casino.png";
import ImgSports from "/src/assets/img/sports.png";
import ImgProvider from "/src/assets/img/provider.png";
import ImgPhone from "/src/assets/svg/phone.svg";

const Sidebar = ({ isSlotsOnly, isLogin, isOpen, onClose, requestedMenuName, supportParent, openSupportModal }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenuName, setOpenMenuName] = useState(null);
    const [isLoadingLiveCasinoCategories, setIsLoadingLiveCasinoCategories] = useState(false);
    const [isLoadingCasinoCategories, setIsLoadingCasinoCategories] = useState(false);
    const [casinoMainCategories, setCasinoMainCategories] = useState([]);
    const liveCasinoCategoriesRequestedRef = useRef(false);
    const casinoCategoriesRequestedRef = useRef(false);
    const { contextData } = useContext(AppContext);
    const { liveCasinoCategories, setLiveCasinoCategories } = useContext(LayoutContext);

    const toggleMenu = (menuName) => {
        setOpenMenuName((prev) => (prev === menuName ? null : menuName));
    };

    const slotsTags = useMemo(() => getHeaderTags(isSlotsOnly), [isSlotsOnly]);
    const isSlotsAllowed = isSlotsOnly === false || isSlotsOnly === "false";
    const isProvidersNavVisible = location.pathname === "/casino" && isSlotsAllowed;

    useEffect(() => {
        if (!requestedMenuName) return;
        setOpenMenuName(requestedMenuName);
    }, [requestedMenuName]);

    useEffect(() => {
        if (!isOpen) return;
        if (!isProvidersNavVisible) return;
        if (casinoMainCategories.length > 0) return;
        if (isLoadingCasinoCategories) return;
        if (casinoCategoriesRequestedRef.current) return;

        casinoCategoriesRequestedRef.current = true;
        setIsLoadingCasinoCategories(true);
        callApi(
            contextData,
            "GET",
            "/get-page?page=casino",
            (result) => {
                setIsLoadingCasinoCategories(false);
                if (result && result.data && result.data.categories) {
                    setCasinoMainCategories(result.data.categories);
                } else {
                    setCasinoMainCategories([]);
                }
            },
            null,
        );
    }, [contextData, isProvidersNavVisible, casinoMainCategories.length, isLoadingCasinoCategories]);

    useEffect(() => {
        if (!isOpen) return;
        if (liveCasinoCategories.length > 0) return;
        if (isLoadingLiveCasinoCategories) return;
        if (liveCasinoCategoriesRequestedRef.current) return;

        liveCasinoCategoriesRequestedRef.current = true;
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
    }, [contextData, liveCasinoCategories.length, isLoadingLiveCasinoCategories, setLiveCasinoCategories]);

    const getLiveCasinoHref = (item) => {
        const code = item?.code || item?.table_name || item?.id || item?.name;
        return `/live-casino#${code}`;
    };

    const getCasinoHash = (item) => item?.code || item?.table_name || item?.id || item?.name;
    const activeHash = (location.hash || "").replace("#", "");

    if (!isOpen) return null;

    return (
        <>
            <app-header-mobile-menu>
                <div className="header-mobilemenu">
                    <div className="header-mobilemenu-top">
                        <div className="header-mobilemenu-top-closebtn" onClick={onClose}></div>

                        <app-logo-image>
                            <a
                                rel="noopener"
                                title="World Cup Octopus"
                                onClick={() => {
                                    navigate("/");
                                    onClose();
                                }}
                            >
                                <app-image>
                                    <picture>
                                        <img
                                            className="image image-dark"
                                            src={ImgLogo}
                                            alt="World Cup Octopus Logo"
                                            style={{ height: "48px", width: "162px" }}
                                        />
                                    </picture>
                                </app-image>
                            </a>
                        </app-logo-image>
                    </div>

                    <nav
                        className="header-mobilemenu-menu"
                        onClick={(e) => {
                            if (e.target.closest("a")) onClose?.();
                        }}
                    >
                        <div
                            className="header-mobilemenu-menu-item"
                            data-submenu-name="Contact"
                            onClick={() => {
                                navigate("/");
                                onClose();
                            }}
                        >
                            <span className="header-mobilemenu-menu-item-title">
                                <span className="header-mobilemenu-menu-item-text">
                                    Home
                                </span>
                            </span>
                        </div>

                        <div
                            className={`header-mobilemenu-menu-item${openMenuName === "Slots" ? " is-open" : ""}`}
                            data-submenu-name="Slots"
                            style={{ backgroundColor: "rgba(5, 26, 69, 0.58)" }}
                        >
                            <span
                                className="header-mobilemenu-menu-item-title"
                                onClick={() => toggleMenu("Slots")}
                            >
                                <span className="header-mobilemenu-menu-item-icon-wrapper">
                                    <img
                                        className="header-mobilemenu-menu-item-icon"
                                        src={ImgCasino}
                                        alt="Casino"
                                    />
                                </span>
                                <span className="header-mobilemenu-menu-item-text">
                                    Casino
                                </span>
                            </span>

                            <ul
                                className="header-mobilemenu-menu-list"
                                style={{ backgroundColor: "rgba(5, 26, 69, 0.58)" }}
                            >
                                {slotsTags.map((tag) => (
                                    <li
                                        key={tag.code}
                                        className={`header-mobilemenu-menu-list-item${location.pathname === "/casino" && activeHash === tag.code ? " active" : ""}`}
                                    >
                                        <a
                                            className="header-mobilemenu-menu-list-link"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/casino#${tag.code}`);
                                                onClose?.();
                                            }}
                                        >
                                            {tag.image && (
                                                <span className="header-mobilemenu-sub-icon-wrapper">
                                                    <img
                                                        className="header-mobilemenu-sub-icon"
                                                        src={tag.image}
                                                        alt={tag.name}
                                                    />
                                                </span>
                                            )}

                                            <span className="header-mobilemenu-sub-text">
                                                {tag.name}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {isProvidersNavVisible && (
                            <div
                                className={`header-mobilemenu-menu-item${openMenuName === "Providers" ? " is-open" : ""}`}
                                data-submenu-name="Providers"
                                style={{ backgroundColor: "rgba(5, 26, 69, 0.58)" }}
                            >
                                <span
                                    className="header-mobilemenu-menu-item-title"
                                    onClick={() => toggleMenu("Providers")}
                                >
                                    <span className="header-mobilemenu-menu-item-icon-wrapper">
                                        <img
                                            className="header-mobilemenu-menu-item-icon"
                                            src={ImgProvider}
                                            alt="Proveedores"
                                        />
                                    </span>
                                    <span className="header-mobilemenu-menu-item-text">
                                        Proveedores
                                    </span>
                                </span>

                                <ul
                                    className="header-mobilemenu-menu-list"
                                    style={{ backgroundColor: "rgba(5, 26, 69, 0.58)" }}
                                >
                                    {casinoMainCategories.map((item) => {
                                        const hash = getCasinoHash(item);
                                        return (
                                            <li
                                                key={hash}
                                                className={`header-mobilemenu-menu-list-item${location.pathname === "/casino" && activeHash === String(hash) ? " active" : ""}`}
                                            >
                                                <a
                                                    className="header-mobilemenu-menu-list-link"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(`/casino#${hash}`, { state: { provider: item } });
                                                        onClose?.();
                                                    }}
                                                >
                                                    {(item.image_local || item.image || item.image_url) && (
                                                        <span className="header-mobilemenu-sub-icon-wrapper">
                                                            <img
                                                                className="header-mobilemenu-sub-icon"
                                                                src={
                                                                    item.image_local
                                                                        ? contextData.cdnUrl + item.image_local
                                                                        : item.image || item.image_url
                                                                }
                                                                alt={item.name}
                                                            />
                                                        </span>
                                                    )}
                                                    <span className="header-mobilemenu-sub-text">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {
                            isSlotsOnly === "false" &&
                            <>

                                <div
                                    className={`header-mobilemenu-menu-item${openMenuName === "Live Casino" ? " is-open" : ""}`}
                                    data-submenu-name="Live Casino"
                                    style={{ backgroundColor: "rgba(20, 88, 130, 0.55)" }}
                                >
                                    <span
                                        className="header-mobilemenu-menu-item-title"
                                        onClick={() => toggleMenu("Live Casino")}
                                    >
                                        <span className="header-mobilemenu-menu-item-icon-wrapper">
                                            <img
                                                className="header-mobilemenu-menu-item-icon"
                                                src={ImgLiveCasino}
                                                alt="Casino en vivo"
                                            />
                                        </span>
                                        <span className="header-mobilemenu-menu-item-text">
                                            Casino En Vivo
                                        </span>
                                    </span>

                                    <ul
                                        className="header-mobilemenu-menu-list"
                                        style={{ backgroundColor: "rgba(20, 88, 130, 0.55)" }}
                                    >
                                        {liveCasinoCategories.map((item) => (
                                            <li
                                                key={item.code || item.table_name || item.id || item.name}
                                                className={`header-mobilemenu-menu-list-item${location.pathname === "/live-casino" && activeHash === getCasinoHash(item) ? " active" : ""}`}
                                            >
                                                <a
                                                    className="header-mobilemenu-menu-list-link"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(getLiveCasinoHref(item), { state: { liveCasinoCategory: item } });
                                                        onClose?.();
                                                    }}
                                                >
                                                    {
                                                        item.image_local &&
                                                        <span className="header-mobilemenu-sub-icon-wrapper">
                                                            <img
                                                                className="header-mobilemenu-sub-icon"
                                                                src={item.image_local !== null ? contextData.cdnUrl + item.image_local : item.image_url}
                                                                alt={item.name}
                                                            />
                                                        </span>
                                                    }
                                                    <span className="header-mobilemenu-sub-text">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    className={`header-mobilemenu-menu-item${openMenuName === "Sports" ? " is-open" : ""}`}
                                    data-submenu-name="Sports"
                                    style={{ backgroundColor: "rgba(14, 54, 3, 0.47)" }}
                                >
                                    <span
                                        className="header-mobilemenu-menu-item-title"
                                        onClick={() => toggleMenu("Sports")}
                                    >
                                        <span className="header-mobilemenu-menu-item-icon-wrapper">
                                            <img
                                                className="header-mobilemenu-menu-item-icon"
                                                src={ImgSports}
                                                alt="Sports"
                                            />
                                        </span>

                                        <span className="header-mobilemenu-menu-item-text">
                                            Deportes
                                        </span>
                                    </span>

                                    <ul
                                        className="header-mobilemenu-menu-list"
                                        style={{ backgroundColor: "rgba(14, 54, 3, 0.47)" }}
                                    >
                                        <li className="header-mobilemenu-menu-list-item">
                                            <a
                                                className="header-mobilemenu-menu-list-link"
                                                onClick={() => navigate("/sports")}
                                            >
                                                <span className="header-mobilemenu-sub-text">
                                                    Lobby
                                                </span>
                                            </a>
                                        </li>

                                        <li className="header-mobilemenu-menu-list-item">
                                            <a
                                                className="header-mobilemenu-menu-list-link"
                                                onClick={() => navigate("/live-sports")}
                                            >
                                                <span className="header-mobilemenu-sub-text">
                                                    En Vivo
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        }
                        {
                            isLogin && supportParent && <div
                                className="header-mobilemenu-menu-item"
                                data-submenu-name="Contact"
                                style={{ backgroundColor: "rgba(89, 4, 97, 0.51)" }}
                                onClick={() => openSupportModal(true)}
                            >
                                <span className="header-mobilemenu-menu-item-title">
                                    <span className="header-mobilemenu-menu-item-icon-wrapper">
                                        <img
                                            aria-hidden="true"
                                            className="header-mobilemenu-menu-item-icon"
                                            src={ImgPhone}
                                            alt="contact"
                                        />
                                    </span>

                                    <span className="header-mobilemenu-menu-item-text">
                                        Contactá a Tu Cajero
                                    </span>
                                </span>
                            </div>
                        }
                    </nav>
                </div>
            </app-header-mobile-menu>
        </>
    );
};

export default Sidebar;
