const VerifyAgeModal = ({ isOpen, onConfirm }) => {

    if (!isOpen) return null;

    return (
        <app-modal className="dark">
            <div className="modal is-visible">
                <div className="modal-box">
                    <h3>Este sitio está prohibido para menores de edad.</h3>
                    <p>Declaro ser mayor de 18 años de edad.</p>
                    <div className="button-container">
                        <div className="custom-button d-block" style={{ width: "100%" }}>
                            <button
                                type="button"
                                className="btn green btn-block btn-regular"
                                onClick={() => onConfirm()}
                            >
                                <span>Si</span>
                            </button>
                        </div>
                        <div className="custom-button d-block" style={{ width: "100%" }}>
                            <a
                                type="button"
                                className="btn purple btn-block btn-regular"
                                href="https://google.com"
                            >
                                <span>No</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </app-modal>
    );
};

export default VerifyAgeModal;