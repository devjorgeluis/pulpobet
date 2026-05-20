import { useRef, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ImgBanner1 from "/src/assets/img/casino-banner1.jpeg";
import ImgBanner2 from "/src/assets/img/casino-banner2.jpeg";
import ImgBanner3 from "/src/assets/img/casino-banner3.jpeg";
import ImgBanner4 from "/src/assets/img/casino-banner4.jpeg";
import ImgBanner5 from "/src/assets/img/casino-banner5.jpeg";
import ImgBanner6 from "/src/assets/img/casino-banner6.png";
import ImgMobileBanner1 from "/src/assets/img/mobile-casino-banner1.jpeg";
import ImgMobileBanner2 from "/src/assets/img/mobile-casino-banner2.jpeg";
import ImgMobileBanner3 from "/src/assets/img/mobile-casino-banner3.jpeg";
import ImgMobileBanner4 from "/src/assets/img/mobile-casino-banner4.jpeg";
import ImgMobileBanner5 from "/src/assets/img/mobile-casino-banner5.jpeg";
import ImgMobileBanner6 from "/src/assets/img/mobile-casino-banner6.jpeg";
import ImgBannerPrev from "/src/assets/img/banner-prev.png";
import ImgBannerNext from "/src/assets/img/banner-next.png";

const CasinoSlideshow = ({ title }) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile } = useOutletContext();

  const initSwiper = (swiper) => {
    swiperRef.current = swiper;
  };

  const slides = isMobile ? [
    { id: 1, image: ImgMobileBanner1 },
    { id: 2, image: ImgMobileBanner2 },
    { id: 3, image: ImgMobileBanner3 },
    { id: 4, image: ImgMobileBanner4 },
    { id: 5, image: ImgMobileBanner5 },
    { id: 6, image: ImgMobileBanner6 },
  ] : [
    { id: 1, image: ImgBanner1 },
    { id: 2, image: ImgBanner2 },
    { id: 3, image: ImgBanner3 },
    { id: 4, image: ImgBanner4 },
    { id: 5, image: ImgBanner5 },
    { id: 6, image: ImgBanner6 },
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

  return (
    <>
      <h3 className="h3">{title}</h3>
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
            <div className="col-6 col-xxxl-3 mb-4">
              <app-game-card className="ng-star-inserted">
                <a className="gc-container">
                  <div className="gc-card">
                    <button className="gc-favorite-btn">
                      <img
                        src="/assets/images/favorites/not-favorite.svg"
                        width="32"
                        height="32"
                        alt="Favorite"
                      />
                    </button>

                    <div className="gc-badge-list"></div>

                    <app-game-image className="gc-card-image">
                      <img
                        className="image"
                        src="https://cms.pulpobet.club/media/images/games/6454.jpg?v=1"
                        alt="Master Joker"
                      />
                    </app-game-image>

                    <div className="gc-hover">
                      <div className="gc-hover-button-wrapper">
                        <app-link-button
                          label="Jugar"
                          style={{ display: "block", width: "100%" }}
                        >
                          <a
                            className="btn purple btn-block btn-regular"
                            href="/es/game/master-joker-6454"
                          >
                            Jugar
                          </a>
                        </app-link-button>
                      </div>
                    </div>
                  </div>

                  <p className="gc-name" dark-mode="true">
                    Master Joker
                  </p>
                </a>
              </app-game-card>
            </div>

            <div className="col-6 col-xxxl-3 mb-4">
              <app-game-card className="ng-star-inserted">
                <a className="gc-container">
                  <div className="gc-card">
                    <button className="gc-favorite-btn">
                      <img
                        src="/assets/images/favorites/not-favorite.svg"
                        width="32"
                        height="32"
                        alt="Favorite"
                      />
                    </button>

                    <div className="gc-badge-list"></div>

                    <app-game-image className="gc-card-image">
                      <img
                        className="image"
                        src="https://cms.pulpobet.club/media/images/games/13129.svg?v=2"
                        alt="Rush Fever 7s"
                      />
                    </app-game-image>

                    <div className="gc-hover">
                      <div className="gc-hover-button-wrapper">
                        <app-link-button
                          label="Jugar"
                          style={{ display: "block", width: "100%" }}
                        >
                          <a
                            className="btn purple btn-block btn-regular"
                            href="/es/game/rush-fever-7s-13129"
                          >
                            Jugar
                          </a>
                        </app-link-button>
                      </div>
                    </div>
                  </div>

                  <p className="gc-name" dark-mode="true">
                    Rush Fever 7s
                  </p>
                </a>
              </app-game-card>
            </div>

            <div className="col-6 col-xxxl-3 mb-4">
              <app-game-card className="ng-star-inserted">
                <a className="gc-container">
                  <div className="gc-card">
                    <button className="gc-favorite-btn">
                      <img
                        src="/assets/images/favorites/not-favorite.svg"
                        width="32"
                        height="32"
                        alt="Favorite"
                      />
                    </button>

                    <div className="gc-badge-list"></div>

                    <app-game-image className="gc-card-image">
                      <img
                        className="image"
                        src="https://cms.pulpobet.club/media/images/games/10891.svg?v=3"
                        alt="Starburst"
                      />
                    </app-game-image>

                    <div className="gc-hover">
                      <div className="gc-hover-button-wrapper">
                        <app-link-button
                          label="Jugar"
                          style={{ display: "block", width: "100%" }}
                        >
                          <a
                            className="btn purple btn-block btn-regular"
                            href="/es/game/starburst-10891"
                          >
                            Jugar
                          </a>
                        </app-link-button>
                      </div>
                    </div>
                  </div>

                  <p className="gc-name" dark-mode="true">
                    Starburst
                  </p>
                </a>
              </app-game-card>
            </div>

            <div className="col-6 col-xxxl-3 mb-4">
              <app-game-card className="ng-star-inserted">
                <a className="gc-container">
                  <div className="gc-card">
                    <button className="gc-favorite-btn">
                      <img
                        src="/assets/images/favorites/not-favorite.svg"
                        width="32"
                        height="32"
                        alt="Favorite"
                      />
                    </button>

                    <div className="gc-badge-list"></div>

                    <app-game-image className="gc-card-image">
                      <img
                        className="image"
                        src="https://cms.pulpobet.club/media/images/games/7236.jpg?v=1"
                        alt="Wolf Fang Winter Storm"
                      />
                    </app-game-image>

                    <div className="gc-hover">
                      <div className="gc-hover-button-wrapper">
                        <app-link-button
                          label="Jugar"
                          style={{ display: "block", width: "100%" }}
                        >
                          <a
                            className="btn purple btn-block btn-regular"
                            href="/es/game/wolf-fang-winter-storm-7236"
                          >
                            Jugar
                          </a>
                        </app-link-button>
                      </div>
                    </div>
                  </div>

                  <p className="gc-name" dark-mode="true">
                    Wolf Fang Winter Storm
                  </p>
                </a>
              </app-game-card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoSlideshow;