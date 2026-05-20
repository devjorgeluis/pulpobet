import { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import LoadApi from "../components/Loading/LoadApi";
import "/src/css/casino.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const Search = () => {
  const { contextData } = useContext(AppContext);
  const { setShowFullDivLoading, setIsGameModalOpen } =
    useContext(NavigationContext);
  const { isLogin, isMobile, handleLoginClick } = useOutletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [pageGroupCode, setPageGroupCode] = useState(
    searchParams.get("page_group_code") || "",
  );
  const [games, setGames] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);

  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();

  const searchDelayTimerRef = useRef(null);
  const searchApiLength = 1000;

  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
    setPageGroupCode(searchParams.get("page_group_code") || "");
  }, [searchParams]);

  useEffect(() => {
    if (pageGroupCode) return;

    callApi(
      contextData,
      "GET",
      "/get-page?page=home",
      (result) => {
        const code = result?.data?.page_group_code || "";
        if (!code) return;
        setPageGroupCode(code);
        const next = new URLSearchParams(searchParams);
        next.set("page_group_code", code);
        setSearchParams(next, { replace: true });
      },
      null,
    );
  }, [contextData, pageGroupCode, searchParams, setSearchParams]);

  const performSearch = (nextKeyword, nextPageGroupCode) => {
    const cleanKeyword = (nextKeyword || "").trim();
    if (!cleanKeyword || !nextPageGroupCode) {
      setGames([]);
      setIsSearching(false);
      setHasResponse(false);
      return;
    }

    setIsSearching(true);
    setHasResponse(false);
    const apiUrl =
      "/search-content?keyword=" +
      encodeURIComponent(cleanKeyword) +
      "&page_group_code=" +
      encodeURIComponent(nextPageGroupCode) +
      "&length=" +
      searchApiLength;

    callApi(
      contextData,
      "GET",
      apiUrl,
      (result) => {
        setIsSearching(false);
        setHasResponse(true);
        if (result?.status === 500 || result?.status === 422) {
          setGames([]);
          return;
        }

        const content = result?.content || [];
        const gamesWithImages = content.map((game) => ({
          ...game,
          imageDataSrc:
            game.image_local !== null
              ? contextData.cdnUrl + game.image_local
              : game.image_url,
        }));
        setGames(gamesWithImages);
      },
      null,
    );
  };

  useEffect(() => {
    const clean = (searchParams.get("keyword") || "").trim();
    const effectivePageGroupCode =
      searchParams.get("page_group_code") || pageGroupCode;

    if (!clean || !effectivePageGroupCode) {
      setGames([]);
      setIsSearching(false);
      setHasResponse(false);
      return;
    }

    performSearch(clean, effectivePageGroupCode);
  }, [searchParams, pageGroupCode]);

  useEffect(() => {
    return () => {
      if (searchDelayTimerRef.current) clearTimeout(searchDelayTimerRef.current);
    };
  }, []);

  const updateKeyword = (value) => {
    setKeyword(value);
    if (searchDelayTimerRef.current) clearTimeout(searchDelayTimerRef.current);

    searchDelayTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const trimmed = value.trim();
      if (trimmed) {
        next.set("keyword", trimmed);
      } else {
        next.delete("keyword");
      }
      if (pageGroupCode) {
        next.set("page_group_code", pageGroupCode);
      }
      setSearchParams(next, { replace: true });
    }, 400);
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
      (result) => {
        setShowFullDivLoading(false);
        if (result?.status === "0") {
          if (selectedGameLauncher === "modal" || selectedGameLauncher === "tab") {
            setGameUrl(result.url);
          }
        } else {
          closeGameModal();
        }
      },
      null,
    );
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
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ""),
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            } else if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ""),
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            }
          }}
          launchInNewTab={() => {
            if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, ""),
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
        <div className="page">
          <div className="wrapper dark">
            <main className="header-search-content">
              {(keyword || "").trim() !== "" && isSearching && (
                <div className="header-search-result-text">
                  <LoadApi />
                </div>
              )}

              {(keyword || "").trim() !== "" && hasResponse && !isSearching && (
                <div className="header-search-result-text">
                  {games.length === 0 ? (
                    "Ningún resultado encontrado"
                  ) : (
                    <>
                      <strong>{games.length} resultados</strong> encontrados para "
                      {(keyword || "").trim()}"
                    </>
                  )}
                </div>
              )}

              <div className="header-search-results">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    title={game.name}
                    imageSrc={game.imageDataSrc}
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
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
