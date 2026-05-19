import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import SearchInput from "../components/SearchInput";
import LoadApi from "../components/Loading/LoadApi";

// import ImgTodo from "/src/assets/svg/todo.svg";
// import ImgHot from "/src/assets/svg/hot.svg";
// import ImgJoker from "/src/assets/svg/joker.svg";
// import ImgCrash from "/src/assets/svg/crash.svg";
// import ImgMegaway from "/src/assets/svg/megaway.svg";
// import ImgRuleta from "/src/assets/svg/ruleta.svg";
import ImgSlotsBanner from "/src/assets/img/logo.png";
import ImgMobileSlotsBanner from "/src/assets/img/logo.png";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { setShowFullDivLoading, setIsGameModalOpen } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [txtSearch, setTxtSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [gameLaunchError, setGameLaunchError] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();

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
  const lastLoadedTagRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        // { name: "Lobby", code: "home", image: ImgTodo },
        // { name: "Hot", code: "hot", image: ImgHot },
        // { name: "Jokers", code: "joker", image: ImgJoker },
        // { name: "Ruletas", code: "roulette", image: ImgRuleta },
        // { name: "Crash", code: "arcade", image: ImgCrash },
        // { name: "Megaways", code: "megaways", image: ImgMegaway },
      ]
      : [
        // { name: "Lobby", code: "home", image: ImgTodo },
        // { name: "Hot", code: "hot", image: ImgHot },
        // { name: "Jokers", code: "joker", image: ImgJoker },
        // { name: "Megaways", code: "megaways", image: ImgMegaway },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

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
      setShowFullDivLoading(false);
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
        setCategories(result.data.categories);
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
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        pageCurrent = 1;
      }

      setShowFullDivLoading(false);
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");
    setIsExplicitSingleCategoryView(true);
    window.scrollTo(0, 0);

    if (provider) {
      setActiveCategory(null);
      setSelectedCategoryIndex(-1);

      fetchContent(provider, provider.id, provider.table_name, index, true);
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(
          firstCategory,
          firstCategory.id,
          firstCategory.table_name,
          0,
          true,
        );
      }
    }
  };

  const search = (e) => {
    const keyword = txtSearch;

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      performSearchWithDelay(keyword);
    } else {
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        e.keyCode === 8 ||
        e.keyCode === 46
      ) {
        performSearchWithDelay(keyword);
      }
    }

    if (e.key === "Enter" || e.keyCode === 13) {
      performSearch(keyword);
      searchRef.current?.blur();
    }

    if (e.key === "Escape" || e.keyCode === 27) {
      searchRef.current?.blur();
    }
  };

  const performSearchWithDelay = (keyword) => {
    clearTimeout(searchDelayTimer);

    if (keyword.trim() === "") {
      return;
    }

    const timer = setTimeout(() => {
      performSearch(keyword);
    }, 1000);

    setSearchDelayTimer(timer);
  };

  const performSearch = (keyword) => {
    if (keyword.trim() === "") {
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      setGames([]);
      getPage("casino");
      return;
    }

    setTxtSearch(keyword.trim());
    setGames([]);
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setActiveCategory({ name: `Búsqueda: "${keyword.trim()}"` });
    setSelectedProvider(null);

    let pageSize = 30;

    callApi(
      contextData,
      "GET",
      "/search-content?keyword=" +
      encodeURIComponent(keyword.trim()) +
      "&page_group_code=" +
      pageData.page_group_code +
      "&length=" +
      pageSize,
      callbackSearch,
      null,
    );
  };

  const callbackSearch = (result) => {
    if (result.status === 500 || result.status === 422) {
      setGames([]);
    } else {
      configureImageSrc(result);
      setGames(result.content || []);
      pageCurrent = 1;
    }

    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setActiveCategory({ name: `Búsqueda: "${txtSearch}"` });
    setSelectedProvider(null);
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
        <div className="slots-layout-content-desktop">
          <img
            className="slots-main-desktop__banner"
            src={isMobile ? ImgMobileSlotsBanner : ImgSlotsBanner}
            alt="banner"
          />
          <div className="slots-main-desktop__filter-container">
            <div className="slots-main-desktop__filters">
              <div className="slots-main-desktop__search-category-filters">
                <CategoryContainer
                  categories={tags}
                  selectedCategoryIndex={selectedCategoryIndex}
                  selectedProvider={selectedProvider}
                  onCategoryClick={(tag, _id, _table, index) => {
                    setTxtSearch("");
                    setIsExplicitSingleCategoryView(false);
                    window.scrollTo(0, 0);
                    if (window.location.hash !== `#${tag.code}`) {
                      window.location.hash = `#${tag.code}`;
                      getPage(tag.code);
                    } else {
                      setSelectedCategoryIndex(index);
                      getPage(tag.code);
                    }
                  }}
                  onCategorySelect={handleCategorySelect}
                  isMobile={isMobile}
                  pageType="casino"
                />
                <SearchInput
                  txtSearch={txtSearch}
                  setTxtSearch={setTxtSearch}
                  searchRef={searchRef}
                  search={search}
                  isMobile={isMobile}
                />
              </div>
              {categories && categories.length > 0 && (
                <ProviderContainer
                  categories={categories}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  onProviderSelect={handleProviderSelect}
                />
              )}
            </div>

            {gameLaunchError && (
              <div className="alert alert-danger d-flex justify-content-between align-items-center m-2" role="alert">
                <span>{gameLaunchError}</span>
                <i className="fas fa-times cursor-pointer" onClick={() => setGameLaunchError("")}></i>
              </div>
            )}
          </div>
          <div className="slots-main-desktop__content-container">
            <div className="provider-section-desktop">
              {selectedProvider || isSingleCategoryView ? (
                <>
                  <div className="provider-section-desktop__header">
                    <div className="provider-section-desktop__header-img-container">
                      <div className="provider-section-desktop__header-img-top">
                        <span className="provider-section-desktop__header-provider-text">{activeCategory?.name}</span>
                      </div>
                      <div className="provider-section-desktop__header-line"></div>
                    </div>
                  </div>
                  <div className="provider-section-desktop__games-container">
                    {
                      games.length > 0 &&
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
                      )
                      )
                    }
                  </div>
                    {games.length > 0 && (
                      <div className="text-center">
                        <a className="carousel-arrows__title mx-auto w-fit" onClick={loadMoreGames}>
                          <span className="carousel-arrows__title-text">VER MÁS {isLoadingGames && <LoadApi />}</span>
                        </a>
                      </div>
                    )}
                </>
              ) : (
                <>
                  {isSingleCategoryView ? (
                    <div className="provider-section-desktop__games-container">
                      {
                        games.length > 0 &&
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
                        )
                        )
                      }

                      {games.length > 0 && (
                        <div className="text-center">
                          <a className="carousel-arrows__title mx-auto w-fit" onClick={loadMoreGames}>
                            <span className="carousel-arrows__title-text">VER MÁS {isLoadingGames && <LoadApi />}</span>
                          </a>
                        </div>
                      )}
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
          </div>
        </div>
      )}
    </>
  );
};

export default Casino;