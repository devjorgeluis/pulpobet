import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgSearch from "/src/assets/svg/search-icon-mobile-dark-mode.svg";
import ImgCasino from "/src/assets/img/mobile-casino.png";
import ImgUser from "/src/assets/svg/user-icon-dark-mode.svg";

const MobileFooter = ({ isSlotsOnly }) => {
    const navigate = useNavigate();

    return (
        <div className="headerbottom logged-in">
            <a className="headerbottom-btnicon">
                <span className="headerbottom-menubar"></span>
                <span className="headerbottom-menubar"></span>
                <span className="headerbottom-menubar"></span>
            </a>

            <a className="headerbottom-btnicon">
                <picture>
                    <img
                        className="image image-dark"
                        src={ImgSearch}
                        alt="Buscar"
                    />
                </picture>
            </a>

            <a className="headerbottom-btnicon">
                <img
                    src={ImgCasino}
                    alt="Slots"
                    style={{
                        width: "35px",
                        paddingLeft: "5px",
                    }}
                />
            </a>

            <a className="headerbottom-btnicon">
                <picture>
                    <img
                        className="image image-dark"
                        src={ImgUser}
                        alt="Usuario"
                    />
                </picture>
            </a>
        </div>
    )
};

export default MobileFooter;