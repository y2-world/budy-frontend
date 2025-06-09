import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type Props = {
  userEmail: string;
};

type RecordEntry = {
  date: string;
  weight?: number;
  bodyFat?: number;
  timestamp?: string;
};

function UserChart({ userEmail }: Props) {
  const [chartData, setChartData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // 👈 ref を追加

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("records") || "{}");
    const userRecords = storedRecords[userEmail] || {};

    const latestByDate: { [date: string]: RecordEntry } = {};

    Object.values(userRecords).forEach((entry: any) => {
      const { date, weight, bodyFat, timestamp } = entry;

      if (!latestByDate[date]) {
        if (weight !== undefined || bodyFat !== undefined) {
          latestByDate[date] = { date, weight, bodyFat, timestamp };
        }
      } else {
        if (
          (weight !== undefined || bodyFat !== undefined) &&
          new Date(timestamp).getTime() >
            new Date(latestByDate[date].timestamp ?? "").getTime()
        ) {
          latestByDate[date] = { date, weight, bodyFat, timestamp };
        }
      }
    });

    const stored = Object.values(latestByDate)
      .filter((entry) => entry.weight !== undefined && entry.weight !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dates = stored.map((entry) => entry.date);
    const weights = stored.map((entry) => entry.weight ?? null);
    const bodyFats = stored.map((entry) => entry.bodyFat ?? null);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "体重 (kg)",
          data: weights,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          yAxisID: "y1",
          tension: 0.3,
        },
        {
          label: "体脂肪率 (%)",
          data: bodyFats,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          yAxisID: "y2",
          tension: 0.3,
        },
      ],
    });
  }, [userEmail]);

  // 👇 スマホ表示なら初期スクロールを右端に
  useEffect(() => {
    if (window.innerWidth <= 600 && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [chartData]);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div
      ref={scrollRef}
      style={{ overflowX: "auto", width: "100%" }}
    >
      <div style={{ width: 1000, maxWidth: "1000px", margin: "0 auto", height: 440 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "体重と体脂肪率の推移",
              },
            },
            scales: {
              y1: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "体重 (kg)",
                },
                ticks: {
                  stepSize: 1,
                },
              },
              y2: {
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "体脂肪率 (%)",
                },
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default UserChart;