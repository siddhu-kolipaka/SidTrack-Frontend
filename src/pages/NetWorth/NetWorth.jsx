import { motion } from "motion/react";
import { useState, useEffect } from "react";
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
import {
  deleteWealth,
  getWealth,
  updateWealth,
} from "@/store/wealth/wealthThunks";
import convertDate from "@/utils/convertDate.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-border bg-back text-txt p-4 rounded-xl">
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Date:</div>
          <div>
            {new Date(payload[0].payload.date).toLocaleDateString("en-IN")}
          </div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Wealth:</div>
          <div>&#8377;{payload[0].payload.wealth}</div>
        </div>
        {/* <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>10% SIP:</div>
          <div>&#8377;{payload[0].payload.ten}</div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>20% SIP:</div>
          <div>&#8377;{payload[0].payload.twenty}</div>
        </div> */}
      </div>
    );
  }
  return null;
};

const NetWorth = () => {
  const [date, setDate] = useState(new Date());
  const [wealth, setWealth] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWealth());
  }, [dispatch]);

  const { data, loading } = useSelector((state) => state.wealth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!wealth) {
        toast.error("Enter wealth!");
        return;
      }
      const response = await dispatch(
        updateWealth({ date: convertDate(date), wealth })
      );

      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message);
      } else {
        toast.error(response.payload.message);
      }
    } catch (err) {
      toast.error("Some error occured");
      console.error(err);
    }
    setDate(new Date());
    setWealth("");
  };

  return (
    <div className="w-full h-full bg-back  px-4 grid place-content-center place-items-center gap-8 ">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        className="md:w-fit"
      />
      <div className="uppercase text-txt text-3xl font-bold w-full text-center">
        Net Worth Progression
      </div>

      <div className="w-full h-[50dvh] ">
        {data?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 0,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <Tooltip content={CustomTooltip} />
              <Legend />
              <Brush height={30} fill="#1E1E1E" stroke="#02e054" />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="wealth"
                stroke="#02e054"
                fill="#02e054"
              />

              {/* <Area
                yAxisId="left"
                type="monotone"
                dataKey="10% SIP"
                stroke="#E53935"
                fill="#E53935"
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="20% SIP"
                stroke="#43A047"
                fill="#43A047"
              /> */}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="uppercase w-full h-full grid place-content-center text-center text-txt text-2xl border border-border rounded-xl ">
            No data to display chart. Add wealth.
          </div>
        )}
      </div>

      <div className="text-txt flex flex-col gap-2  rounded-xl justify-center items-center ">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-fit flex flex-col md:flex-row gap-4  p-2 rounded-xl justify-center items-center "
        >
          <div className="uppercase whitespace-nowrap">Add Wealth Update</div>
          <DatePicker date={date} setDate={setDate} className={"w-full"} />
          <input
            type="number"
            placeholder="Wealth in rupees"
            value={wealth}
            onChange={(e) => setWealth(e.target.value)}
            className="w-full md:w-fit rounded-xl focus:outline-none border border-border  text-txt px-4 bg-back h-10"
          />
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="rounded-xl  w-full h-10 md:px-10 py-2 text-pri ring-1 ring-pri    uppercase "
            disabled={loading}
          >
            Update
          </motion.button>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl  w-full h-10 md:px-10 py-2  uppercase  text-brightRed ring-1 ring-brightRed "
            disabled={loading}
            onClick={() => {
              dispatch(deleteWealth({ date: convertDate(date) }));
            }}
          >
            Delete
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default NetWorth;
