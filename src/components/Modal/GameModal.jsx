import { useState, useEffect, useContext, useRef } from "react";
import { NavigationContext } from "../Layout/NavigationContext";

const GameModal = (props) => {
  const modalRef = useRef(null);
  const iframeRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    if (!element) return;

    if (!isFullscreen) {
      const request =
        element.requestFullscreen?.() ||
        element.mozRequestFullScreen?.() ||
        element.webkitRequestFullscreen?.() ||
        element.msRequestFullscreen?.();

      if (request && typeof request.then === "function") {
        request.then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(true));
      } else {
        setIsFullscreen(true);
      }
    } else {
      exitBrowserFullscreen();
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
    }
  };

  const handleIframeError = () => {
    setIframeLoaded(false);
  };

  const internalClose = () => {
    exitBrowserFullscreen();
    setIsFullscreen(false);
    setUrl(null);
    setIframeLoaded(false);
    if (typeof props.onClose === "function") props.onClose();
  };

  return (
    <>
      <main className="game-main-container">
        <div className="inner expand">
          <section
            ref={modalRef}
            className={`the-game expand${isFullscreen ? " fullscreen" : ""}`}
            dark-mode="true"
          >
            <div className="gd-game-container">
              <iframe
                src={url}
                id="game-iframe"
                allowFullScreen
                allow="camera;microphone;fullscreen *; autoplay; payment; clipboard-read; clipboard-write"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{ display: iframeLoaded ? "block" : "none", border: "none" }}
              />
            </div>

            <div className="gd-game-config-panel">
              <div className="gd-game-views">
                {/* <span
                  title="Minimizar pantalla"
                  className="game-view shrink"
                  dark-mode="true"
                ></span> */}

                <span
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                  className="game-view full"
                  dark-mode="true"
                  onClick={toggleFullScreen}
                ></span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default GameModal;
