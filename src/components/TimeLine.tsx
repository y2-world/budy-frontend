import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type TimeLineProps = {
  data: { date: string; text: string }[];
};

const TimeLine: React.FC<TimeLineProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>TIME LINE</h1>
      <BottomNav />
    </div>
  );
};

export default TimeLine;