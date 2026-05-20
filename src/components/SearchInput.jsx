import React, { useRef } from "react";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search
}) => {
    return (
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
    );
};

export default SearchInput;