import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/Home/Slideshow";
import GameModal from "../components/Modal/GameModal";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameContainer from "../components/Home/GameContainer";
import BannerContainer from "../components/Home/BannerContainer";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const Home = () => {
  const pageTitle = "Home";
  const { contextData } = useContext(AppContext);
  const { setShowFullDivLoading, setIsGameModalOpen } = useContext(NavigationContext);
  const { isSlotsOnly, isLogin, isMobile, handleLoginClick, topGames, topArcade, topCasino, topLiveCasino } = useOutletContext();
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "") {
          selectedGameId = null;
          selectedGameType = null;
          selectedGameLauncher = null;
          setShouldShowGameModal(false);
          setGameUrl("");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setIsGameModalOpen(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id !== null ? game.id : selectedGameId;
    selectedGameType = type !== null ? type : selectedGameType;
    selectedGameLauncher = launcher !== null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg =
      game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(
      contextData,
      "GET",
      "/get-game-url?game_id=" + selectedGameId,
      callbackLaunchGame,
      null,
    );
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setIsGameModalOpen(false);
  };

  return (
    <>
      <Slideshow />
      <BannerContainer isSlotsOnly={isSlotsOnly} />
      {/*

      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={(gameData) => {
            if (gameData && gameData.id) {
              const game = {
                id: gameData.id,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            } else if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            }
          }}
          launchInNewTab={() => {
            if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, "tab");
            }
          }}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
          gameId={selectedGameId}
          gameType={selectedGameType}
          gameLauncher={selectedGameLauncher}
        />
      ) : (
        <>
          <Slideshow />
          <GameContainer />

          <div className="slots-main-desktop__content-container">
            {topGames.length > 0 && (
              <HotGameSlideshow
                isMobile={isMobile}
                games={topGames}
                name="games"
                title="Juegos populares"
                link="/casino"
                onGameClick={(game) => {
                  if (isLogin) {
                    launchGame(game, "slot", "modal");
                  } else {
                    handleLoginClick();
                  }
                }}
              />
            )}
            {topArcade.length > 0 &&
              isSlotsOnly === "false" && (
                <HotGameSlideshow
                  isMobile={isMobile}
                  games={topArcade}
                  name="arcade"
                  title="Tragamonedas"
                  link="/casino"
                  onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "slot", "modal");
                    } else {
                      handleLoginClick();
                    }
                  }}
                />
              )}
            {topCasino.length > 0 &&
              isSlotsOnly === "false" && (
                <HotGameSlideshow
                  isMobile={isMobile}
                  games={topCasino}
                  name="casino"
                  title="Casino"
                  link="/casino"
                  onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "slot", "modal");
                    } else {
                      handleLoginClick();
                    }
                  }}
                />
              )}
            {topLiveCasino.length > 0 &&
              isSlotsOnly === "false" && (
                <HotGameSlideshow
                  isMobile={isMobile}
                  games={topLiveCasino}
                  name="liveCasino"
                  title="Casino En Vivo"
                  link="/live-casino"
                  onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "slot", "modal");
                    } else {
                      handleLoginClick();
                    }
                  }}
                />
              )}
          </div>
        </>
      )} */}
    </>
  );
};

export default Home;