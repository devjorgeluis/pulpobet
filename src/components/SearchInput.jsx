import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";

const SearchInput = ({ pageData }) => {
    const [txtSearch, setTxtSearch] = useState("");
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();

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
        }

        if (e.key === "Escape" || e.keyCode === 27) {
            setSearchResults([]);
            searchRef.current?.blur();
        }
    };

    const performSearchWithDelay = (keyword) => {
        clearTimeout(searchDelayTimer);

        if (keyword.trim() === "") {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            performSearch(keyword);
        }, 1000);

        setSearchDelayTimer(timer);
    };

    const performSearch = (keyword) => {
        if (keyword.trim() === "") {
            setSearchResults([]);
            return;
        }

        setTxtSearch(keyword.trim());
        setIsSearching(true);

        if (!pageData.page_group_code) return;

        callApi(
            contextData,
            "GET",
            "/search-content?keyword=" +
            encodeURIComponent(keyword.trim()) +
            "&page_group_code=" +
            pageData.page_group_code +
            "&length=30",
            callbackSearch,
            null,
        );
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

    const handleResultClick = (game) => {
        setSearchResults([]);
        setTxtSearch("");
    };

    const handleClickOutside = (event) => {
        if (resultsRef.current && !resultsRef.current.contains(event.target) && searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="header-search-wrapper" ref={resultsRef}>
            <input
                ref={searchRef}
                className="headertop-bottom-sidemenu-input"
                type="text"
                name="slots-search"
                placeholder="Buscar juego"
                onChange={(event) => {
                    setTxtSearch(event.target.value);
                }}
                onKeyUp={search}
                value={txtSearch}
            />

            {searchResults.length > 0 && (
                <div className="header-search" style={{ top: "100%", position: "absolute", zIndex: 1000 }}>
                    <div className="header-search-content">
                        <div className="header-search-result-block">
                            <div className="header-search-result-text">
                                <strong>{searchResults.length} resultados</strong> encontrados para "{txtSearch}"
                            </div>

                            <div className="header-search-results">
                                {searchResults.slice(0, 6).map((game) => (
                                    <div key={game.id} className="game-card">
                                        <a
                                            className="gc-container"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleResultClick(game);
                                            }}
                                        >
                                            <div className="gc-card">
                                                <div className="gc-card-image">
                                                    <img
                                                        className="image"
                                                        src={game.imageDataSrc}
                                                        alt={game.name}
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="gc-hover">
                                                    <div className="gc-hover-button-wrapper">
                                                        <button className="btn purple btn-block btn-regular">
                                                            Jugar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="gc-name">{game.name}</p>
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {searchResults.length > 6 && (
                                <a className="header-search-seeallresults" href="#">
                                    Ver todos los resultados ({searchResults.length})
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInput;