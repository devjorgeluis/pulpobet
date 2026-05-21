import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import SearchInput from "../SearchInput";

import ImgSearch from "/src/assets/svg/search-icon-mobile-dark-mode.svg";
import ImgCasino from "/src/assets/img/mobile-casino.png";
import ImgUser from "/src/assets/svg/user-icon-dark-mode.svg";

const MobileFooter = ({ isLogin, isMobile, isSlotsOnly, handleLoginClick, handleLogoutClick, supportParent, openSupportModal }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarRequestedMenu, setSidebarRequestedMenu] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add("has-menu-open");
        } else {
            document.body.classList.remove("has-menu-open");
        }

        return () => document.body.classList.remove("has-menu-open");
    }, [isSidebarOpen]);

    useEffect(() => {
        if (isUserMenuOpen) {
            document.body.classList.add("has-user-menu-open");
        } else {
            document.body.classList.remove("has-user-menu-open");
        }

        return () => document.body.classList.remove("has-user-menu-open");
    }, [isUserMenuOpen]);

    return (
        <>
            <SearchInput isMobile={isMobile} />

            <app-header-bottom>
                <div className="headerbottom logged-in">
                    <a
                        className="headerbottom-btnicon"
                        onClick={() => {
                            setSidebarRequestedMenu(null);
                            setIsUserMenuOpen(false);
                            setIsSidebarOpen((prev) => !prev);
                        }}
                    >
                        <span className="headerbottom-menubar"></span>
                        <span className="headerbottom-menubar"></span>
                        <span className="headerbottom-menubar"></span>
                    </a>

                    <a
                        className="headerbottom-btnicon"
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setIsUserMenuOpen(false);
                            document.body.classList.toggle("has-search-open");
                        }}
                    >
                        <picture>
                            <img
                                className="image image-dark"
                                src={ImgSearch}
                                alt="Buscar"
                            />
                        </picture>
                    </a>

                    {
                        isLogin ? <>
                            <a
                                className="headerbottom-btnicon"
                                onClick={() => {
                                    setSidebarRequestedMenu("Slots");
                                    setIsUserMenuOpen(false);
                                    setIsSidebarOpen(true);
                                }}
                            >
                                <img
                                    src={ImgCasino}
                                    alt="Slots"
                                    style={{
                                        width: "35px",
                                        paddingLeft: "5px",
                                    }}
                                />
                            </a>

                            <a
                                className="headerbottom-btnicon"
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    setIsUserMenuOpen(true);
                                }}
                            >
                                <picture>
                                    <img
                                        className="image image-dark"
                                        src={ImgUser}
                                        alt="Usuario"
                                    />
                                </picture>
                            </a>
                        </> : <div className="headerbottom-actions d-flex flex-row">
                            <app-button
                                label="INGRESAR"
                                className="me-2 login-button"
                                style={{ display: "block", width: "100%" }}
                                onClick={() => handleLoginClick()}
                            >
                                <button
                                    className="btn white btn-block btn-regular"
                                    type="button"
                                    title="INGRESAR"
                                >
                                    <span>INGRESAR</span>
                                </button>
                            </app-button>
                        </div>
                    }
                </div>
            </app-header-bottom>

            <Sidebar
                isSlotsOnly={isSlotsOnly}
                requestedMenuName={sidebarRequestedMenu}
                onClose={() => setIsSidebarOpen(false)}
            />

            <UserMenu
                isOpen={isUserMenuOpen}
                handleLogoutClick={handleLogoutClick}
                supportParent={supportParent}
                openSupportModal={openSupportModal}
                onCloseMenu={() => setIsUserMenuOpen(false)}
            />
        </>
    )
};

export default MobileFooter;
