import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import IconLogout from "/src/assets/svg/logout.svg";
import IconUserCircle from "/src/assets/svg/user-circle.svg";
import ImgPhone from "/src/assets/svg/phone.svg";
import IconHistory from "/src/assets/svg/history.svg";
import IconTransaction from "/src/assets/svg/transaction.svg";

const UserMenu = ({ handleLogoutClick, supportParent, openSupportModal, onCloseMenu }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="user-block__menu">
            <div className="user-block__menu-top">
                <div className="user-block__menu-top-user">
                    <div>
                        <div className="user-block__menu-top-user-id">ID: {contextData.session.user.id}</div>
                        <div className="user-block__menu-top-user-username">{contextData.session.user.username}</div>
                    </div>
                </div>
                <div className="user-block__menu-top-balance">
                    <div className="user-block__menu-top-balance-text">Saldo:</div>
                    <div className="user-block__menu-top-balance-amount">$ {parseFloat(contextData.session.user.balance).toFixed(2) || '0.00'}</div>
                </div>
            </div>
            <a className="user-block__menu-item" onClick={() => { onCloseMenu?.(); }}>
                <span className="user-block__menu-item-icon">
                    <span className="SVGInline SVG-component__content">
                        <img src={IconUserCircle} />
                    </span>
                </span>
                <div className="user-block__menu-item-title">Mi cuenta</div>
            </a>
            <a className="user-block__menu-item" onClick={() => { onCloseMenu?.(); }}>
                <span className="user-block__menu-item-icon">
                    <span className="SVGInline SVG-component__content">
                        <img src={IconHistory} />
                    </span>
                </span>
                <div className="user-block__menu-item-title">Historial del Juego</div>
            </a>
            <a className="user-block__menu-item" onClick={() => { onCloseMenu?.(); }}>
                <span className="user-block__menu-item-icon">
                    <span className="SVGInline SVG-component__content">
                        <img src={IconTransaction} />
                    </span>
                </span>
                <div className="user-block__menu-item-title">Transacciones</div>
            </a>
            {
                supportParent && <a className="user-block__menu-item" onClick={() => openSupportModal(true)}>
                    <span className="user-block__menu-item-icon">
                        <span className="SVGInline SVG-component__content">
                            <img src={ImgPhone} width={24} height={24} />
                        </span>
                    </span>
                    <div className="user-block__menu-item-title">Contactá a Tu Cajero</div>
                </a>
            }
        </div>
    );
};

export default UserMenu;