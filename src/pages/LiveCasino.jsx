import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import CategoryButton from "../components/CategoryButton";
import GameModal from "../components/Modal/GameModal";
import DivLoading from "../components/Loading/DivLoading";
import LoadApi from "../components/Loading/LoadApi";
import CustomAlert from "../components/CustomAlert";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Live Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin, isMobile, handleLoginClick } = useOutletContext();
  const { setShowFullDivLoading, setIsGameModalOpen } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [pageData, setPageData] = useState({});
  const [games, setGames] = useState([]);
  const [gameUrl, setGameUrl] = useState("");
  const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    getPage("livecasino");
  }, [location.pathname]);

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setCategories(result && result.data.categories);
      setPageData(result && result.data);

      if (pageData.url && pageData.url != null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type == "categories") {
          setSelectedCategoryIndex(0);
        }
        if (result.data.page_group_type == "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      let item = categories[0];
      fetchContent(item, item.id, item.table_name, 0, false);
      setActiveCategory(item);
    }
  }, [categories]);

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    let pageSize = 30;
    setIsLoadingGames(true);
    // setShowFullDivLoading(true);

    if (resetCurrentPage == true) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
    setShowFullDivLoading(false);
  };

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
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else if (result.status == "500" || result.status == "422") {
      setMessageCustomAlert(["error", result.message]);
    }
    setShowFullDivLoading(false);
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setIsGameModalOpen(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const handleAlertClose = () => {
    setMessageCustomAlert(["", ""]);
  };

  return (
    <>
      <CustomAlert message={messageCustomAlert} onClose={handleAlertClose} />

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
        <div className="slots-layout-content-desktop">
          <div className="slots-main-desktop__filter-container">
            <div className="slots-main-desktop__provider-filter-list">
              {categories && categories.length > 0 && (
                <div className="slots-provider-filter-list-desktop">
                  {categories.map((item, index) => (
                    <CategoryButton
                      key={index}
                      title={item.name}
                      icon={item.image_local ? contextData.cdnUrl + item.image_local : null}
                      active={selectedCategoryIndex == index}
                      onClick={() => fetchContent(item, item.id, item.table_name, index, true)}
                    />
                  ))}
                </div>
              )}
              {categories.length == 0 && <DivLoading />}
            </div>
          </div>

          <div className="slots-main-desktop__content-container">
            <div className="slots-main-desktop__provider-section">
              <div className="provider-section-desktop">
                <div className="provider-section-desktop__header">
                  <div className="provider-section-desktop__header-img-container">
                    <div className="provider-section-desktop__header-img-top">
                      {activeCategory.image_url && activeCategory.image_url !== "" && (
                        <img
                          className="provider-section-desktop__header-icon"
                          src=""
                          alt=""
                          loading="lazy"
                        />
                      )}
                      <span className="provider-section-desktop__header-provider-text">
                        {activeCategory.name}
                      </span>
                    </div>
                    <div className="provider-section-desktop__header-line"></div>
                  </div>
                </div>
                <div className="provider-section-desktop__games-container">
                  {games &&
                    games.map((game) => (
                      <GameCard
                        key={game.id}
                        id={game.id}
                        provider={activeCategory?.name || "Casino"}
                        title={game.name}
                        imageSrc={
                          game.image_local !== null
                            ? contextData.cdnUrl + game.image_local
                            : game.image_url
                        }
                        game={game}
                        onClick={() => {
                          if (isLogin) {
                            launchGame(game, "slot", "modal");
                          } else {
                            handleLoginClick();
                          }
                        }}
                      />
                    ))}
                </div>
                <div className="carousel-arrows">
                  <a className="carousel-arrows__title" onClick={loadMoreContent}>
                    <span className="carousel-arrows__title-text">VER MÁS {isLoadingGames && <LoadApi />}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;