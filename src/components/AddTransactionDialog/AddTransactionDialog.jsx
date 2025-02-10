import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Input from "../Input/Input";
import { useDispatch } from "react-redux";
import { addTransaction } from "@/store/stock/stockThunks";
import DatePicker from "../DatePicker/Datepicker";
import { toast } from "react-toastify";
import { LucideX } from "lucide-react";
import convertDate from "@/utils/convertDate";

const AddTransactionDialog = () => {
  const [stockSymbol, setstockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [action, setAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!stockSymbol) return setErrorMessage("Enter stock name");
      if (!quantity || quantity <= 0)
        return setErrorMessage("Enter a valid quantity");
      if (!price || price <= 0) return setErrorMessage("Enter a valid price");
      if (!action) return setErrorMessage("Select an action (BUY or SELL)");

      const response = await dispatch(
        addTransaction({
          stockSymbol,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          action,
          date: convertDate(date),
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message);
      } else {
        toast.error(response.payload);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message);
    }
    setstockSymbol("");
    setQuantity("");
    setPrice("");
    setErrorMessage("");
  };

  useEffect(() => {
    setErrorMessage("");
  }, [stockSymbol, quantity, price, action, date]);

  const [open, setOpen] = useState(false);

  return (
    <div className="flex ">
      <div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="text-back bg-pri rounded-lg uppercase font-bold py-4 px-4 md:px-8 text-xs"
          onClick={() => setOpen(true)}
        >
          Buy / Sell
        </motion.button>
      </div>
      {open && (
        <div className="fixed z-[100] w-[100dvw] h-[100dvh] top-0 left-0 bg-black/80 flex justify-center items-center ">
          <div className="w-[100dvw] md:w-[25dvw] p-4 bg-back rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="text-red-600 text-center">
                Refer to Yahoo Finance for correct stock symbol
              </div>
              <LucideX
                className="text-txt size-6 hover:bg-pri rounded-xl cursor-pointer hover:text-back"
                onClick={() => {
                  setOpen(false);
                  setstockSymbol("");
                  setQuantity(0);
                  setPrice(0);
                  setErrorMessage("");
                }}
              />
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="text-txt flex flex-col h-[60dvh] justify-evenly">
                <div>
                  <label
                    htmlFor="stockSymbol"
                    className="block text-sm  font-medium mb-1"
                  >
                    Stock Symbol
                  </label>
                  <Input
                    color1="#282829"
                    color2="#4CAF50"
                    className="rounded-lg p-px"
                  >
                    <input
                      id="stockSymbol"
                      name="stockSymbol"
                      type="text"
                      className="rounded-lg focus:outline-none w-full h-10 px-4 bg-back uppercase "
                      value={stockSymbol}
                      onChange={(e) => {
                        setstockSymbol(e.target.value.toUpperCase());
                      }}
                      placeholder="stock.ns / stock.bo"
                    />
                  </Input>
                </div>

                <div>
                  <label
                    htmlFor="qty"
                    className="block text-sm font-medium my-1"
                  >
                    Quantity
                  </label>
                  <Input
                    color1="#282829"
                    color2="#4CAF50"
                    className="rounded-lg p-px"
                  >
                    <input
                      id="qty"
                      name="qty"
                      type="number"
                      className="rounded-lg focus:outline-none w-full h-10 px-4 bg-back "
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                    />
                  </Input>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium my-1"
                  >
                    Price
                  </label>
                  <Input
                    color1="#282829"
                    color2="#4CAF50"
                    className="rounded-lg p-px"
                  >
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      className="rounded-lg focus:outline-none w-full h-10 px-4 bg-back "
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                    />
                  </Input>
                </div>
                <div className="flex items-center justify-center gap-2 h-16 ">
                  <label
                    htmlFor="DatePicker"
                    className="block text-sm font-medium my-1 "
                  >
                    Date
                  </label>
                  <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="flex items-center justify-evenly h-16">
                  <div>
                    <input
                      id="buy"
                      type="radio"
                      name="action"
                      value="BUY"
                      className="hidden peer"
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <label
                      htmlFor="buy"
                      className="cursor-pointer px-4 py-2 rounded-lg font-medium text-txt border border-border bg-back peer-checked:bg-green-600 peer-checked:text-back transition"
                    >
                      BUY
                    </label>
                  </div>
                  <div>
                    <input
                      id="sell"
                      type="radio"
                      name="action"
                      value="SELL"
                      className="hidden peer"
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <label
                      htmlFor="sell"
                      className="cursor-pointer px-4 py-2 rounded-lg font-medium text-txt border border-border bg-back peer-checked:bg-red-600 peer-checked:text-back transition"
                    >
                      SELL
                    </label>
                  </div>
                </div>

                <p
                  className={`text-red-500 text-sm h-[1.25rem] text-center ${
                    errorMessage ? "visible" : "invisible"
                  }`}
                >
                  {errorMessage}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-back bg-pri py-2 px-6 rounded-lg"
                  type="submit"
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTransactionDialog;
