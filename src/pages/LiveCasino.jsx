import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import LiveCasinoSlideshow from "../components/LiveCasino/LiveCasinoSlideshow";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import LoadApi from "../components/Loading/LoadApi";

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
  const { setLiveCasinoCategories } = useContext(LayoutContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [pageData, setPageData] = useState({});
  const [games, setGames] = useState([]);
  const [gameUrl, setGameUrl] = useState("");
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
    } else {
      const categories = result && result.data.categories ? result.data.categories : [];
      setCategories(categories);
      setLiveCasinoCategories(categories);
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
    if (categories.length > 0 && !location.state?.provider && !location.state?.liveCasinoCategory) {
      let item = categories[0];
      fetchContent(item, item.id, item.table_name, 0, false);
      setActiveCategory(item);
    }
  }, [categories, location.state?.provider, location.state?.liveCasinoCategory]);

  useEffect(() => {
    const selectedItem = location.state?.provider || location.state?.liveCasinoCategory;
    if (!selectedItem || !selectedItem.id || !selectedItem.table_name) return;
    if (!pageData.page_group_code) return;

    setActiveCategory(selectedItem);
    setSelectedCategoryIndex(0);
    fetchContent(selectedItem, selectedItem.id, selectedItem.table_name, 0, true);
    window.scrollTo(0, 0);
  }, [location.state?.provider, location.state?.liveCasinoCategory, pageData.page_group_code]);

  const loadMoreContent = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
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

  return (
    <>
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
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ''),
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            } else if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ''),
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            }
          }}
          launchInNewTab={() => {
            if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ''),
              };
              launchGame(game, selectedGameType, 'tab');
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
        <div className="pagecontainer casino">
          <div className="container-fluid">

            <LiveCasinoSlideshow />
            <main className="row mt-4">
              <div className="col-12">
                <div className="slots-template-container">
                  <h2 className="section-title slots" dark-mode="true">
                    {activeCategory?.name}
                  </h2>

                  <div className="pg-content-container">
                    <div className="banner-section">
                      <div className="slots-general-container mb-4">
                        <ul>
                          {games &&
                            games.map((game) => (
                              <li key={game.id}>
                                <GameCard
                                  id={game.id}
                                  provider={activeCategory?.name || 'Live Casino'}
                                  title={game.name}
                                  imageSrc={
                                    game.image_local !== null
                                      ? contextData.cdnUrl + game.image_local
                                      : game.image_url
                                  }
                                  game={game}
                                  onClick={() => {
                                    if (isLogin) {
                                      launchGame(game, 'slot', 'modal');
                                    } else {
                                      handleLoginClick();
                                    }
                                  }}
                                />
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {games.length > 0 && (
                  <div className="text-center">
                    <a className="btn orange btn-regular" onClick={loadMoreContent}>
                      <span className="d-flex align-items-center">
                        VER MÁS {isLoadingGames && <LoadApi />}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;