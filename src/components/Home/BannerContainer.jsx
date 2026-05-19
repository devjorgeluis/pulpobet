import { useNavigate } from "react-router-dom";
import ImgCasino from "/src/assets/img/casino-item.png";
import ImgLiveCasino from "/src/assets/img/live-casino-item.png";
import ImgSport from "/src/assets/img/sports-item.png";

const BannerContainer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    return (
        <div className="pagecontainer">
            <div className="home-container">
                <app-home-cards className="dark">
                    <div className="homegrid">
                        <a
                            className="homegrid-card"
                            onClick={() => navigate("/casino")}
                            style={{
                                backgroundImage: `url(${ImgCasino})`,
                            }}
                        ></a>

                        {
                            !isSlotsOnlyMode && <>
                                <a
                                    className="homegrid-card"
                                    onClick={() => navigate("/live-casino")}
                                    style={{
                                        backgroundImage: `url(${ImgLiveCasino})`,
                                    }}
                                ></a>

                                <a
                                    className="homegrid-card"
                                    onClick={() => navigate("/sports")}
                                    style={{
                                        backgroundImage: `url(${ImgSport})`,
                                    }}
                                ></a>
                            </>
                        }
                    </div>
                </app-home-cards>
            </div>
        </div>
    )
}

export default BannerContainer