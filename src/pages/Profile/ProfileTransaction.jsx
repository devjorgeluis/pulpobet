import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";

import ImgChevronLeft from "/src/assets/svg/chevron-left.svg";
import ImgChevronRight from "/src/assets/svg/chevron-right.svg";
import ImgChevronDoubleLeft from "/src/assets/svg/chevron-duo-left.svg";
import ImgChevronDoubleRight from "/src/assets/svg/chevron-duo-right.svg";

const ProfileTransaction = () => {
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
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

    const formatBalance = (value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const fetchHistory = () => {
        if (!contextData?.session) return;

        setLoading(true);

        const queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
        }).toString();

        callApi(
            contextData,
            "GET",
            `/get-transactions?${queryParams}`,
            (response) => {
                const isSuccess = response.status === "0" || response.status === 0;

                if (isSuccess) {
                    setTransactions(response.data || []);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }

                setLoading(false);
            },
            null
        );
    };

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);
    const handleLastPage = () => handlePageChange(totalPages);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const isFirstPage = pagination.currentPage === 1;
        const isLastPage = pagination.currentPage === totalPages;

        return (
            <div className="pg-paginator-container">
                <button
                    className="pg-button"
                    onClick={handleFirstPage}
                    dark-mode="true"
                    disabled={isFirstPage}
                >
                    <img
                        alt="First page"
                        className="pg-icon"
                        dark-mode="true"
                        src={ImgChevronDoubleLeft}
                    />
                </button>

                <button
                    className="pg-button"
                    onClick={handlePrevPage}
                    dark-mode="true"
                    disabled={isFirstPage}
                >
                    <img
                        alt="Previous page"
                        className="pg-icon"
                        dark-mode="true"
                        src={ImgChevronLeft}
                    />
                </button>

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        className={`pg-button ${pagination.currentPage === page ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                        dark-mode="true"
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="pg-button"
                    onClick={handleNextPage}
                    dark-mode="true"
                    disabled={isLastPage}
                >
                    <img
                        alt="Next page"
                        className="pg-icon"
                        dark-mode="true"
                        src={ImgChevronRight}
                    />
                </button>

                <button
                    className="pg-button"
                    onClick={handleLastPage}
                    dark-mode="true"
                    disabled={isLastPage}
                >
                    <img
                        alt="Last page"
                        className="pg-icon"
                        dark-mode="true"
                        src={ImgChevronDoubleRight}
                    />
                </button>
            </div>
        );
    };

    return (
        <div className="pagecontainer not-huge-container mt-2">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="lateral-menu is-responsive">
                            <div className="menu-toggler">
                                <a className="menu-toggler-btnicon">
                                    <span className="menu-toggler-menubar"></span>
                                    <span className="menu-toggler-menubar"></span>
                                    <span className="menu-toggler-menubar"></span>
                                </a>

                                <span className="ms-3">Menú</span>

                                <div className="menu-toggler-chevron ms-auto">
                                    <picture>
                                        <img
                                            className="image image-light"
                                            src="/assets/images/my-account/chevron-down.svg"
                                            alt=""
                                        />

                                        <img
                                            className="image image-dark"
                                            src="/assets/images/my-account/chevron-down-dark-mode.svg"
                                            alt=""
                                        />
                                    </picture>
                                </div>
                            </div>

                            <div className="menu-wrapper my-2 my-lg-0">
                                <nav className="menu">
                                    <a
                                        className="menu-item"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Mi cuenta
                                    </a>

                                    <a
                                        className="menu-item is-active"
                                    >
                                        Transacciones
                                    </a>

                                    <a
                                        className="menu-item"
                                        onClick={() => navigate("/profile-history")}
                                    >
                                        Historial de cuenta
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="extract-page">
                            <form>
                                <div className="row mb-4 show-dkp">
                                    <div className="col-12 col-md-6">
                                        <div className="h3">
                                            Transacciones
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="row">
                                <div className="col-12">
                                    <div className="bwtable">
                                        <table
                                            className="bwtable-table"
                                            cellSpacing="0"
                                            cellPadding="0"
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="text-bold">Fecha</th>
                                                    <th className="text-bold">ID</th>
                                                    <th className="text-bold">Monto</th>
                                                    <th className="text-bold">Balance Previo</th>
                                                    <th className="text-bold">Balance Posterior</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={5}>
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
                                                            <td>{formatBalance(transaction.amount)}</td>
                                                            <td>{formatBalance(transaction.to_current_balance)}</td>
                                                            <td>{formatBalance(transaction.to_new_balance)}</td>
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

                                    {totalPages > 1 && renderPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTransaction;