import AddTransactionDialog from "@/components/AddTransactionDialog/AddTransactionDialog";
import Holdings from "@/components/Holdings/Holdings";
import PortfolioChart from "@/components/PortfolioChart/PortfolioChart";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "@/store/stock/stockThunks";
import Loading from "../Loading/Loading";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const Portfolio = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  let totalGain = 0;
  let totalInvestment = 0;
  let totalDayGain = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { portfolioData, loading } = useSelector((state) => state.stock);

  let data = [];

  if (portfolioData && portfolioData.length > 0) {
    data = portfolioData.map((item) => {
      const totalWorth = item.stocks.reduce((total, stock) => {
        return total + stock.worth;
      }, 0);

      const totalQty = item.stocks.reduce((total, stock) => {
        return total + stock.qty;
      }, 0);

      const avgPrice =
        totalQty > 0
          ? item.stocks.reduce((total, stock) => {
              return total + stock.investment;
            }, 0) / totalQty
          : 0;

      totalGain += item.stocks.reduce((total, stock) => {
        return stock.gain;
      }, 0);
      totalInvestment += item.stocks.reduce((total, stock) => {
        return stock.investment;
      }, 0);
      totalDayGain += item.stocks.reduce((total, stock) => {
        return (stock.currentPrice - stock.previousClosePrice) * stock.qty;
      }, 0);

      return {
        stockSymbol: item._id,
        worth: totalWorth,
        totalQty: totalQty,
        avgPrice: avgPrice,
      };
    });
  }

  useEffect(() => {
    dispatch(getPortfolio());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full min-h-[100dvh] py-[10dvh] h-fit bg-back md:px-4 flex flex-col md:flex-row">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          className="md:w-fit"
        />
        {loading ? (
          <Spinner />
        ) : (
          <div
            className={`w-[100dvw] md:w-[40dvw] h-[80dvh] md:sticky md:top-[10dvh] 
               flex flex-col items-center justify-evenly gap-4  `}
          >
            <div className="text-txt text-3xl font-bold text-center uppercase">
              Portfolio
            </div>

            {data && data.length > 0 ? (
              <div className="w-full md:w-[40dvw] h-[40dvh] md:h-[60dvh]">
                <PortfolioChart
                  data={data}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
            ) : (
              <div className="text-xl h-[60dvh] grid place-content-center text-txt m-8 p-8 rounded-2xl uppercase">
                No data available. Add new transaction.
              </div>
            )}
            <div className="w-full grid grid-cols-[1fr,0.8fr,1.2fr,1.2fr] text-sm text-pri  text-center md:pt-8">
              <div>
                Stock
                <div className="text-txt">{data[activeIndex]?.stockSymbol}</div>
              </div>
              <div>
                Total Qty
                <div className="text-txt">{data[activeIndex]?.totalQty}</div>
              </div>
              <div>
                Bought @
                <div className="text-txt">
                  ₹{data[activeIndex]?.avgPrice.toFixed(2)} on avg.
                </div>
              </div>
              <div>
                Worth
                <div className="text-txt">
                  ₹{data[activeIndex]?.worth.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center gap-8 md:gap-16  text-sm ">
              <div className="uppercase text-center">
                <div className="text-pri ">Day Gain</div>
                <div
                  className={`${
                    totalDayGain > 0 ? "text-green-600" : "text-red-600 "
                  }`}
                >
                  {totalDayGain > 0 ? "+" : "-"}₹
                  {Math.abs(totalDayGain).toFixed(2)}
                </div>
              </div>
              <div className="uppercase text-center">
                <div className="text-pri ">Total Gain</div>
                <div
                  className={`${
                    totalGain > 0 ? "text-green-600" : "text-red-600 "
                  }`}
                >
                  {totalGain > 0 ? "+" : "-"}₹{Math.abs(totalGain).toFixed(2)}
                </div>
              </div>
              <div className="uppercase text-center">
                <div className="text-pri ">Total Invested</div>
                <div className="text-txt">₹{totalInvestment.toFixed(2)}</div>
              </div>
            </div>
            <div className="w-full flex gap-2 md:gap-8 justify-center">
              <div className="flex justify-center items-center">
                <AddTransactionDialog />
              </div>
              <div className="flex justify-center items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-back bg-pri rounded-lg uppercase font-bold py-4 px-4 md:px-8 text-xs"
                  onClick={() => {
                    navigate("/transactionLog");
                  }}
                >
                  Transaction Log
                </motion.button>
              </div>
              <div className="flex justify-center items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-back bg-pri rounded-lg uppercase font-bold py-4 px-4 md:px-8 text-xs"
                >
                  Profit and Loss Log
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {portfolioData && portfolioData.length > 0 && (
          <div className="w-[100dvw] md:w-[60dvw] mb-2 ">
            <Holdings data={portfolioData} setActiveIndex={setActiveIndex} />
          </div>
        )}
      </div>
    </>
  );
};

export default Portfolio;
