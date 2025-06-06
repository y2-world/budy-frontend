import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type TimeLineProps = {
  data?: any[]; // ← ? をつけることで省略可能になる
};

const TimeLine: React.FC<TimeLineProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>TIME LINE</h1>
      <BottomNav currentTab="timeline" onTabChange={() => {}} />
    </div>
  );
};

export default TimeLine;