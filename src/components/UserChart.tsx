import { useEffect, useMemo, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // 初期スクロールを右端に
  useEffect(() => {
    if (window.innerWidth <= 600 && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [chartData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: false,
        },
        datalabels: {
          display: false,
        },
        zoom: {
          pan: {
            enabled: window.innerWidth > 600,
            mode: "x" as const,
          },
          zoom: {
            wheel: {
              enabled: window.innerWidth > 600,
            },
            pinch: {
              enabled: window.innerWidth > 600,
            },
            mode: "x" as const,
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
          position: "left" as const,
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
          position: "right" as const,
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
    }),
    []
  );

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div ref={scrollRef} style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default UserChart;
