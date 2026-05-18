import { useContext, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import GameCard from "../GameCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const HotGameSlideshow = ({ isMobile, games, name, title, link, onGameClick, loadMoreContent }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    const handleSlideChange = useCallback((swiper) => {
        setCurrentSlide(swiper.realIndex);
    }, []);

    const handleIndicatorClick = (index) => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideToLoop(index);
        }
    };

    return (
        <div className="slots-main-desktop__provider-section">
            <div className="provider-section-desktop">
                <div className="provider-section-desktop__header">
                    <div className="provider-section-desktop__header-img-container">
                        <div className="provider-section-desktop__header-img-top">
                            <span className="provider-section-desktop__header-provider-text">
                                {title}
                            </span>
                        </div>
                        <div className="provider-section-desktop__header-line"></div>
                    </div>
                    <div className="provider-section-desktop__controls">
                        <div className="carousel-arrows">
                            <a className="carousel-arrows__title" onClick={link ? () => navigate(link) : loadMoreContent}>
                                <span className="carousel-arrows__title-text">Mostrar Todo</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="provider-section-desktop__games-container">
                    {games.slice(0, isMobile? 6 : 8).map((game, gameIndex) => (
                        <GameCard
                            key={gameIndex}
                            id={game.id}
                            title={game.name}
                            imageSrc={game.imageDataSrc || game.image_url || (game.image_local ? contextData.cdnUrl + game.image_local : "")}
                            onClick={() => handleGameClick(game)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotGameSlideshow;