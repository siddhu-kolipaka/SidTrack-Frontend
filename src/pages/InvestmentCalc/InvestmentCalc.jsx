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
    const dataPoint = payload[0].payload;
    const fdTotal = Number(
      (dataPoint.fdInvested + dataPoint.fdInterest).toFixed(2)
    );
    const sipTotal = Number(
      (dataPoint.sipInvested + dataPoint.sipInterest).toFixed(2)
    );
    return (
      <div className="w-60 md:w-fit border border-border bg-back text-txt p-4 rounded-xl">
        <div className="mb-2">
          <strong>{dataPoint.date}</strong>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>FD</strong>
            <div>Invested: ₹{dataPoint.fdInvested}</div>
            <div>Interest: ₹{dataPoint.fdInterest}</div>
            <div>Total: ₹{fdTotal}</div>
            <div>Adjusted Total: ₹{dataPoint.fdAdjustedTotal}</div>
          </div>
          <div>
            <strong>SIP</strong>
            <div>Invested: ₹{dataPoint.sipInvested}</div>
            <div>Interest: ₹{dataPoint.sipInterest}</div>
            <div>Total: ₹{sipTotal}</div>
            <div>Adjusted Total: ₹{dataPoint.sipAdjustedTotal}</div>
          </div>
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
      const data = [];
      for (let period = 1; period <= totalPeriods; period++) {
        const totalNominalValue = P * Math.pow(1 + r / n, period);
        const invested = P;
        const interest = totalNominalValue - P;
        const years = period / n;
        const adjustedTotalValue =
          totalNominalValue / Math.pow(1 + rInf, years);
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
        data.push({
          date,
          fdInvested: Number(invested.toFixed(2)),
          fdInterest: Number(interest.toFixed(2)),
          fdAdjustedTotal: Number(adjustedTotalValue.toFixed(2)),
        });
      }
      setFdData(data);
    };
    calculateFdData();
  }, [
    initialDeposit,
    annualInterestRate,
    annualInflationRate,
    compoundingFrequency,
    timePeriod,
  ]);

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
      const data = [];
      let totalInvested = 0;
      const i = r / n;
      for (let period = 1; period <= totalPeriods; period++) {
        totalInvested += D;
        const totalNominalValue = D * ((Math.pow(1 + i, period) - 1) / i);
        const interest = totalNominalValue - totalInvested;
        const years = period / n;
        const adjustedTotalValue =
          totalNominalValue / Math.pow(1 + rInf, years);
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
        data.push({
          date,
          sipInvested: Number(totalInvested.toFixed(2)),
          sipInterest: Number(interest.toFixed(2)),
          sipAdjustedTotal: Number(adjustedTotalValue.toFixed(2)),
        });
      }
      setSipData(data);
    };
    calculateSipData();
  }, [
    sipDeposit,
    sipAnnualInterestRate,
    sipAnnualInflationRate,
    sipCompoundingFrequency,
    sipTimePeriod,
  ]);

  const combinedData = [];
  const maxLength = Math.max(fdData.length, sipData.length);
  for (let i = 0; i < maxLength; i++) {
    combinedData.push({
      date:
        (fdData[i] && fdData[i].date) ||
        (sipData[i] && sipData[i].date) ||
        `Period ${i + 1}`,
      fdInvested: fdData[i] ? fdData[i].fdInvested : 0,
      fdInterest: fdData[i] ? fdData[i].fdInterest : 0,
      fdAdjustedTotal: fdData[i] ? fdData[i].fdAdjustedTotal : 0,
      sipInvested: sipData[i] ? sipData[i].sipInvested : 0,
      sipInterest: sipData[i] ? sipData[i].sipInterest : 0,
      sipAdjustedTotal: sipData[i] ? sipData[i].sipAdjustedTotal : 0,
    });
  }

  return (
    <div className="w-full min-h-[100dvh]  bg-back pt-[10dvh] px-4 text-txt">
      <div className="flex flex-col ">
        <div className="flex flex-col md:flex-row md:justify-center gap-4 md:gap-16">
          <div className=" flex flex-col items-center justify-center">
            <div className=" flex flex-col items-center">
              <div className="uppercase text-xl font-bold text-center w-full">
                Fixed Deposit
              </div>
              <form className="w-full md:w-80 flex flex-col gap-2 py-4  rounded-xl">
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Initial Deposit"
                      value={initialDeposit}
                      onChange={handleInitialDepositChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Annual Interest Rate"
                      value={annualInterestRate}
                      onChange={handleAnnualInterestRateChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Annual Inflation Rate"
                      value={annualInflationRate}
                      onChange={handleAnnualInflationRateChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <select
                      value={compoundingFrequency}
                      onChange={handleCompoundingFrequencyChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
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
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Time Period (in years)"
                      value={timePeriod}
                      onChange={handleTimePeriodChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
              </form>
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center">
            <div className=" flex flex-col items-center">
              <div className="uppercase text-xl font-bold text-center w-full">
                SIP
              </div>
              <form className="w-full md:w-80 flex flex-col gap-2 py-4 rounded-xl">
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Monthly Deposit"
                      value={sipDeposit}
                      onChange={handleSipDepositChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Annual Interest Rate"
                      value={sipAnnualInterestRate}
                      onChange={handleSipAnnualInterestRateChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Annual Inflation Rate"
                      value={sipAnnualInflationRate}
                      onChange={handleSipAnnualInflationRateChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
                <div>
                  <Input
                    color1="#282829"
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <select
                      value={sipCompoundingFrequency}
                      onChange={handleSipCompoundingFrequencyChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
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
                    color2="#02e054"
                    className="rounded-xl p-px"
                  >
                    <input
                      type="number"
                      placeholder="Time Period (in years)"
                      value={sipTimePeriod}
                      onChange={handleSipTimePeriodChange}
                      className="rounded-xl focus:outline-none h-10 text-txt px-4 bg-back w-full"
                    />
                  </Input>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full h-[50dvh] text-xs">
          {combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={combinedData}
                margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="fdInvested"
                  name="FD Invested"
                  stackId="fd"
                  fill="#4682B4"
                  barSize={30}
                />
                <Bar
                  dataKey="fdInterest"
                  name="FD Interest"
                  stackId="fd"
                  fill="#1E90FF"
                  barSize={30}
                />
                <Bar
                  dataKey="sipInvested"
                  name="SIP Invested"
                  stackId="sip"
                  fill="#9370DB"
                  barSize={30}
                />
                <Bar
                  dataKey="sipInterest"
                  name="SIP Interest"
                  stackId="sip"
                  fill="#8A2BE2"
                  barSize={30}
                />
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
