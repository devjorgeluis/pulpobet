import { useContext } from "react";
import { AppContext } from "../AppContext";
import IconNotFavorite from "/src/assets/svg/not-favorite.svg";
import IconFavorite from "/src/assets/svg/favorite.svg";

const GameCard = (props) => {
    const { contextData } = useContext(AppContext);

    const handleGameClick = (e) => {
        e.stopPropagation();

        const gameData = props.game || {
            id: props.id || props.gameId,
            name: props.title,
            image_local: props.imageSrc?.includes(contextData?.cdnUrl)
                ? props.imageSrc.replace(contextData.cdnUrl, '')
                : null,
            image_url: props.imageSrc?.includes(contextData?.cdnUrl)
                ? null
                : props.imageSrc
        };

        if (props.onGameClick) {
            props.onGameClick(gameData);
        }
    };

    return (
        <div className="slots-game-card">
            <div className="gc-container" onClick={handleGameClick} role="button" tabIndex={0}>
                <div className="gc-card">
                    <button className="gc-favorite-btn" type="button">
                        <img
                            src={IconNotFavorite}
                            width={32}
                            height={32}
                            alt="Favorite"
                        />
                    </button>

                    <div className="gc-badge-list"></div>

                    <div className="gc-card-image">
                        <img
                            className="image"
                            src={props.imageSrc}
                            alt={props.title}
                        />
                    </div>

                    <div className="gc-hover">
                        <div className="gc-hover-button-wrapper">
                            <button
                                type="button"
                                className="btn purple btn-block btn-regular"
                                onClick={handleGameClick}
                            >
                                Jugar
                            </button>
                        </div>
                    </div>
                </div>

                <p className="gc-name" dark-mode="true">{props.title}</p>
            </div>
        </div>
    );
};

export default GameCard;
