import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import DatePicker from "@/components/DatePicker/Datepicker";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteGains, getGains } from "@/store/gains/gainsThunks";
import convertDate from "@/utils/convertDate";
import { LucideTrash2 } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { date, totalGain } = payload[0].payload;
    return (
      <div className="w-fit border border-border bg-back text-txt p-4 rounded-xl">
        <div className=" grid justify-items-center place-items-center grid-cols-2 gap-4">
          <div>Date:</div>
          <div>{date}</div>
        </div>
        <div className=" grid justify-items-center place-items-center grid-cols-2 gap-4">
          <div>Net Total:</div>
          <div className={totalGain < 0 ? "text-brightRed" : "text-pri"}>
            {totalGain < 0 ? "-" : "+"}&#8377;{Math.abs(totalGain)}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const PnL = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(endOfDay);
  const [hoveredData, setHoveredData] = useState(null);
  const [records, setRecords] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await dispatch(
          getGains({
            from: convertDate(fromDate),
            to: convertDate(toDate),
          })
        );
      } catch (error) {
        console.error("Error in fetching gains:", error);
        toast.error("Failed to load gains.");
      }
    })();
  }, [dispatch, fromDate, toDate]);
  const { data } = useSelector((state) => state.gains);
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      Gain: item.totalGain >= 0 ? item.totalGain : 0,
      Loss: item.totalGain < 0 ? item.totalGain : 0,
      date: new Date(item.date).toLocaleDateString("en-IN"),
    }));
  }, [data]);
  return (
    <div className="w-full min-h-[110dvh] bg-back px-4 py-[10dvh] flex flex-col items-center">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        className="md:w-fit"
      />
      <div className="uppercase text-txt text-2xl font-semibold w-full text-center">
        Profit and Loss
      </div>
      <div className="w-fit  grid justify-items-center place-items-center grid-cols-2 md:grid-cols-4  gap-2 py-4 text-txt">
        <div>From:</div>
        <DatePicker date={fromDate} setDate={setFromDate} />
        <div>To:</div>
        <DatePicker date={toDate} setDate={setToDate} />
      </div>
      <div className="w-full h-[50dvh]">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              onMouseMove={(state) => {
                if (
                  state &&
                  state.activePayload &&
                  state.activePayload.length
                ) {
                  const currentPayload = state.activePayload[0].payload;
                  setHoveredData(currentPayload);
                  setRecords(currentPayload.records || []);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <Tooltip content={CustomTooltip} />
              <Legend />
              <Brush height={30} fill="#1E1E1E" stroke="#02e054" />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Gain"
                stroke="#02e054"
                fill="#02e054"
                dot={{ stroke: "#02e054", strokeWidth: 2, fill: "#02e054" }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Loss"
                stroke="#ff0000"
                fill="#ff0000"
                dot={{ stroke: "#ff0000", strokeWidth: 2, fill: "#ff0000" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="uppercase w-full h-full  grid justify-items-center place-items-center place-content-center text-center text-txt text-2xl rounded-xl">
            No data to display chart. Add Gains.
          </div>
        )}
      </div>
      {hoveredData &&
        records &&
        Array.isArray(records) &&
        records.length > 0 && (
          <div className="w-full text-txt mt-4 flex flex-col items-center">
            <div className="w-full md:w-[50%]  grid justify-items-center place-items-center grid-cols-[0.5fr,1fr,0.5fr,1fr] md:grid-cols-[0.5fr,1fr,0.5fr,1fr,0.5fr,1fr,0.5fr,1fr]  p-2  border-b border-border">
              <div className="text-txt"> Date: </div>
              <div>
                {new Date(hoveredData.date).toLocaleDateString("en-IN")}
              </div>
              <div className="text-txt">Total: </div>
              <div>{hoveredData.totalGain}</div>
              <div className="text-pri">Gain:</div>
              <div> {hoveredData.Gain}</div>
              <div className="text-brightRed">Loss:</div>
              <div> {Math.abs(hoveredData.Loss)}</div>
            </div>
            <div className="w-full md:w-[50%]">
              <div className=" grid justify-items-center place-items-center grid-cols-4 gap-4 p-2 text-back bg-pri border-b border-border">
                <div>Stock</div>
                <div>Quantity</div>
                <div>P/L</div>
                <div>Delete</div>
              </div>
              {records.map((record, index) => (
                <div
                  key={`record-${index}`}
                  className=" grid justify-items-center place-items-center grid-cols-4 gap-4 p-2 border-b border-border"
                >
                  <div>{record.stockSymbol}</div>
                  <div>{record.qty}</div>
                  <div>{record.gain}</div>
                  <button
                    onClick={async () => {
                      try {
                        const deleteResponse = await dispatch(
                          deleteGains({ _id: record._id })
                        );
                        if (deleteResponse.meta.requestStatus === "fulfilled") {
                          toast.success("Deleted Successfully!");
                          await dispatch(
                            getGains({
                              from: convertDate(fromDate),
                              to: convertDate(toDate),
                            })
                          );
                          setHoveredData(null);
                          setRecords(null);
                        } else {
                          toast.error("Deletion failed.");
                        }
                      } catch (error) {
                        console.error("Error in deleting gain:", error);
                        toast.error("An error occurred during deletion.");
                      }
                    }}
                  >
                    <LucideTrash2 className="text-brightRed" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default PnL;
