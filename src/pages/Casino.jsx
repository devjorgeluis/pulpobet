import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import CasinoSlideshow from "../components/Casino/CasinoSlideshow";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import LoadApi from "../components/Loading/LoadApi";
import { getHeaderTags } from "../components/Layout/Header";
import "/src/css/casino.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [gameLaunchError, setGameLaunchError] = useState("");

  useEffect(() => {
    if (!gameLaunchError) return;

    const timer = setTimeout(() => {
      setGameLaunchError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [gameLaunchError]);

  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] =
    useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isSlotsOnly, isLogin, isMobile, handleLoginClick } = useOutletContext();
  const tags = getHeaderTags(isSlotsOnly);
  const lastLoadedTagRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace("#", "");
    const tagIndex = tags.findIndex((t) => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash, tags]);

  useEffect(() => {
    const provider = location.state?.provider;
    if (provider && provider.id && provider.table_name) {
      setIsSingleCategoryView(true);
      setIsExplicitSingleCategoryView(true);
      setActiveCategory(provider);
      setSelectedProvider(provider);
      fetchContent(
        provider,
        provider.id,
        provider.table_name,
        0,
        true,
        null
      );
      window.scrollTo(0, 0);
    }
  }, [location.state?.provider]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    getPage("casino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    callApi(
      contextData,
      "GET",
      "/get-page?page=" + page,
      (result) => callbackGetPage(result, page),
      null,
    );
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      setCategoryType(result.data.page_group_type);
      setSelectedProvider(null);
      setPageData(result.data);

      const hashCode = location.hash.replace("#", "");
      const tagIndex = tags.findIndex((t) => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (
        result.data &&
        result.data.page_group_type === "categories" &&
        result.data.categories &&
        result.data.categories.length > 0
      ) {
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        const firstFiveCategories = result.data.categories.slice(0, 5);
        if (firstFiveCategories.length > 0) {
          setFirstFiveCategoriesGames([]);
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(
              item,
              item.id,
              item.table_name,
              index,
              true,
              result.data.page_group_code,
            );
          });
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setIsSingleCategoryView(true);
        setIsExplicitSingleCategoryView(false);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        pageCurrent = 1;
      }

      setIsLoadingGames(false);
    }
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(
      category,
      category.id,
      category.table_name,
      categoryIndex,
      true,
    );
    lastLoadedTagRef.current = category.code || "";
    window.scrollTo(0, 0);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    setIsLoadingGames(true);
    fetchContent(
      activeCategory,
      activeCategory.id,
      activeCategory.table_name,
      selectedCategoryIndex,
      false,
    );
  };

  const fetchContent = (
    category,
    categoryId,
    tableName,
    categoryIndex,
    resetCurrentPage,
    pageGroupCode,
  ) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode =
      categoryType === "categories"
        ? pageGroupCode || pageData.page_group_code
        : "default_pages_home";

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
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
  };

  const fetchContentForCategory = (
    category,
    categoryId,
    tableName,
    categoryIndex,
    resetCurrentPage,
    pageGroupCode = null,
  ) => {
    const pageSize = 30;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id
        ? "&provider=" + selectedProvider.id
        : "");

    callApi(
      contextData,
      "GET",
      apiUrl,
      (result) =>
        callbackFetchContentForCategory(result, category, categoryIndex),
      null,
    );
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(
        0,
        pendingCategoryFetchesRef.current - 1,
      );
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc:
          game.image_local !== null
            ? contextData.cdnUrl + game.image_local
            : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(
        0,
        pendingCategoryFetchesRef.current - 1,
      );
    }
  };


  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setIsGameModalOpen(true);
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

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc =
        element.image_local !== null
          ? contextData.cdnUrl + element.image_local
          : element.image_url;
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
        <div className="pagecontainer casino">
          <div className="container-fluid">
            <CasinoSlideshow />

            <main className="row mt-4">
              <div className="col-12">
                {selectedProvider || isSingleCategoryView ? (
                  <>
                    <div className="slots-template-container">
                      <h2 className="section-title slots" dark-mode="true">{activeCategory?.name}</h2>

                      <div className="pg-content-container">
                        <div className="banner-section">
                          <div className="slots-general-container mb-4">
                            <ul>
                              {
                                games.length > 0 &&
                                games.map((game) => (
                                  <li key={game.id}>
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
                                  </li>
                                )
                                )
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {games.length > 0 && (
                      <div className="text-center">
                        <a className="btn orange btn-regular" onClick={loadMoreGames}>
                          <span className="d-flex align-items-center">VER MÁS {isLoadingGames && <LoadApi />}</span>
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isSingleCategoryView ? (
                      <div className="slots-template-container">
                        <div className="pg-content-container">
                          <div className="banner-section">
                            <div className="slots-general-container mb-4">
                              <ul>
                                {
                                  games.length > 0 &&
                                  games.map((game) => (
                                    <li>
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
                                        size="small"
                                      />
                                    </li>
                                  )
                                  )
                                }

                                {games.length > 0 && (
                                  <div className="text-center">
                                    <a className="btn orange btn-regular" onClick={loadMoreGames}>
                                      <span className="d-flex align-items-center">VER MÁS {isLoadingGames && <LoadApi />}</span>
                                    </a>
                                  </div>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {firstFiveCategoriesGames.map((entry, catIndex) => {
                          if (!entry || !entry.games) return null;

                          return (
                            <HotGameSlideshow
                              key={entry?.category?.id || catIndex}
                              games={entry.games}
                              name={entry?.category?.name}
                              title={entry?.category?.name}
                              length={7}
                              slideshowKey={entry?.category?.id}
                              loadMoreContent={() =>
                                loadMoreContent(entry.category, catIndex)
                              }
                              onGameClick={(g) => {
                                if (isLogin) {
                                  launchGame(g, "slot", "modal");
                                } else {
                                  handleLoginClick();
                                }
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Casino;