import DatePicker from "../components/DatePicker";
import ZoomableLineChart from "../components/LineChart";
import TransactionLog from "../components/TransactionLog";
import {
  fetchTransactions,
  deleteTransaction,
  downloadTransactionLog,
} from "../utils/api";
import { useState, useEffect } from "react";

const StockTransactionLog = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const { transactions, chartData } = await fetchTransactions(
      fromDate,
      toDate
    );
    setTransactions(transactions);
    setChartData(chartData);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  const handleDownload = async () => {
    const data = await downloadTransactionLog();
    const url = URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transaction_log.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  return (
    <div>
      <h1>Stock Transaction Log</h1>
      <div className="flex space-x-4">
        <DatePicker onChange={setFromDate} selectedDate={fromDate} />
        <DatePicker onChange={setToDate} selectedDate={toDate} />
      </div>
      <ZoomableLineChart data={chartData} />
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white p-2 my-4"
      >
        Download Excel
      </button>
      <TransactionLog transactions={transactions} onDelete={handleDelete} />
    </div>
  );
};

export default StockTransactionLog;
