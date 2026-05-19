import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// import ImgBanner1 from "/src/assets/img/banner1.webp";
// import ImgBanner2 from "/src/assets/img/banner2.webp";
// import ImgBanner3 from "/src/assets/img/banner3.webp";
// import ImgBanner4 from "/src/assets/img/banner4.webp";
// import ImgBanner5 from "/src/assets/img/banner5.webp";
// import ImgBanner6 from "/src/assets/img/banner6.png";
// import ImgBanner7 from "/src/assets/img/banner7.webp";
// import ImgBanner8 from "/src/assets/img/banner8.webp";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // { id: 0, image: ImgBanner1 },
    // { id: 1, image: ImgBanner2 },
    // { id: 2, image: ImgBanner3 },
    // { id: 3, image: ImgBanner4 },
    // { id: 4, image: ImgBanner5 },
    // { id: 5, image: ImgBanner6 },
    // { id: 6, image: ImgBanner7 },
    // { id: 7, image: ImgBanner8 }
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  const handleIndicatorClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div className="carousel__track">
      <Swiper
        ref={swiperRef}
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
            <div className="mobile">
              <img
                src={slide.image}
                alt={`Banner ${slide.id + 1}`}
                title={`Banner ${slide.id + 1}`}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slideshow;