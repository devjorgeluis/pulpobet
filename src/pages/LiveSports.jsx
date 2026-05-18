import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import CustomAlert from "../components/CustomAlert";
import DivLoading from "../components/Loading/DivLoading";

const LiveSports = () => {
    const pageTitle = "Live Sports";
    const { contextData } = useContext(AppContext);
    const [sportsEmbedUrl, setSportsEmbedUrl] = useState("");
    const { setShowFullDivLoading } = useContext(NavigationContext);
    const [isLoading, setIsLoading] = useState(true);
    const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
    const location = useLocation();

    useEffect(() => {
        loadSportsPage();
    }, [location.pathname]);

    const loadSportsPage = () => {
        setIsLoading(true);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=sportslive", callbackGetPage, null);
    };

    const callbackGetPage = (result) => {        
        if (result.status === 500 || result.status === 422) {
            setMessageCustomAlert(["error", result.message]);
            setShowFullDivLoading(false);
            setIsLoading(false);
        } else {
            setSportsEmbedUrl(result.data.url_embed);
            setIsLoading(false);
            setShowFullDivLoading(false);
        }
    };
    const handleAlertClose = () => {
        setMessageCustomAlert(["", ""]);
    };

    return (
        <>
            <CustomAlert message={messageCustomAlert} onClose={handleAlertClose} />

            <>
                {isLoading ? (
                    <></>
                ) : sportsEmbedUrl ? (
                    <div className="app__main-content">
                        <div className="digitain-sport-desktop">
                            <div id="sport_div_iframe">
                                <iframe
                                    src={sportsEmbedUrl}
                                    title="Sportsbook"
                                    className="sports-iframe"
                                    allowFullScreen
                                    loading="lazy"
                                    onError={(e) => {
                                        setMessageCustomAlert(["error", "No se pudo cargar el sportsbook. Intente recargar la página."]);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sports-layout-desktop__content">
                        <div className="sports-error-container">
                            <div className="sports-error-message">
                                <p>No se pudo cargar la página de deportes.</p>
                                <button
                                    className="button-desktop button-desktop_color_default"
                                    onClick={loadSportsPage}
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </>
    );
};

export default LiveSports;