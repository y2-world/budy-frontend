import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type WeightChartProps = {
  data?: any[]; // ← ? をつけることで省略可能になる
};

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>体重管理</h1>
      <BottomNav currentTab="weight" onTabChange={() => {}} />
    </div>
  );
};

export default WeightChart;
