import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`
          ${
            payload[0].payload.type === "Income" ? "text-pri" : "text-brightRed"
          }
         bg-back border border-border rounded-lg py-2 px-4 `}
      >
        <p>{label}</p>
        <p>{payload[0].value}</p>
      </div>
    );
  }

  return null;
};

const TrackerChart = ({ data, categories, fill, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-txt">No data available for this date range.</div>
    );
  }

  const aggregatedData = categories.map((category) => {
    const categoryData = data.filter((item) => item.category === category);
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

    return {
      type,
      category,
      total,
    };
  });

  const total = aggregatedData.reduce((sum, item) => sum + item.total, 0);

  if (total === 0) {
    return (
      <div className="text-txt">
        {type === "Income" ? "Income Chart" : "Expense Chart"}
      </div>
    );
  }

  return (
    <>
      <div className={type === "Income" ? "text-pri" : "text-brightRed"}>
        Total {type} : {total}
      </div>
      <div className="w-full h-[40dvh] md:w-[33dvw] md:h-[35dvh]">
        <ResponsiveContainer>
          <BarChart
            data={aggregatedData}
            layout="vertical"
            margin={{ left: 25, right: 25, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="0.5 5" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="category"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill={fill} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default TrackerChart;
