import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import Input from "@/components/Input/Input";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-border bg-back  text-txt p-4 rounded-xl">
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Time:</div>
          <div>{payload[0].payload.date}</div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Invested:</div>
          <div>&#8377;{payload[0].payload.invested}</div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Interest:</div>
          <div>&#8377;{payload[0].payload.interest}</div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Actual Total:</div>
          <div>&#8377;{payload[0].payload.totalNominalValue}</div>
        </div>
        <div className="grid grid-cols-[1fr,0.5fr] gap-4">
          <div>Inflation Adjusted Total:</div>
          <div>&#8377;{payload[0].payload.totalRealValue}</div>
        </div>
      </div>
    );
  }
  return null;
};

const InvestmentCalc = () => {
  const [initialDeposit, setInitialDeposit] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [annualInflationRate, setAnnualInflationRate] = useState("");
  const [compoundingFrequency, setCompoundingFrequency] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [fdData, setFdData] = useState([]);

  const [sipDeposit, setSipDeposit] = useState("");
  const [sipAnnualInterestRate, setSipAnnualInterestRate] = useState("");
  const [sipAnnualInflationRate, setSipAnnualInflationRate] = useState("");
  const [sipCompoundingFrequency, setSipCompoundingFrequency] = useState("");
  const [sipTimePeriod, setSipTimePeriod] = useState("");
  const [sipData, setSipData] = useState([]);

  const handleInitialDepositChange = (e) => setInitialDeposit(e.target.value);
  const handleAnnualInterestRateChange = (e) =>
    setAnnualInterestRate(e.target.value);
  const handleAnnualInflationRateChange = (e) =>
    setAnnualInflationRate(e.target.value);
  const handleCompoundingFrequencyChange = (e) =>
    setCompoundingFrequency(e.target.value);
  const handleTimePeriodChange = (e) => setTimePeriod(e.target.value);

  const handleSipDepositChange = (e) => setSipDeposit(e.target.value);
  const handleSipAnnualInterestRateChange = (e) =>
    setSipAnnualInterestRate(e.target.value);
  const handleSipAnnualInflationRateChange = (e) =>
    setSipAnnualInflationRate(e.target.value);
  const handleSipCompoundingFrequencyChange = (e) =>
    setSipCompoundingFrequency(e.target.value);
  const handleSipTimePeriodChange = (e) => setSipTimePeriod(e.target.value);

  // FD Calculation
  useEffect(() => {
    const calculateFdData = () => {
      const P = parseFloat(initialDeposit);
      const r = parseFloat(annualInterestRate) / 100;
      const rInf = parseFloat(annualInflationRate) / 100;
      const t = parseFloat(timePeriod);
      const compFreq = compoundingFrequency;

      if (
        isNaN(P) ||
        isNaN(r) ||
        isNaN(rInf) ||
        isNaN(t) ||
        !compFreq ||
        P <= 0 ||
        r <= 0 ||
        rInf < 0 ||
        t <= 0
      ) {
        setFdData([]);
        return;
      }

      const rReal = (1 + r) / (1 + rInf) - 1;

      let n;
      switch (compFreq) {
        case "monthly":
          n = 12;
          break;
        case "quarterly":
          n = 4;
          break;
        case "yearly":
          n = 1;
          break;
        default:
          n = 1;
      }

      const totalPeriods = t * n;

      const fdData = [];
      for (let period = 1; period <= totalPeriods; period++) {
        const invested = P;
        const totalNominalValue = P * Math.pow(1 + r / n, period);
        const totalRealValue = P * Math.pow(1 + rReal / n, period);
        const interest = totalNominalValue - P;

        let date;
        switch (compFreq) {
          case "monthly":
            date = `${Math.floor(period / 12)}y ${period % 12}m`;
            break;
          case "quarterly":
            date = `${Math.floor(period / 4)}y ${period % 4}q`;
            break;
          case "yearly":
            date = `${period}y`;
            break;
          default:
            date = `${period}y`;
        }

        fdData.push({
          date: date,
          invested: invested.toFixed(2),
          interest: interest.toFixed(2),
          totalNominalValue: totalNominalValue.toFixed(2),
          totalRealValue: totalRealValue.toFixed(2),
        });
      }

      setFdData(fdData);
    };

    calculateFdData();
  }, [
    initialDeposit,
    annualInterestRate,
    annualInflationRate,
    compoundingFrequency,
    timePeriod,
  ]);

  // SIP Calculation
  useEffect(() => {
    const calculateSipData = () => {
      const D = parseFloat(sipDeposit);
      const r = parseFloat(sipAnnualInterestRate) / 100;
      const rInf = parseFloat(sipAnnualInflationRate) / 100;
      const t = parseFloat(sipTimePeriod);
      const compFreq = sipCompoundingFrequency;

      if (
        isNaN(D) ||
        isNaN(r) ||
        isNaN(rInf) ||
        isNaN(t) ||
        !compFreq ||
        D <= 0 ||
        r <= 0 ||
        rInf < 0 ||
        t <= 0
      ) {
        setSipData([]);
        return;
      }

      const rReal = (1 + r) / (1 + rInf) - 1;

      let n;
      switch (compFreq) {
        case "monthly":
          n = 12;
          break;
        case "quarterly":
          n = 4;
          break;
        case "yearly":
          n = 1;
          break;
        default:
          n = 1;
      }

      const totalPeriods = t * n;

      const sipData = [];
      let totalInvested = 0;
      for (let period = 1; period <= totalPeriods; period++) {
        totalInvested += D;

        const totalNominalValue =
          D * ((Math.pow(1 + r / n, period) - 1) / (r / n)) * (1 + r / n);
        const totalRealValue =
          D *
          ((Math.pow(1 + rReal / n, period) - 1) / (rReal / n)) *
          (1 + rReal / n);
        const interest = totalNominalValue - totalInvested;

        let date;
        switch (compFreq) {
          case "monthly":
            date = `${Math.floor(period / 12)}y ${period % 12}m`;
            break;
          case "quarterly":
            date = `${Math.floor(period / 4)}y ${period % 4}q`;
            break;
          case "yearly":
            date = `${period}y`;
            break;
          default:
            date = `${period}y`;
        }

        sipData.push({
          date: date,
          invested: totalInvested.toFixed(2),
          interest: interest.toFixed(2),
          totalNominalValue: totalNominalValue.toFixed(2),
          totalRealValue: totalRealValue.toFixed(2),
        });
      }

      setSipData(sipData);
    };

    calculateSipData();
  }, [
    sipDeposit,
    sipAnnualInterestRate,
    sipAnnualInflationRate,
    sipCompoundingFrequency,
    sipTimePeriod,
  ]);

  return (
    <div className="w-full h-fit  bg-back py-[10dvh] md:px-[5dvw] text-txt">
      <div className="uppercase text-3xl font-black text-center">
        Investment Calculator
      </div>

      <div className="w-full flex flex-col md:flex-row md:gap-10 items-center justify-center md:items-start">
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-start">
          <div className="uppercase text-2xl py-4 font-bold text-center w-full">
            Fixed Deposit
          </div>
          <form className="w-full flex flex-col gap-2 p-4  rounded-xl">
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Initial Deposit"
                  value={initialDeposit}
                  onChange={handleInitialDepositChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Annual Interest Rate"
                  value={annualInterestRate}
                  onChange={handleAnnualInterestRateChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Annual Inflation Rate"
                  value={annualInflationRate}
                  onChange={handleAnnualInflationRateChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <select
                  value={compoundingFrequency}
                  onChange={handleCompoundingFrequencyChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                >
                  <option value="">Compounding Frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Time Period (in years)"
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
          </form>
        </div>

        <div className="w-[100dvw] md:w-3/4 h-[50dvh] text-xs">
          {fdData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fdData}
                margin={{
                  top: 30,
                  right: 30,
                  left: 0,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="invested" stackId="a" fill="#8884d8" />
                <Bar dataKey="interest" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xl h-full grid place-content-center text-txt m-8 p-8 rounded-2xl uppercase">
              Please fill in all the values to see the chart.
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row md:gap-10 items-center justify-center md:items-start mt-10">
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-start">
          <div className="uppercase text-2xl py-4 font-bold w-full text-center">
            SIP
          </div>
          <form className="w-full flex flex-col gap-2 p-4 rounded-xl">
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Monthly Deposit"
                  value={sipDeposit}
                  onChange={handleSipDepositChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Annual Interest Rate"
                  value={sipAnnualInterestRate}
                  onChange={handleSipAnnualInterestRateChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Annual Inflation Rate"
                  value={sipAnnualInflationRate}
                  onChange={handleSipAnnualInflationRateChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <select
                  value={sipCompoundingFrequency}
                  onChange={handleSipCompoundingFrequencyChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                >
                  <option value="">Compounding Frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </Input>
            </div>
            <div>
              <Input
                color1="#282829"
                color2="#4CAF50"
                className="rounded-xl p-px"
              >
                <input
                  type="number"
                  placeholder="Time Period (in years)"
                  value={sipTimePeriod}
                  onChange={handleSipTimePeriodChange}
                  className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
                />
              </Input>
            </div>
          </form>
        </div>

        <div className="w-[100dvw] md:w-3/4 h-[50dvh] text-xs">
          {sipData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sipData}
                margin={{
                  top: 30,
                  right: 30,
                  left: 0,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="invested" stackId="a" fill="#8884d8" />
                <Bar dataKey="interest" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xl h-full grid place-content-center text-txt m-8 p-8 rounded-2xl uppercase">
              Please fill in all the values to see the chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalc;
