import { useNavigate, useOutletContext } from "react-router-dom";

// import ImgJetx from "/src/assets/img/jetx.webp";
// import ImgJetxIcon from "/src/assets/img/jetx-icon.webp";
// import ImgCrash from "/src/assets/img/rocketman.webp";
// import ImgCrashIcon from "/src/assets/img/rocketman-icon.png";
// import ImgSpaceman from "/src/assets/img/spaceman.webp";
// import ImgSpacemanIcon from "/src/assets/img/spaceman-icon.webp";
// import ImgChicken from "/src/assets/img/aviator.webp";
// import ImgChickenIcon from "/src/assets/img/aviator-icon.png";
// import ImgHorseRaces from "/src/assets/img/horseRaces.webp";
// import ImgBlackjackMain from "/src/assets/img/blackjack-main.webp";
// import IconBlueSports from "/src/assets/img/blue-sports.webp";
// import IconBlueCasino from "/src/assets/img/blue-casino.webp";
// import IconBlueLiveCasino from "/src/assets/img/blue-live-casino.webp";

const GameContainer = () => {
    const { isSlotsOnly } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="slots-main-desktop__item-container">
            {/* <div className="home-desktop__block">
                <div className="home-main-slots-desktop">
                    <a className="home-main-slots-desktop__item" onClick={() => navigate("/casino")}>
                        <img className="home-main-slots-desktop__img" src={ImgJetx} alt="Main Slot" />
                        <img className="home-main-slots-desktop__icon" src={ImgJetxIcon} alt="" />
                        <div className="home-main-slots-desktop__button">
                            <div>Jugar</div>
                        </div>
                    </a>
                    <a className="home-main-slots-desktop__item" onClick={() => navigate("/casino")}>
                        <img className="home-main-slots-desktop__img" src={ImgCrash} alt="Main Slot" />
                        <img className="home-main-slots-desktop__icon" src={ImgCrashIcon} alt="" />
                        <div className="home-main-slots-desktop__button">
                            <div>Jugar</div>
                        </div>
                    </a>
                    <a className="home-main-slots-desktop__item" onClick={() => navigate("/casino")}>
                        <img className="home-main-slots-desktop__img" src={ImgSpaceman} alt="Main Slot" />
                        <img className="home-main-slots-desktop__icon" src={ImgSpacemanIcon} alt="" />
                        <div className="home-main-slots-desktop__button">
                            <div>Jugar</div>
                        </div>
                    </a>
                    <a className="home-main-slots-desktop__item" onClick={() => navigate("/casino")}>
                        <img className="home-main-slots-desktop__img" src={ImgChicken} alt="Main Slot" />
                        <img className="home-main-slots-desktop__icon" src={ImgChickenIcon} alt="" />
                        <div className="home-main-slots-desktop__button">
                            <div>Jugar</div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="home-links-mobile">
                <div className="home-links-mobile__main">
                    <a className="home-links-card-mobile" onClick={() => navigate("/casino")}>
                        <div
                            className="home-links-card-mobile__content home-links-card-mobile__content_bg_card"
                        >
                            <img
                                className="home-links-card-mobile__img"
                                src={ImgBlackjackMain}
                                alt="Blackjack"
                                loading="lazy"
                            />
                            <span className="home-links-card-mobile__title">Black Jack</span>
                        </div>
                    </a>
                    <a className="home-links-card-mobile" onClick={() => navigate("/casino")}>
                        <div className="home-links-card-mobile__content home-links-card-mobile__content_bg_horseRaces">
                            <img
                                className="home-links-card-mobile__img"
                                src={ImgHorseRaces}
                                alt="Universal Race"
                                loading="lazy"
                            />
                            <span className="home-links-card-mobile__title">Carrera Universal</span>
                        </div>
                    </a>
                </div>
                <div className="home-links-mobile__sub">
                    {
                        isSlotsOnly == "false" && <a className="home-links-mobile__sub-item" onClick={() => navigate("/sports")}>
                            <span className="SVGInline home-links-mobile__sub-item-icon">
                                <img className="SVGInline-svg home-links-mobile__sub-item-icon-svg" src={IconBlueSports} />
                            </span>
                            <span className="home-links-mobile__sub-item-text">Deporte</span>
                        </a>
                    }

                    <a className="home-links-mobile__sub-item" onClick={() => navigate("/casino")}>
                        <span className="SVGInline home-links-mobile__sub-item-icon">
                            <img className="SVGInline-svg home-links-mobile__sub-item-icon-svg" src={IconBlueCasino} />
                        </span>
                        <span className="home-links-mobile__sub-item-text">Casino</span>
                    </a>

                    {
                        isSlotsOnly == "false" && <a className="home-links-mobile__sub-item" onClick={() => navigate("/live-casino")}>
                            <span className="SVGInline home-links-mobile__sub-item-icon">
                                <img className="SVGInline-svg home-links-mobile__sub-item-icon-svg" src={IconBlueLiveCasino} />
                            </span>
                            <span className="home-links-mobile__sub-item-text">Casino En Vivo</span>
                        </a>
                    }
                </div>
            </div> */}
        </div>
    );
};

export default GameContainer;