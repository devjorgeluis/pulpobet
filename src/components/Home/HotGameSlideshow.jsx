import { useContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import GameCard from "../GameCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import IconNotFavorite from "/src/assets/svg/not-favorite.svg";
import IconFavorite from "/src/assets/svg/favorite.svg";

const HotGameSlideshow = ({ isMobile, games, title, link, onGameClick, loadMoreContent }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [, setCurrentSlide] = useState(0);

    const visibleGames = games.slice(0, isMobile ? 6 : 8);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    const handleSlideChange = useCallback((swiper) => {
        setCurrentSlide(swiper.realIndex);
    }, []);

    const onBeforeInit = (swiper) => {
        if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
        }
    };

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper || !prevRef.current || !nextRef.current) return;

        if (swiper.params && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
        }

        if (swiper.navigation) {
            try {
                swiper.navigation.destroy();
            } catch (e) {}
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [prevRef.current, nextRef.current, swiperRef.current]);

    return (
        <div className="gd-slide-section">
            <div className="d-none d-lg-block">
                <div className="row mb-4">
                    <div className="col-10">
                        <div className="h3">{title}</div>
                    </div>
                </div>

                <div className="p-carousel p-component p-carousel-horizontal">
                    <div className="p-carousel-content">
                        <div className="p-carousel-container">
                            <button
                                type="button"
                                className="p-ripple p-element p-carousel-prev p-link"
                                ref={prevRef}
                            >
                                ‹
                            </button>

                            <div className="p-carousel-items-content">
                                <div className="p-carousel-items-container">
                                    <Swiper
                                        onSwiper={(swiper) => {
                                            swiperRef.current = swiper;
                                        }}
                                        onBeforeInit={onBeforeInit}
                                        modules={[Navigation]}
                                        navigation={{
                                            prevEl: prevRef.current,
                                            nextEl: nextRef.current,
                                            disabledClass: "p-link-disabled",
                                        }}
                                        slidesPerView={isMobile ? 2 : 5}
                                        spaceBetween={20}
                                        loop={true}
                                        onSlideChange={handleSlideChange}
                                        className="slots-game-carousel"
                                    >
                                        {visibleGames.map((game, index) => (
                                            <SwiperSlide key={game.id}>
                                                <div className="mb-4">
                                                    <GameCard
                                                        key={`hotcard-${name}-${game.id ?? index}-${index}`}
                                                        id={game.id}
                                                        provider={'Casino'}
                                                        title={game.name}
                                                        type="slideshow"
                                                        imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                                        onGameClick={() => {
                                                            handleGameClick(game);
                                                        }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="p-ripple p-element p-carousel-next p-link"
                                ref={nextRef}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotGameSlideshow;