import { useRef, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ImgBanner0 from "/src/assets/img/banner0.jpg";
import ImgBanner1 from "/src/assets/img/banner1.jpg";
import ImgBanner2 from "/src/assets/img/banner2.jpg";
import ImgBanner3 from "/src/assets/img/banner3.jpg";
import ImgBanner4 from "/src/assets/img/banner4.jpg";
import ImgBanner5 from "/src/assets/img/banner5.jpg";
import ImgBanner6 from "/src/assets/img/banner6.jpg";
import ImgBanner7 from "/src/assets/img/banner7.jpg";
import ImgBanner8 from "/src/assets/img/banner8.jpg";
import ImgBanner9 from "/src/assets/img/banner9.jpg";
import ImgMobileBanner0 from "/src/assets/img/mobile-banner0.jpg";
import ImgMobileBanner1 from "/src/assets/img/mobile-banner1.jpg";
import ImgMobileBanner2 from "/src/assets/img/mobile-banner2.jpg";
import ImgMobileBanner3 from "/src/assets/img/mobile-banner3.jpg";
import ImgMobileBanner4 from "/src/assets/img/mobile-banner4.jpg";
import ImgMobileBanner5 from "/src/assets/img/mobile-banner5.jpg";
import ImgMobileBanner6 from "/src/assets/img/mobile-banner6.jpg";
import ImgMobileBanner7 from "/src/assets/img/mobile-banner7.jpg";
import ImgMobileBanner8 from "/src/assets/img/mobile-banner8.jpg";
import ImgMobileBanner9 from "/src/assets/img/mobile-banner9.jpg";
import ImgBannerPrev from "/src/assets/img/banner-prev.png";
import ImgBannerNext from "/src/assets/img/banner-next.png";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile } = useOutletContext();

  const initSwiper = (swiper) => {
    swiperRef.current = swiper;
  };

  const slides = isMobile ? [
    { id: 0, image: ImgMobileBanner0 },
    { id: 1, image: ImgMobileBanner1 },
    { id: 2, image: ImgMobileBanner2 },
    { id: 3, image: ImgMobileBanner3 },
    { id: 4, image: ImgMobileBanner4 },
    { id: 5, image: ImgMobileBanner5 },
    { id: 6, image: ImgMobileBanner6 },
    { id: 7, image: ImgMobileBanner7 },
    { id: 8, image: ImgMobileBanner8 },
    { id: 9, image: ImgMobileBanner9 },
  ] : [
    { id: 0, image: ImgBanner0 },
    { id: 1, image: ImgBanner1 },
    { id: 2, image: ImgBanner2 },
    { id: 3, image: ImgBanner3 },
    { id: 4, image: ImgBanner4 },
    { id: 5, image: ImgBanner5 },
    { id: 6, image: ImgBanner6 },
    { id: 7, image: ImgBanner7 },
    { id: 8, image: ImgBanner8 },
    { id: 9, image: ImgBanner9 },
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
  );
};

export default Slideshow;