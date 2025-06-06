import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type WeightChartProps = {
  data: { date: string; weight: number }[];
};

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>体重管理</h1>
      <BottomNav />
    </div>
  );
};

export default WeightChart;
