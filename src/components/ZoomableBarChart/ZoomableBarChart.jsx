import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ZoomableBarChart = () => {
  const data = [
    { date: "1 / 1 / 1000", profitLoss: +100 },
    { date: "1 / 2 / 1000", profitLoss: -100 },
    { date: "3 / 1 / 1000", profitLoss: +10 },
  ];
  return (
    <div className="w-[50dvw] h-[90dvh] place-content-center">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="profitLoss">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.profitLoss >= 0 ? "#82ca9d" : "#ff6b6b"}
              />
            ))}
          </Bar>
          <Brush dataKey="date" height={30} stroke="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ZoomableBarChart;
