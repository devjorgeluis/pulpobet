import ImgLoading from "/src/assets/img/loading-spinner.gif";

const LoadApi = () => {
  return (
    <img src={ImgLoading} alt="Loading..." className="ms-2" width={20} height={20} />
  );
};

export default LoadApi;
