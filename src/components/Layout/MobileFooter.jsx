import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchInput from "../SearchInput";

import ImgSearch from "/src/assets/svg/search-icon-mobile-dark-mode.svg";
import ImgCasino from "/src/assets/img/mobile-casino.png";
import ImgUser from "/src/assets/svg/user-icon-dark-mode.svg";

const MobileFooter = ({ isLogin, isSlotsOnly, handleLoginClick }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarRequestedMenu, setSidebarRequestedMenu] = useState(null);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add("has-menu-open");
        } else {
            document.body.classList.remove("has-menu-open");
        }

        return () => document.body.classList.remove("has-menu-open");
    }, [isSidebarOpen]);

    return (
        <>
            <SearchInput />

            <app-header-bottom>
                <div className="headerbottom logged-in">
                    <a
                        className="headerbottom-btnicon"
                        onClick={() => {
                            setSidebarRequestedMenu(null);
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
                                    navigate("/login");
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
                isOpen={isSidebarOpen}
                requestedMenuName={sidebarRequestedMenu}
                onClose={() => setIsSidebarOpen(false)}
            />
        </>
    )
};

export default MobileFooter;
