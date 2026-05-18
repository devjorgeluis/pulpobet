import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const ProfileTransaction = () => {
    const { contextData } = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
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

    return (
        <div className="pay-history-desktop">
            <section className="pay-history-desktop__main">
                <div className="pay-history-desktop__content-container">
                    <div className="pay-history-desktop__content">
                        {loading ? (
                            <div className="pay-history-desktop__empty">Cargando...</div>
                        ) : transactions.length > 0 ? (
                            <div className="pay-history-desktop__list">
                                {transactions.map((txn) => (
                                    <div key={txn.id} className="pay-history-item-desktop">
                                        <div className="pay-history-item-desktop__item">
                                            <div className="pay-history-item-desktop__title">Fecha</div>
                                            <div className="pay-history-item-desktop__description pay-history-item-desktop__description_date">
                                                {formatDateDisplay(txn.created_at || txn.created_at_formatted)}
                                            </div>
                                        </div>
                                        <div className="pay-history-item-desktop__item">
                                            <div className="pay-history-item-desktop__title">Id</div>
                                            <div className="pay-history-item-desktop__description">
                                                {txn.id}
                                            </div>
                                        </div>
                                        <div className="pay-history-item-desktop__item">
                                            <div className="pay-history-item-desktop__title">Monto</div>
                                            <div className="pay-history-item-desktop__description">
                                                {formatBalance(txn.value ?? txn.amount)}
                                            </div>
                                        </div>
                                        <div className="pay-history-item-desktop__item">
                                            <div className="pay-history-item-desktop__title">Balance Previo</div>
                                            <div className={`pay-history-item-desktop__date-number`}>
                                                {formatBalance(txn.to_current_balance)}
                                            </div>
                                        </div>
                                        <div className="pay-history-item-desktop__item">
                                            <div className="pay-history-item-desktop__title">Balance Posterior</div>
                                            <div className={`pay-history-item-desktop__date-number`}>
                                                {formatBalance(txn.to_new_balance)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="pay-history-desktop__empty">El historial de operaciones está vacío</div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="pay-history-desktop__paginator">
                            <div className="paginator-desktop">
                                <div className="paginator-desktop__main">
                                    {pagination.currentPage > 1 && (
                                        <>
                                            <div
                                                className="paginator-desktop__item"
                                                onClick={handleFirstPage}
                                            >
                                                <span className="paginator-desktop__item-value paginator-desktop__item-value_first">
                                                    «
                                                </span>
                                            </div>
                                            <div
                                                className="paginator-desktop__item"
                                                onClick={handlePrevPage}
                                            >
                                                <span className="paginator-desktop__item-value">
                                                    ‹
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {visiblePages.map((page) => (
                                        <div
                                            key={page}
                                            className={`paginator-desktop__item ${page === pagination.currentPage ? "paginator-desktop__item_current" : ""}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            <span className={`paginator-desktop__item-value ${page === pagination.currentPage ? "paginator-desktop__item-value_current" : ""}`}>
                                                {page}
                                            </span>
                                        </div>
                                    ))}

                                    {pagination.currentPage < totalPages && (
                                        <>
                                            <div
                                                className="paginator-desktop__item"
                                                onClick={handleNextPage}
                                            >
                                                <span className="paginator-desktop__item-value">
                                                    ›
                                                </span>
                                            </div>
                                            <div
                                                className="paginator-desktop__item"
                                                onClick={handleLastPage}
                                            >
                                                <span className="paginator-desktop__item-value paginator-desktop__item-value_last">
                                                    »
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfileTransaction;