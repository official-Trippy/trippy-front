import FallingContainer from "@/components/falling/FallingContainer";
import Header from "@/components/shared/header/Header";

const notificationPage = () => {
  return (
    <div>
      <Header />
      <FallingContainer />
      <div className="header flex justify-between items-center w-[66%] mx-auto relative">
        <h1 className="text-5xl">알림이 없습니다</h1>
      </div>
    </div>
  );
};

export default notificationPage;
