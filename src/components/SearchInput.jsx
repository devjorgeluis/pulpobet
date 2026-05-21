import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import GameCard from "./GameCard";
import { NavigationContext } from "./Layout/NavigationContext";

const SearchInput = ({ pageData, isLogin, handleLoginClick }) => {
    const [txtSearch, setTxtSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchPageLoading, setIsSearchPageLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [overlayTop, setOverlayTop] = useState("72px");
    const [resolvedPageGroupCode, setResolvedPageGroupCode] = useState(null);
    const searchRef = useRef(null);
    const wrapperRef = useRef(null);

    const getHeaderHeight = (callback) => {
        const header = document.querySelector(".headertop-wrapper");
        if (!header) {
            callback(null);
            return;
        }

        requestAnimationFrame(() => {
            const height = Math.round(header.getBoundingClientRect().height);
            callback(height);
        });
    };

    const updateOverlayTop = () => {
        getHeaderHeight((headerHeight) => {
            if (headerHeight !== null && headerHeight > 0) {
                setOverlayTop(`${headerHeight}px`);
                return;
            }

            const rect = searchRef.current?.getBoundingClientRect();
            if (!rect) return;
            setOverlayTop(`${Math.round(rect.bottom)}px`);
        });
    };
    const searchDelayTimerRef = useRef(null);
    const searchNavigationDelayTimerRef = useRef(null);
    const { contextData } = useContext(AppContext);
    const { openHeaderGameModal } = useContext(NavigationContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const searchApiLength = 1000;
    const defaultVisibleResults = 10;
    const isSearchPage = location.pathname === "/search";
    const isInputLoading = isSearchPage ? isSearchPageLoading : isSearching;

    useEffect(() => {
        const onSearchLoading = (event) => {
            if (!isSearchPage) return;
            setIsSearchPageLoading(Boolean(event?.detail));
        };

        window.addEventListener("search:loading", onSearchLoading);
        return () => window.removeEventListener("search:loading", onSearchLoading);
    }, [isSearchPage]);

    const resetSearchInput = () => {
        setTxtSearch("");
        setSearchResults([]);
        setIsSearching(false);
        setIsOpen(false);
        if (searchDelayTimerRef.current) clearTimeout(searchDelayTimerRef.current);
        if (searchNavigationDelayTimerRef.current) clearTimeout(searchNavigationDelayTimerRef.current);
        document.body.classList.remove("has-search-open");
        searchRef.current?.blur();
    };

    const pageCode = useMemo(() => {
        if (location.pathname === "/" || location.pathname === "/home") {
            return "home";
        }

        if (location.pathname === "/casino") {
            const hash = (location.hash || "").replace("#", "").trim();
            return hash || "casino";
        }

        if (location.pathname === "/live-casino") {
            return "livecasino";
        }

        return "casino";
    }, [location.pathname, location.hash]);

    useEffect(() => {
        resetSearchInput();
    }, [location.pathname]);

    useEffect(() => {
        const pageGroupCodeFromProps = pageData?.page_group_code || null;
        if (pageGroupCodeFromProps) {
            setResolvedPageGroupCode(pageGroupCodeFromProps);
            return;
        }

        callApi(
            contextData,
            "GET",
            `/get-page?page=${pageCode}`,
            (result) => {
                setResolvedPageGroupCode(result?.data?.page_group_code || null);
            },
            null,
        );
    }, [contextData, pageCode, pageData?.page_group_code]);

    useEffect(() => {
        updateOverlayTop();
        const handleResize = () => updateOverlayTop();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("has-search-open");
        } else {
            document.body.classList.remove("has-search-open");
        }

        return () => document.body.classList.remove("has-search-open");
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (searchDelayTimerRef.current) clearTimeout(searchDelayTimerRef.current);
            if (searchNavigationDelayTimerRef.current) clearTimeout(searchNavigationDelayTimerRef.current);
        };
    }, []);

    const performSearchWithDelay = (keyword) => {
        if (searchDelayTimerRef.current) clearTimeout(searchDelayTimerRef.current);

        if (keyword.trim() === "") {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setSearchResults([]);
        setIsSearching(true);
        searchDelayTimerRef.current = setTimeout(() => {
            performSearch(keyword);
        }, 600);
    };

    const performSearch = (keyword) => {
        const cleanKeyword = keyword.trim();
        if (cleanKeyword === "") {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        let apiUrl = "/search-content?keyword=" + encodeURIComponent(cleanKeyword);
        if (resolvedPageGroupCode) {
            apiUrl += "&page_group_code=" + resolvedPageGroupCode;
        }
        apiUrl += "&length=" + searchApiLength;

        callApi(contextData, "GET", apiUrl, callbackSearch, null);
    };

    const callbackSearch = (result) => {
        setIsSearching(false);
        if (result.status === 500 || result.status === 422) {
            setSearchResults([]);
        } else {
            const content = result.content || [];
            const gamesWithImages = content.map((game) => ({
                ...game,
                imageDataSrc:
                    game.image_local !== null
                        ? contextData.cdnUrl + game.image_local
                        : game.image_url,
            }));
            setSearchResults(gamesWithImages);
        }
    };

    const launchGame = (game) => {
        closeSearch();
        openHeaderGameModal?.(game);
    };

    const closeSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            closeSearch();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isSearchPage) return;
        const keyword = searchParams.get("keyword") || "";
        setTxtSearch(keyword);
        closeSearch();
        setIsSearchPageLoading(false);
    }, [isSearchPage, searchParams]);

    const handleInputChange = (value) => {
        setTxtSearch(value);

        if (isSearchPage) {
            closeSearch();
            setIsSearchPageLoading(value.trim() !== "");
            if (searchNavigationDelayTimerRef.current) clearTimeout(searchNavigationDelayTimerRef.current);
            searchNavigationDelayTimerRef.current = setTimeout(() => {
                const next = new URLSearchParams(searchParams);
                const trimmed = value.trim();
                if (trimmed) {
                    next.set("keyword", trimmed);
                } else {
                    next.delete("keyword");
                }
                if (resolvedPageGroupCode) {
                    next.set("page_group_code", resolvedPageGroupCode);
                }
                setSearchParams(next, { replace: true });
            }, 350);
            return;
        }

        if (value.trim() === "") {
            closeSearch();
            return;
        }

        setIsOpen(true);
        updateOverlayTop();
        performSearchWithDelay(value);
    };

    const showSearchResults = !isSearchPage && isOpen && (isSearching || searchResults.length > 0);

    const handleKeyUp = (e) => {
        if (isSearchPage) {
            if (e.key === "Escape" || e.keyCode === 27) {
                setTxtSearch("");
                closeSearch();
                const next = new URLSearchParams(searchParams);
                next.delete("keyword");
                if (resolvedPageGroupCode) {
                    next.set("page_group_code", resolvedPageGroupCode);
                }
                setSearchParams(next, { replace: true });
                searchRef.current?.blur();
            }
            return;
        }

        if (e.key === "Enter" || e.keyCode === 13) {
            performSearch(txtSearch);
            return;
        }

        if (e.key === "Escape" || e.keyCode === 27) {
            setTxtSearch("");
            closeSearch();
            searchRef.current?.blur();
        }
    };

    return (
        <>
            <div className="header-search-wrapper" ref={wrapperRef}>
                {(
                    <div className="desktop-search-container">
                        <input
                            ref={searchRef}
                            className={`headertop-bottom-sidemenu-input${isInputLoading ? " is-loading" : ""}`}
                            type="text"
                            name="slots-search"
                            placeholder="Buscar juego"
                            onChange={(event) => {
                                handleInputChange(event.target.value);
                            }}
                            onKeyUp={handleKeyUp}
                            onFocus={() => {
                                if (txtSearch.trim() !== "") {
                                    if (!isSearchPage) {
                                        setIsOpen(true);
                                        updateOverlayTop();
                                        performSearchWithDelay(txtSearch);
                                    }
                                }
                            }}
                            value={txtSearch}
                        />
                    </div>
                )}

                <div
                    id="header-search"
                    className="header-search"
                    style={{ top: overlayTop }}
                >
                    <div className="header-search-content">
                        <div className="header-search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Buscar juego"
                                className={`header-search-input${isInputLoading ? " is-loading" : ""}`}
                                value={txtSearch}
                                onChange={(event) => {
                                    handleInputChange(event.target.value);
                                }}
                                onKeyUp={handleKeyUp}
                                onFocus={() => {
                                    if (txtSearch.trim() !== "") {
                                        if (!isSearchPage) {
                                            setIsOpen(true);
                                            updateOverlayTop();
                                            performSearchWithDelay(txtSearch);
                                        }
                                    }
                                }}
                            />
                        </div>

                        {showSearchResults && (
                            <div className="header-search-result-block">
                                <div className="header-search-result-text">
                                    <strong>{searchResults.length} resultados</strong> encontrados para "{txtSearch}"
                                </div>

                                <div className="header-search-results">
                                    {searchResults.slice(0, defaultVisibleResults).map((game) => (
                                        <div key={game.id} className="gc-container">
                                            <GameCard
                                                id={game.id}
                                                title={game.name}
                                                imageSrc={game.imageDataSrc}
                                                game={game}
                                                onGameClick={() => {
                                                    if (isLogin) {
                                                        launchGame(game);
                                                    } else {
                                                        handleLoginClick && handleLoginClick();
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {searchResults.length > defaultVisibleResults && (
                                    <a
                                        className="header-search-seeallresults"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const trimmed = txtSearch.trim();
                                            if (trimmed === "") return;

                                            const params = new URLSearchParams();
                                            params.set("keyword", trimmed);
                                            if (resolvedPageGroupCode) {
                                                params.set("page_group_code", resolvedPageGroupCode);
                                            }
                                            closeSearch();
                                            searchRef.current?.blur();
                                            navigate(`/search?${params.toString()}`);
                                        }}
                                    >
                                        Ver todos los resultados ({searchResults.length})
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default SearchInput;
