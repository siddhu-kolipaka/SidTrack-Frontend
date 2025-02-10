import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { LucideTrash } from "lucide-react";
import { motion } from "motion/react";
import DatePicker from "../DatePicker/Datepicker";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { deleteTransaction, getTransactions } from "@/store/stock/stockThunks";
import Spinner from "../Spinner/Spinner";
import convertDate from "@/utils/convertDate";

const TransactionLog = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(endOfDay);
  const dispatch = useDispatch();

  const { loading, transactions } = useSelector((state) => state.stock);

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

  return (
    <div className="w-full h-fit min-h-[100dvh] py-[10dvh] md:px-[10dvw] bg-back flex flex-col items-center">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        className="md:w-fit"
      />
      <div className="w-full text-txt md:w-[60dvw] gap-4">
        <div className="flex flex-col gap-2 w-full md:flex-row rounded-xl justify-evenly items-center py-6 px-4 md:px-0 bg-back text-txt font-semibold">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full flex items-center justify-between md:justify-center md:gap-2"
          >
            <div>From:</div>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full flex items-center justify-between md:justify-center md:gap-2"
          >
            <div>To:</div>
            <DatePicker date={toDate} setDate={setToDate} />
          </motion.div>
        </div>

        <div className="block md:hidden w-full font-semibold">
          {loading ? (
            <div className="text-center py-20">
              <div>Loading...</div>
              <Spinner />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20">
              <div>No transactions available in the log</div>
              <div>Make new transactions from the portfolio section</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr,1fr,1fr,1fr,0.2fr] w-full rounded-xl justify-items-center place-items-center text-sm py-4 bg-pri text-back font-semibold">
                <div>DATE</div>
                <div>STOCK</div>
                <div>QUANTITY</div>
                <div>ACTION</div>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {transactions.map((tx) => (
                  <AccordionItem
                    key={tx._id}
                    value={String(tx._id)}
                    className="text-xs md:text-sm "
                  >
                    <AccordionTrigger className="grid grid-cols-[1fr,1fr,1fr,1fr,0.2fr] justify-items-center place-items-center">
                      <div>{new Date(tx.date).toLocaleDateString("en-IN")}</div>
                      <div>{tx.stockSymbol}</div>
                      <div>{tx.qty}</div>
                      <div
                        className={
                          tx.action === "BUY"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {tx.action}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-full grid grid-cols-[1fr,1fr,1fr,1fr] pb-1 justify-items-center place-items-center text-pri">
                          <div>QTY</div>
                          <div>PRICE</div>
                          <div>WORTH</div>
                          <div>DELETE</div>
                        </div>
                        <div className="w-full grid grid-cols-[1fr,1fr,1fr,1fr] pb-1 justify-items-center place-items-center">
                          <div>{tx.qty}</div>
                          <div>&#8377;{parseFloat(tx.price).toFixed(2)}</div>
                          <div>
                            &#8377;{parseFloat(tx.price * tx.qty).toFixed(2)}
                          </div>
                          <button
                            className="flex items-center text-sm text-destructive hover:text-destructive-dark"
                            onClick={async () => {
                              try {
                                const result = await dispatch(
                                  deleteTransaction({ _id: tx._id })
                                );

                                if (result.meta.requestStatus === "fulfilled") {
                                  toast.success(result.payload.message);
                                } else {
                                  const errorMsg =
                                    result.payload ||
                                    "Deletion failed. Please try again.";
                                  console.error(errorMsg);
                                }
                              } catch (err) {
                                console.error(err);
                              }
                              await dispatch(
                                getTransactions({
                                  from: convertDate(fromDate),
                                  to: convertDate(toDate),
                                })
                              );
                            }}
                          >
                            <LucideTrash className="size-4" />
                          </button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </div>

        <div className="hidden md:block w-full font-semibold">
          <Table>
            <thead>
              <tr className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr] justify-items-center place-items-center py-4  bg-pri text-back rounded-xl">
                <th>DATE</th>
                <th>STOCK</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>WORTH</th>
                <th>ACTION</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={7} className="text-center py-20">
                    <div>Loading...</div>
                    <Spinner />
                  </td>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="text-center py-20">
                    <div>
                      <div>
                        No transactions available in the log for this date range
                      </div>
                      <div>
                        Make new transactions from the portfolio section
                      </div>
                    </div>
                  </td>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow
                    key={tx._id}
                    className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr] justify-items-center place-items-center text-xs md:text-sm px-2 py-4"
                  >
                    <td>{new Date(tx.date).toLocaleDateString("en-IN")}</td>
                    <td>{tx.stockSymbol}</td>
                    <td>&#8377;{parseFloat(tx.price).toFixed(2)}</td>
                    <td>{tx.qty}</td>
                    <td>&#8377;{parseFloat(tx.price * tx.qty).toFixed(2)}</td>
                    <td
                      className={
                        tx.action === "BUY" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {tx.action}
                    </td>
                    <td>
                      <button
                        className="flex items-center text-sm text-destructive hover:text-destructive-dark"
                        onClick={async () => {
                          try {
                            const result = await dispatch(
                              deleteTransaction({ _id: tx._id })
                            );

                            if (result.meta.requestStatus === "fulfilled") {
                              toast.success(result.payload.message);
                            } else {
                              const errorMsg =
                                result.payload ||
                                "Deletion failed. Please try again.";
                              console.error(errorMsg);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                          await dispatch(
                            getTransactions({
                              from: convertDate(fromDate),
                              to: convertDate(toDate),
                            })
                          );
                        }}
                      >
                        <LucideTrash className="size-4" />
                      </button>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionLog;
