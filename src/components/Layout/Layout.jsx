import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";
import LoginModal from "../Modal/LoginModal";
import SupportModal from "../Modal/SupportModal";
import LogoutConfirmModal from "../Modal/LogoutConfirmModal";
import FullDivLoading from "../Loading/FullDivLoading";
import ProfileModal from "../Modal/ProfileModal";
import { NavigationContext } from "../Layout/NavigationContext";
import VerifyAgeModal from "../Modal/VerifyAgeModal";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const [showAgeModal, setShowAgeModal] = useState(false);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [topGames, setTopGames] = useState([]);
    const [topArcade, setTopArcade] = useState([]);
    const [topCasino, setTopCasino] = useState([]);
    const [topLiveCasino, setTopLiveCasino] = useState([]);
    const [supportWhatsApp, setSupportWhatsApp] = useState("");
    const [supportTelegram, setSupportTelegram] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportParent, setSupportParent] = useState("");
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportParentOnly, setSupportParentOnly] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileModalSection, setProfileModalSection] = useState("transaction");
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const isSportsPage = location.pathname === "/sports" || location.pathname === "/live-sports";

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                const parsed = parseFloat(contextData.session.user.balance);
                setUserBalance(Number.isFinite(parsed) ? parsed : 0);

                setSupportWhatsApp(contextData.session.support_whatsapp || "");
                setSupportTelegram(contextData.session.support_telegram || "");
                setSupportEmail(contextData.session.support_email || "");
                setSupportParent(contextData.session.support_parent || "");
            }

            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const isAgeVerified = localStorage.getItem("is-age-verified");
        if (!isAgeVerified) {
            setShowAgeModal(true);
        }
    });

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance("");
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
        setShowFullDivLoading(false);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = (result) => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
        } else {
            setIsSlotsOnly("true");
        }

        setSupportWhatsApp(result && result.support_whatsapp ? result.support_whatsapp : "");
        setSupportTelegram(result && result.support_telegram ? result.support_telegram : "");
        setSupportEmail(result && result.support_email ? result.support_email : "");
        setSupportParent(result && result.support_parent ? result.support_parent : "");
        setTopGames(result.top_hot);
        setTopArcade(result.top_arcade);
        setTopCasino(result.top_slot);
        setTopLiveCasino(result.top_livecasino);

        if (result && result.user === null) {
            localStorage.removeItem("session");
        }        
    };

    const goLoginPage = () => {
        navigate("/login");
    }    

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setIsLogin(true);
        refreshBalance();
        setShowLoginModal(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            } else {
                setShowLogoutModal(false);
            }
        }, null);
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAgeVerifyConfirm = () => {
        localStorage.setItem("is-age-verified", JSON.stringify({ value: true }));
        setShowAgeModal(false);
    };

    const openSupportModal = (parentOnly = false) => {
        setSupportParentOnly(Boolean(parentOnly));
        setShowSupportModal(true);
    };

    const closeSupportModal = () => {
        setShowSupportModal(false);
        setSupportParentOnly(false);
    };

    const openProfileModal = (section = "history") => {
        setProfileModalSection(section);
        setShowProfileModal(true);
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        supportWhatsApp,
        supportTelegram,
        supportEmail,
        supportParent,
        handleLoginClick,
        handleLogoutClick,
        refreshBalance,
        setShowFullDivLoading,
        openSupportModal,
        openProfileModal
    };    

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading, isGameModalOpen, setIsGameModalOpen }}
            >
                <VerifyAgeModal
                    isOpen={showAgeModal}
                    onClose={() => setShowAgeModal(false)}
                    onConfirm={handleAgeVerifyConfirm}
                />
                <div className="body-container fade-in">
                    <FullDivLoading show={showFullDivLoading} />
                    {showLogoutModal && (
                        <LogoutConfirmModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
                    )}
                    {showLoginModal && (
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onConfirm={handleLoginConfirm}
                        />
                    )}
                    <div className="body-scrollable">
                        <div className="app__header-wrapper">
                            <Header
                                isLogin={isLogin}
                                userBalance={userBalance}
                                handleLoginClick={handleLoginClick}
                                handleLogoutClick={handleLogoutClick}
                                isSlotsOnly={isSlotsOnly}
                                supportParent={supportParent}
                                openSupportModal={openSupportModal}
                                openProfileModal={openProfileModal}
                            />
                            <MobileHeader
                                isLogin={isLogin}
                                userBalance={userBalance}
                                isOpen={isSidebarOpen}
                                handleLoginClick={goLoginPage}
                                onToggle={toggleSidebar}
                                isSlotsOnly={isSlotsOnly}
                                supportParent={supportParent}
                                openSupportModal={openSupportModal}
                                openProfileModal={openProfileModal}
                            />
                        </div>
                        <main className="app__main">
                            <Outlet context={{ isSlotsOnly, supportParent, openSupportModal, handleLoginClick, isLogin, isMobile, topGames, topArcade, topCasino, topLiveCasino }} />
                        </main>
                    </div>

                    <SupportModal
                        isOpen={showSupportModal}
                        onClose={closeSupportModal}
                        supportWhatsApp={supportWhatsApp}
                        supportTelegram={supportTelegram}
                        supportEmail={supportEmail}
                        supportParentOnly={supportParentOnly}
                        supportParent={supportParent}
                    />
                    {showProfileModal && (
                        <ProfileModal
                            onClose={closeProfileModal}
                            handleLogoutClick={handleLogoutClick}
                            activeSection={profileModalSection}
                            isMobile={isMobile}
                        />
                    )}

                    {!isSportsPage && !isGameModalOpen && <Footer isSportsPage={isSportsPage} />}
                    {!isSportsPage && !isGameModalOpen && <MobileFooter isSlotsOnly={isSlotsOnly} />}

                    <div style={{ position: 'fixed', right: '10px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', zIndex: 1000 }}> v 1.7 </div>
                </div>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;