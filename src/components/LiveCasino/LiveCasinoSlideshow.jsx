import { useRef, useState, useContext } from 'react';
import { useOutletContext } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from '../GameCard';

import ImgBanner1 from "/src/assets/img/live-casino-banner1.jpeg";
import ImgBanner2 from "/src/assets/img/live-casino-banner2.png";
import ImgBanner3 from "/src/assets/img/live-casino-banner3.png";
import ImgBanner4 from "/src/assets/img/live-casino-banner4.jpeg";
import ImgMobileBanner1 from "/src/assets/img/mobile-live-casino-banner1.jpeg";
import ImgMobileBanner2 from "/src/assets/img/mobile-live-casino-banner2.png";
import ImgMobileBanner3 from "/src/assets/img/mobile-live-casino-banner3.png";
import ImgMobileBanner4 from "/src/assets/img/mobile-live-casino-banner4.jpeg";
import ImgBannerPrev from "/src/assets/img/banner-prev.png";
import ImgBannerNext from "/src/assets/img/banner-next.png";

const LiveCasinoSlideshow = ({ launchGame, activeCategory, isLogin, handleLoginClick }) => {
  const { contextData } = useContext(AppContext);
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile, topLiveCasino, isLogin: outletIsLogin, handleLoginClick: outletHandleLoginClick } = useOutletContext();

  const finalIsLogin = typeof isLogin !== "undefined" ? isLogin : outletIsLogin;
  const finalHandleLoginClick = handleLoginClick || outletHandleLoginClick;

  const initSwiper = (swiper) => {
    swiperRef.current = swiper;
  };

  const slides = isMobile ? [
    { id: 1, image: ImgMobileBanner1 },
    { id: 2, image: ImgMobileBanner2 },
    { id: 3, image: ImgMobileBanner3 },
    { id: 4, image: ImgMobileBanner4 },
  ] : [
    { id: 1, image: ImgBanner1 },
    { id: 2, image: ImgBanner2 },
    { id: 3, image: ImgBanner3 },
    { id: 4, image: ImgBanner4 },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  const handleIndicatorClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  const handleGameClickLocal = (game, isDemo = false) => {
    if (finalIsLogin) {
      if (typeof launchGame === "function") launchGame(game, isDemo ? "demo" : "slot", "modal");
    } else {
      finalHandleLoginClick && finalHandleLoginClick();
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-8 col-xxxl-6">
          <div className="banners-wrapper">
            <div className="banners">
              <Swiper
                onSwiper={initSwiper}
                modules={[Autoplay]}
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={0}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                onSlideChange={handleSlideChange}
                className="swiper-wrapper"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <img
                      src={slide.image}
                      alt={`Banner ${slide.id + 1}`}
                      title={`Banner ${slide.id + 1}`}
                      loading="lazy"
                      className="banner-image"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="banners-paging">
                <a
                  href="#"
                  className="banners-paging-leftarrow"
                  onClick={(event) => {
                    event.preventDefault();
                    handlePrev();
                  }}
                >
                  <img
                    src={ImgBannerPrev}
                    alt="Anterior"
                    className="banners-paging-leftarrow-img"
                  />
                </a>

                {slides.map((slide, index) => (
                  <a
                    key={slide.id}
                    href="#"
                    className={`banners-paging-dot ${currentSlide === index ? 'is-active' : ''}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleIndicatorClick(index);
                    }}
                  ></a>
                ))}

                <a
                  href="#"
                  className="banners-paging-rightarrow"
                  onClick={(event) => {
                    event.preventDefault();
                    handleNext();
                  }}
                >
                  <img
                    src={ImgBannerNext}
                    alt="Próximo"
                    className="banners-paging-rightarrow-img"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-lg-block col-lg-4 col-xxxl-6">
          <div className="row">
            {
              topLiveCasino.slice(0, 4).map((game, index) => (
                <div className="col-6 col-xxxl-3 mb-4 top-casino-game" key={`top-casino-${game.id ?? index}-${index}`}>
                  <GameCard
                    id={game.id}
                    provider={'Hot'}
                    title={game.name}
                    type="slideshow"
                    imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                    onGameClick={() => handleGameClickLocal(game)}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveCasinoSlideshow;