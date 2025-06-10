import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
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
  Legend,
  ChartDataLabels,
  zoomPlugin
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
  <div ref={scrollRef} style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ minWidth: "800px", height: "300px" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 12,
                  },
                },
              },
              title: {
                display: false, // モバイルでは非表示の方が見やすい
              },
              datalabels: {
                display: (context) => {
                  // データ数が多いときは省略
                  return !!(context.chart.data && context.chart.data.labels && context.chart.data.labels.length <= 7);
                },
                color: "#000",
                font: {
                  weight: "bold",
                  size: 10,
                },
                align: "top",
                formatter: function (value: number) {
                  return value !== null ? value.toFixed(1) : "";
                },
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: "x",
                },
                zoom: {
                  pinch: {
                    enabled: true,
                  },
                  wheel: {
                    enabled: true,
                  },
                  mode: "x",
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  autoSkip: true,
                  maxRotation: 0,
                  font: {
                    size: 10,
                  },
                },
              },
              y1: {
                position: "left",
                title: {
                  display: true,
                  text: "体重 (kg)",
                  font: {
                    size: 12,
                  },
                },
                ticks: {
                  stepSize: 1,
                  font: {
                    size: 10,
                  },
                },
              },
              y2: {
                position: "right",
                title: {
                  display: true,
                  text: "体脂肪率 (%)",
                  font: {
                    size: 12,
                  },
                },
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  stepSize: 1,
                  font: {
                    size: 10,
                  },
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
