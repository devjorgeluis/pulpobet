import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.webp";
import ImgBet from "/src/assets/img/bet-responsibility.png";
import IconHamburger from "/src/assets/svg/hamburger.svg";
import IconProfile from "/src/assets/svg/profile.svg";
import IconCasino from "/src/assets/svg/casino.svg";
import IconLiveCasino from "/src/assets/svg/live-casino.svg";
import IconDeporte from "/src/assets/svg/deporte.svg";
import IconLive from "/src/assets/svg/live.svg";
import IconSupport from "/src/assets/svg/support.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const MobileHeader = ({ isLogin, userBalance, isOpen, handleLoginClick, onToggle, isSlotsOnly, supportParent, openSupportModal, openProfileModal }) => {
    const navigate = useNavigate();
    const [showLanguage, setShowLanguage] = useState(false);
    
    const toggleLanguageMenu = () => {
        setShowLanguage((prevShowLanguage) => !prevShowLanguage);
    };

    return (
        <>
            <header className="header-mobile">
                <div className="header-mobile__container">
                    <span className="SVGInline header-mobile__burger" onClick={onToggle}>
                        <i className="fas fa-bars"></i>
                    </span>
                    <a className="header-mobile__home-link" onClick={() => {isOpen && onToggle(), navigate("/")}}>
                        <div className="header-mobile__logo">
                            <img className="logo-domain" src={ImgLogo} alt="logo" loading="lazy" />
                        </div>
                    </a>
                </div>
                {
                    isLogin ? (
                        <a className="header-mobile__info">
                            <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                <img src={ImgSupport} />
                            </button>
                            <div className="header-card-mobile">
                                <div className="header-card-mobile__content">
                                    <div className="header-mobile__balance">
                                        <span className="header-mobile__amount">${userBalance}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="header-card-mobile" onClick={() => { isOpen && onToggle(); openProfileModal?.("history"); }}>
                                <div className="header-card-mobile__content">
                                    <span className="SVGInline header-mobile__user">
                                        <img src={IconProfile} className="SVGInline-svg header-mobile__user-svg" />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ) : (
                        <a className="header-mobile__button">
                            <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                <img src={ImgSupport} />
                            </button>
                            <div className="button-mobile button-mobile_color_default" onClick={() => {isOpen && onToggle(), handleLoginClick()}}>
                                <span className="header-mobile__button-text">Ingresar</span>
                            </div>
                        </a>
                    )
                }
            </header>
            <div className={`slide-out ${isOpen ? "slide-out_open" : ""}`}>
                <div className="slide-out__menu-wrapper">
                    <div className="slide-out__menu">
                        <section className="side-menu-mobile">
                            <nav className="side-menu-mobile__navigation">
                                <div className="links-menu-side-menu">
                                    {
                                        isSlotsOnly === "false" && <>
                                            <div className="links-menu-side-menu__header">
                                                <h2 className="links-menu-side-menu__title">Deportes</h2>
                                            </div>
                                            <div className="links-menu-side-menu__items">
                                                <a className="links-menu-side-menu__item" onClick={() => {onToggle(), navigate("/sports")}}>
                                                    <span className="SVGInline links-menu-side-menu__item-icon">
                                                        <img src={IconDeporte} className="SVGInline-svg links-menu-side-menu__item-icon-svg" />
                                                    </span>
                                                    <span className="links-menu-side-menu__item-label">Deportes</span>
                                                </a>
                                            </div>
                                            <div className="links-menu-side-menu__items">
                                                <a className="links-menu-side-menu__item" onClick={() => {onToggle(), navigate("/live-sports")}}>
                                                    <span className="SVGInline links-menu-side-menu__item-icon">
                                                        <img src={IconLive} className="SVGInline-svg links-menu-side-menu__item-icon-svg" />
                                                    </span>
                                                    <span className="links-menu-side-menu__item-label">En vivo</span>
                                                </a>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="links-menu-side-menu">
                                    {
                                        isSlotsOnly === "false" && <div className="links-menu-side-menu__header">
                                            <h2 className="links-menu-side-menu__title">Juegos</h2>
                                        </div>
                                    }
                                    <div className="links-menu-side-menu__items">
                                        <a className="links-menu-side-menu__item" onClick={() => {onToggle(), navigate("/casino")}}>
                                            <span className="SVGInline links-menu-side-menu__item-icon">
                                                <img src={IconCasino} className="SVGInline-svg links-menu-side-menu__item-icon-svg" />
                                            </span>
                                            <span className="links-menu-side-menu__item-label">Casino</span>
                                        </a>
                                    </div>
                                    {
                                        isSlotsOnly === "false" && <div className="links-menu-side-menu__items">
                                            <a className="links-menu-side-menu__item" onClick={() => {onToggle(), navigate("/live-casino")}}>
                                                <span className="SVGInline links-menu-side-menu__item-icon">
                                                    <img src={IconLiveCasino} className="SVGInline-svg links-menu-side-menu__item-icon-svg" />
                                                </span>
                                                <span className="links-menu-side-menu__item-label">Casino En Vivo</span>
                                            </a>
                                        </div>
                                    }
                                </div>
                                {
                                    supportParent &&
                                    <>
                                        <div className="links-menu-side-menu__header">
                                            <h2 className="links-menu-side-menu__title">Otro</h2>
                                        </div>
                                        <div className="side-menu-mobile__support" onClick={() => {openSupportModal(true); onToggle();}}>
                                            <button type="button" className="button-mobile button-mobile_color_default button-mobile_borderRadius_500">
                                                <div className="side-menu-mobile__support-content">
                                                    <span className="SVGInline links-menu-side-menu__item-icon">
                                                        <img src={IconSupport} className="SVGInline-svg links-menu-side-menu__item-icon-svg" />
                                                    </span>
                                                    <span className="side-menu-mobile__support-title">Soporte 24/7</span>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                }
                            </nav>
                        </section>
                    </div>
                </div>
                <div className="slide-out__content">
                    <div className="app__scroll-block">
                        <article className="digitain-sport-mobile">
                            <div id="application-container"></div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileHeader;