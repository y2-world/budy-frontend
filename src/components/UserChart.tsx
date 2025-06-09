import { useEffect, useState } from "react";
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

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("records") || "{}");
    const userRecords = storedRecords[userEmail] || {};

    const latestByDate: { [date: string]: RecordEntry } = {};

    Object.values(userRecords).forEach((entry: any) => {
      const { date, weight, bodyFat, timestamp } = entry;
      if (
        !latestByDate[date] ||
        new Date(timestamp).getTime() >
          new Date(latestByDate[date].timestamp ?? "").getTime()
      ) {
        latestByDate[date] = { date, weight, bodyFat, timestamp };
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

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div style={{ width: "80%", maxWidth: "1000px", margin: "0 auto" }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
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
            },
          },
        }}
      />
    </div>
  );
}

export default UserChart;
