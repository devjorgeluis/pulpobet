import ImgLoading from "/src/assets/img/loading-spinner.gif";

const LoadApi = () => {
  return (
    <img src={ImgLoading} alt="Loading..." className="ms-2" width={30} height={30} />
  );
};

export default LoadApi;
