import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
// import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";
import LoginModal from "../Modal/LoginModal";
import SupportModal from "../Modal/SupportModal";
import { NavigationContext } from "../Layout/NavigationContext";
import VerifyAgeModal from "../Modal/VerifyAgeModal";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAgeModal, setShowAgeModal] = useState(false);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [topGames, setTopGames] = useState([]);
    const [topArcade, setTopArcade] = useState([]);
    const [topCasino, setTopCasino] = useState([]);
    const [topLiveCasino, setTopLiveCasino] = useState([]);
    const [liveCasinoCategories, setLiveCasinoCategories] = useState([]);
    const [supportWhatsApp, setSupportWhatsApp] = useState("");
    const [supportTelegram, setSupportTelegram] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportParent, setSupportParent] = useState("");
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportParentOnly, setSupportParentOnly] = useState(false);
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

    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isHomePage = location.pathname === "/" || location.pathname === "/home";

        if (isHomePage || isSportsPage) {
            bodyClassList.add("is-home");
        } else {
            bodyClassList.remove("is-home");
        }
    }, [location.pathname]);

    const refreshBalance = () => {
        setUserBalance("");
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
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

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setIsLogin(true);
        refreshBalance();
        setShowLoginModal(false);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
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
        liveCasinoCategories,
        setLiveCasinoCategories,
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage, isGameModalOpen, setIsGameModalOpen }}
            >
                <VerifyAgeModal
                    isOpen={showAgeModal}
                    onClose={() => setShowAgeModal(false)}
                    onConfirm={handleAgeVerifyConfirm}
                />
                {showLoginModal && (
                    <LoginModal
                        isOpen={showLoginModal}
                        onClose={() => setShowLoginModal(false)}
                        onConfirm={handleLoginConfirm}
                    />
                )}
                <Header
                    isLogin={isLogin}
                    userBalance={userBalance}
                    handleLoginClick={handleLoginClick}
                    handleLogoutClick={handleLogoutClick}
                    isSlotsOnly={isSlotsOnly}
                    supportParent={supportParent}
                    openSupportModal={openSupportModal}
                />
                {/* <MobileHeader
                    isLogin={isLogin}
                    userBalance={userBalance}
                    isOpen={isSidebarOpen}
                    handleLoginClick={goLoginPage}
                    onToggle={toggleSidebar}
                    isSlotsOnly={isSlotsOnly}
                    supportParent={supportParent}
                    openSupportModal={openSupportModal}
                /> */}
                <main>
                    <Outlet context={{ isSlotsOnly, supportParent, openSupportModal, handleLoginClick, isLogin, isMobile, topGames, topArcade, topCasino, topLiveCasino }} />
                </main>

                <SupportModal
                    isOpen={showSupportModal}
                    onClose={closeSupportModal}
                    supportWhatsApp={supportWhatsApp}
                    supportTelegram={supportTelegram}
                    supportEmail={supportEmail}
                    supportParentOnly={supportParentOnly}
                    supportParent={supportParent}
                />

                {!isSportsPage && !isGameModalOpen && <Footer isSlotsOnly={isSlotsOnly} />}
                {/* {!isSportsPage && !isGameModalOpen && <MobileFooter isSlotsOnly={isSlotsOnly} />} */}
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;