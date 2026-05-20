import { useNavigate } from "react-router-dom";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();

    return (
        <div className="footer">
            <div className="footer-inner">
                <div className="footer-base">
                    <div className="footer-navs">
                        <nav className="footer-nav">
                            <p className="footer-nav-title">Productos</p>

                            <ul className="footer-nav-list">
                                <li className="footer-nav-list-item">
                                    <a className="footer-nav-link" onClick={() => navigate("/")}>
                                        Inicio
                                    </a>
                                </li>

                                <li className="footer-nav-list-item">
                                    <a
                                        className="footer-nav-link"
                                        onClick={() => navigate("/casino")}
                                    >
                                        Casino
                                    </a>
                                </li>

                                {
                                    isSlotsOnly === "false" && <>
                                        <li className="footer-nav-list-item">
                                            <a
                                                className="footer-nav-link"
                                                onClick={() => navigate("/live-casino")}
                                            >
                                                Casino En Vivo
                                            </a>
                                        </li>

                                        <li className="footer-nav-list-item">
                                            <a
                                                className="footer-nav-link"
                                                onClick={() => navigate("/sports")}
                                            >
                                                Deportes
                                            </a>
                                        </li>

                                        <li className="footer-nav-list-item">
                                            <a
                                                className="footer-nav-link"
                                                onClick={() => navigate("/live-sports")}
                                            >
                                                En Vivo
                                            </a>
                                        </li>
                                    </>
                                }
                            </ul>
                        </nav>
                    </div>
                </div>

                <hr className="footer-line" />

                <div className="footer-bottom">
                    <div className="footer-bottom-text seotext">
                        <p className="copyright-year">
                            Copyright © 2023 Pulpobet.club. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;