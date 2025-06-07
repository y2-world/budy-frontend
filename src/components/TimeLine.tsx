import Header from "./Header";
import Footer from "./Footer";

// Propsの型定義
type TimeLineProps = {
  // data?: any[]; // ← ? をつけることで省略可能になる
};

const TimeLine: React.FC<TimeLineProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <section className="user-stats">
        <div>TIME LINE</div>
      </section>
      <Footer currentTab="timeline" onTabChange={() => {}} />
    </div>
  );
};

export default TimeLine;