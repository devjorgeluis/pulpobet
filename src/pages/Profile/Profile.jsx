import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";

import ImgDarkChevronDown from "/src/assets/svg/chevron-down-dark-mode.svg";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = () => {
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
        }).toString();
        let apiEndpoint = `/get-transactions?${queryParams}`;

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                } else {
                    setTransactions([]);
                }
                setLoading(false);
            },
            null
        );
    };

    const formatBalance = (value) => {
        const num = value > 0 ? parseFloat(value) : Math.abs(value);
        if (isNaN(num)) return "";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    return (
        <div className="pagecontainer not-huge-container mt-2">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="lateral-menu is-responsive">
                            <div
                                className={`menu-toggler${isMenuOpen ? " is-open" : ""}`}
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                            >
                                <a className="menu-toggler-btnicon">
                                    <span className="menu-toggler-menubar"></span>
                                    <span className="menu-toggler-menubar"></span>
                                    <span className="menu-toggler-menubar"></span>
                                </a>

                                <span className="ms-3">Menú</span>

                                <div className="menu-toggler-chevron ms-auto">
                                    <picture>
                                        <img
                                            className="image image-dark"
                                            src={ImgDarkChevronDown}
                                            alt=""
                                        />
                                    </picture>
                                </div>
                            </div>

                            <div className={`menu-wrapper my-2 my-lg-0${isMenuOpen ? " is-open" : ""}`}>
                                <nav className="menu">
                                    <a
                                        className="menu-item is-active"
                                    >
                                        Mi cuenta
                                    </a>

                                    <a
                                        className="menu-item"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/profile-transaction");
                                        }}
                                    >
                                        Transacciones
                                    </a>

                                    <a
                                        className="menu-item"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/profile-history");
                                        }}
                                    >
                                        Historial de cuenta
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="box mb-5">
                                    <div className="mb-5">
                                        <div className="h4 mb-1">
                                            Saldo Actual
                                        </div>

                                        <div className="h3">
                                            $ {formatBalance(contextData?.session?.user?.balance)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="table-wrapper">
                                    <div className="table-caption d-flex justify-content-between align-items-center">
                                        <div className="h4">Transacciones</div>

                                        <div>
                                            <a
                                                className="btn outline-orange btn-block btn-regular"
                                                onClick={() => navigate("/profile-transaction")}
                                            >
                                                Ver todo
                                            </a>
                                        </div>
                                    </div>

                                    <table className="table" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>ID</th>
                                                <th>Monto</th>
                                                <th>Balance Previo</th>
                                                <th>Balance Posterior</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td className="text-center" colSpan={5}>
                                                        <div className="flex items-center justify-center my-4">
                                                            <LoadApi />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : transactions.length > 0 ? (
                                                transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{formatDateDisplay(transaction.created_at)}</td>
                                                        <td>{transaction.id}</td>
                                                        <td>${formatBalance(transaction.amount)}</td>
                                                        <td>${formatBalance(transaction.to_current_balance)}</td>
                                                        <td>${formatBalance(transaction.to_new_balance)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center">
                                                        Sin transacciones
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
