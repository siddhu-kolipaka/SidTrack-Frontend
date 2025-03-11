import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "@/store/tracker/trackerThunks";
import DatePicker from "@/components/DatePicker/Datepicker";
import { motion } from "motion/react";
import Spinner from "@/components/Spinner/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import { LucideTrash } from "lucide-react";
import TrackerChart from "@/components/TrackerChart/TrackerChart";
import convertDate from "@/utils/convertDate";

const Tracker = () => {
  const initialState = {
    type: "Expense",
    amount: "",
    note: "",
    category: "Select Category",
  };
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.tracker);
  const [date, setDate] = useState(new Date());
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(endOfDay);

  const incomeCategories = [
    "Salary",
    "Stocks",
    "Freelance",
    "Investments",
    "Rental Income",
    "Business",
    "Savings",
    "Gifts",
    "Other Income",
  ];

  const expenseCategories = [
    "Food",
    "Clothes",
    "Transportation",
    "Utilities",
    "Rent",
    "Healthcare",
    "Education",
    "Entertainment",
    "Other Expenses",
  ];

  useEffect(() => {
    toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(
      getTransactions({ from: convertDate(fromDate), to: convertDate(toDate) })
    )
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        toast.error("Failed to fetch transactions");
      });
  }, [dispatch, fromDate, toDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.type === "" ||
      formData.category === "Select Category" ||
      !formData.amount ||
      !formData.note ||
      !date
    )
      return toast.error("Please fill all fields");

    try {
      const result = await dispatch(
        addTransaction({ formData, date: convertDate(date) })
      );

      await dispatch(getTransactions({ from: fromDate, to: toDate }));

      if (result.meta.requestStatus === "fulfilled") {
        setFormData(initialState);
        setDate(new Date());
        toast.success(result.payload.message);
      } else {
        const errorMsg = result.payload || "Adding failed. Please try again.";
        console.error(errorMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="w-full h-fit md:h-[100dvh]  bg-back">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          className="md:w-fit"
        />
        <div className="flex flex-col md:flex-row gap-4 h-full py-[10dvh] px-4 ">
          <motion.div className="flex flex-col md:w-[35%] gap-4 order-2 md:order-1">
            {/* income chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full h-1/2  rounded-xl place-content-center place-items-center  md:hover:shadow-2xl md:hover:scale-100 md:scale-95  duration-150"
            >
              <TrackerChart
                data={data}
                categories={incomeCategories}
                fill="#02e054"
                type="Income"
              />
            </motion.div>
            {/* expense chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full h-1/2  rounded-xl place-content-center place-items-center  md:hover:shadow-2xl md:hover:scale-100 md:scale-95  duration-150"
            >
              <TrackerChart
                data={data}
                categories={expenseCategories}
                fill="#DC2626"
                type="Expense"
              />
            </motion.div>
          </motion.div>

          {/* entry */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="md:w-[30%] border-2 border-border   flex flex-col justify-center gap-8 items-center rounded-xl order-1 md:order-2 py-8 "
          >
            <div className="text-3xl font-bold text-center text-txt">
              Tracker
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4">
              <select
                id="type"
                name="type"
                className="border border-border bg-transparent outline-none p-2 rounded-lg text-txt cursor-pointer focus:outline-none "
                value={formData.type}
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                }}
              >
                <option
                  value="Expense"
                  className="bg-back text-txt cursor-pointer p-2 outline-none  "
                >
                  Expense
                </option>
                <option
                  value="Income"
                  className="bg-back text-txt cursor-pointer p-2 outline-none  "
                >
                  Income
                </option>
              </select>

              <select
                id="category"
                name="category"
                className="border border-border bg-transparent outline-none p-2 rounded-lg text-txt cursor-pointer focus:outline-none "
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                }}
              >
                <option
                  value=""
                  className="bg-back text-txt cursor-pointer p-2 outline-none"
                >
                  Select Category
                </option>
                {formData.type === "Expense"
                  ? expenseCategories.map((category, index) => (
                      <option
                        key={`expense-${index}`}
                        value={category}
                        className="bg-back text-txt cursor-pointer p-2"
                      >
                        {category}
                      </option>
                    ))
                  : incomeCategories.map((category, index) => (
                      <option
                        key={`income-${index}`}
                        value={category}
                        className="bg-back text-txt cursor-pointer p-2"
                      >
                        {category}
                      </option>
                    ))}
              </select>

              <input
                type="number"
                placeholder="Amount in ₹"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="border border-border bg-transparent focus:outline-none p-2 rounded-lg text-txt"
              />
              <DatePicker date={date} setDate={setDate} />
              <textarea
                placeholder="Note"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="border border-border bg-transparent focus:outline-none p-2 rounded-lg text-txt resize-none"
                rows="4"
              ></textarea>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="submit"
                className="text-pri ring-1 ring-pri hover:bg-pri hover:text-back hover:scale-110 duration-200 rounded-xl w-full h-12 "
                disabled={loading}
              >
                {loading ? <Spinner /> : "Add Transaction"}
              </motion.button>
            </form>
          </motion.div>
          {/* current month log */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="md:w-[35%]  h-full   rounded-xl  order-3 "
          >
            <div className="grid grid-cols-[0.5fr,1fr] md:grid-cols-[0.5fr,1fr,0.5fr,1fr] place-content-center justify-items-center place-items-center gap-2 h-[10%] rounded-xl p-6 bg-back text-txt font-semibold">
              <div>From:</div>
              <DatePicker date={fromDate} setDate={setFromDate} />
              <div> To:</div>
              <DatePicker date={toDate} setDate={setToDate} />
            </div>
            <div className="w-full grid grid-cols-[1fr,1fr,1fr,1fr,0.2fr] justify-items-center place-items-center text-xs md:text-sm py-4  bg-pri text-back font-semibold rounded-xl">
              <div>DATE</div>
              <div>TYPE</div>
              <div>CATEGORY</div>
              <div>AMOUNT</div>
            </div>
            <div className="overflow-scroll h-[80%] w-full">
              <Accordion
                type="single"
                collapsible
                className="w-full rounded-xl"
              >
                {data?.length > 0 ? (
                  data.map((tx) => (
                    <AccordionItem
                      key={tx._id}
                      value={String(tx._id)}
                      className="w-full text-xs md:text-sm text-txt "
                    >
                      <AccordionTrigger className="w-full grid grid-cols-[1fr,1fr,1fr,1fr,0.2fr] justify-items-center place-items-center rounded-xl">
                        <div>
                          {new Date(tx.date).toLocaleDateString("en-IN")}
                        </div>
                        <div
                          className={
                            tx.type === "Income" ? "text-pri" : "text-brightRed"
                          }
                        >
                          {tx.type}
                        </div>
                        <div>{tx.category}</div>
                        <div
                          className={
                            tx.type === "Income" ? "text-pri" : "text-brightRed"
                          }
                        >
                          <div>&#8377;{tx.amount}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className=" grid grid-cols-3 justify-items-center place-items-center">
                          <div className="col-span-2 break-words w-40 md:w-60">
                            {tx.note}
                          </div>
                          <button
                            className="flex items-center text-sm text-destructive hover:text-destructive-dark"
                            onClick={async () => {
                              const result = await dispatch(
                                deleteTransaction({
                                  _id: tx._id,
                                  from: convertDate(fromDate),
                                  to: convertDate(toDate),
                                })
                              );
                              if (result.meta.requestStatus === "fulfilled") {
                                toast.success(result.payload.message);
                              } else {
                                const errorMsg =
                                  result.payload ||
                                  "Deleting failed. Please try again.";
                                console.error(errorMsg);
                              }
                            }}
                          >
                            <LucideTrash className="size-4" />
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="w-full h-full grid place-content-center text-txt py-4">
                    No transactions found for this date range.
                  </div>
                )}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Tracker;
