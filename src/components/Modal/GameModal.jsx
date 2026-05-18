import { useState, useEffect, useContext, useRef } from "react";
import { NavigationContext } from "../Layout/NavigationContext";

const GameModal = (props) => {
  const modalRef = useRef(null);
  const iframeRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setShowFullDivLoading } = useContext(NavigationContext);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        const container = document.getElementsByClassName(
          "game-view-container",
        )[0];
        if (container) container.classList.remove("d-none");
        setUrl(props.gameUrl);
        // Make the game window visible
        const gameWindow = document.getElementsByClassName("game-window")[0];
        if (gameWindow) gameWindow.classList.remove("d-none");
      }
    }
  }, [props.gameUrl, props.isMobile]);

  // Cleanup when the modal unmounts
  useEffect(() => {
    return () => {
      exitBrowserFullscreen();
      const el = document.getElementsByClassName("game-view-container")[0];
      if (el) {
        el.classList.add("d-none");
        el.classList.remove("fullscreen");
        el.classList.remove("with-background");
      }
      const gameWindow = document.getElementsByClassName("game-window")[0];
      if (gameWindow) gameWindow.classList.add("d-none");
      setUrl(null);
      setIframeLoaded(false);
      setIsFullscreen(false);
    };
  }, []);

  const exitBrowserFullscreen = () => {
    if (
      document.fullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  const toggleFullScreen = () => {
    const element = modalRef.current || iframeRef.current;
    const container = modalRef.current;
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      if (container) container.classList.add("fullscreen");
      setIsFullscreen(true);
    } else {
      exitBrowserFullscreen();
      if (container) container.classList.remove("fullscreen");
      setIsFullscreen(false);
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
      const container = modalRef.current;
      if (container) container.classList.remove("fullscreen");
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const handleIframeLoad = () => {
    if (url != null) {
      if (iframeRef.current) iframeRef.current.classList.remove("d-none");
      setIframeLoaded(true);
      setShowFullDivLoading(false);
    }
  };

  const handleIframeError = () => {
    setIframeLoaded(false);
  };

  const internalClose = () => {
    exitBrowserFullscreen();
    setIsFullscreen(false);
    const container = modalRef.current;
    if (container) container.classList.remove("fullscreen");
    setUrl(null);
    setIframeLoaded(false);
    if (typeof props.onClose === "function") props.onClose();
  };

  return (
    <>
      <div className="holds-the-iframe" ref={modalRef}>
        <div className="game-modal-controls d-flex justify-content-end gap-2 p-2">
          <div
            type="button"
            className="expand-button text-center p-2 px-3"
            onClick={toggleFullScreen}
          >
            {isFullscreen ? (
              <span>
                <i className="fas fa-compress-alt"></i>
              </span>
            ) : (
              <span>
                <i className="fas fa-expand-alt"></i>
              </span>
            )}
          </div>
          <div
            type="button"
            className="expand-button text-center p-2 px-3"
            onClick={internalClose}
          >
            <span>
              <i className="fas fa-times"></i>
            </span>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          allow="camera;microphone;fullscreen *"
          src={url}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          id="game-iframe"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </>
  );
};

export default GameModal;
