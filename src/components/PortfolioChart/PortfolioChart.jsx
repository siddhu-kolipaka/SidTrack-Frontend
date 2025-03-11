import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { motion } from "motion/react";

const generateColors = (num) => {
  const hueStep = 360 / num;
  return Array.from({ length: num }).map(
    (_, index) => `hsl(${hueStep * index}, 90%, 60%)`
  );
};

const renderActiveShape = (props, isSmallScreen, data, activeIndex) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const outerRadiusOffset = isSmallScreen ? 5 : 10;
  const outerRadiusExtension = isSmallScreen ? 15 : 30;
  const textOffset = isSmallScreen ? 10 : 22;

  const sx = cx + (outerRadius + outerRadiusOffset) * cos;
  const sy = cy + (outerRadius + outerRadiusOffset) * sin;
  const mx = cx + (outerRadius + outerRadiusExtension) * cos;
  const my = cy + (outerRadius + outerRadiusExtension) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * textOffset;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {data[activeIndex].totalQty} | {data[activeIndex].stockSymbol}
      </text>

      <motion.g
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, type: "spring" }}
      >
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + outerRadiusOffset + 2}
          fill={fill}
          stroke={fill}
          strokeWidth={2}
        />
      </motion.g>
      {!isSmallScreen && (
        <>
          <motion.path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx={ex}
            cy={ey}
            r={2}
            fill={fill}
            stroke="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * textOffset}
            y={ey}
            textAnchor={textAnchor}
            fill={fill}
          >{`₹${value.toFixed(2)}`}</text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * textOffset}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
          >
            {`( ${(percent * 100).toFixed(2)}% )`}
          </text>
        </>
      )}
    </g>
  );
};

const PortfolioChart = ({ data, setActiveIndex, activeIndex }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onPieEnter = (entry, index) => {
    setActiveIndex(index);
  };

  const colors = generateColors(data.length);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={(props) =>
              renderActiveShape(props, isSmallScreen, data, activeIndex)
            }
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={!isSmallScreen ? 100 : 80}
            outerRadius={!isSmallScreen ? 140 : 120}
            fill="#8884d8"
            dataKey="worth"
            nameKey="stockSymbol"
            onMouseEnter={onPieEnter}
            stroke="#1E1E1E"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default PortfolioChart;
