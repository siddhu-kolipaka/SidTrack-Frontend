import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, lazy, Suspense } from "react";
import CountUp from "react-countup";
import img2 from "../../assets/img2.svg";
import img3 from "../../assets/img3.svg";
import img5 from "../../assets/img5.svg";
import img6 from "../../assets/img6.svg";
import img7 from "../../assets/img7.svg";
import jwt from "../../assets/JWT.svg";
import { getMetrics, updateMetrics } from "@/store/metrics/metricsThunks";
import Spinner from "@/components/Spinner/Spinner";
import { motion, AnimatePresence } from "motion/react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const ResponsiveSpline = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-[100dvw] h-[100dvh] hidden md:block">
      {!loaded && (
        <div className="absolute inset-0 flex justify-center items-center gap-4 text-3xl text-txt">
          Loading 3D scene
          <Spinner />
        </div>
      )}
      <Spline
        scene="https://draft.spline.design/7pwrTGfjwzEfm4Ic/scene.splinecode"
        className="w-full h-full"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Metric = ({ title, value }) => {
  return (
    <div className="grid grid-cols-2 gap-0 place-items-center">
      <div>{title} :</div>
      <div className="text-xl text-pri">
        <CountUp end={value || 0} duration={2} />
      </div>
    </div>
  );
};

const About = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.metrics.data);
  useEffect(() => {
    if (!sessionStorage.getItem("visit")) {
      dispatch(updateMetrics({ type: "pageVisits" }));
      sessionStorage.setItem("visit", "x");
    } else {
      dispatch(updateMetrics({ type: "pageViews" }));
    }
    if (!localStorage.getItem("uniqueId")) {
      dispatch(updateMetrics({ type: "uniqueVisits" }));
      localStorage.setItem("uniqueId", crypto.randomUUID());
    }
    dispatch(getMetrics());
  }, [dispatch]);
  return (
    <div className="w-full flex flex-col items-center bg-back">
      <section className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center md:justify-start md:items-start relative">
        <Suspense
          fallback={
            <div className="w-full h-full text-3xl text-txt grid place-content-center">
              Loading 3D scene...
            </div>
          }
        >
          <ResponsiveSpline />
        </Suspense>
        <div className="md:w-full md:flex justify-between text-[#DFF7E5] absolute hidden">
          <div className="w-fit flex flex-col px-8 py-4 items-center">
            <div className="font-bold text-5xl flex">
              <div>Sid</div>
              <div className="text-pri">Track</div>
            </div>
            <div className="text-sm tracking-wide">Track your wealth.</div>
          </div>
          <div className="w-fit grid grid-cols-1 text-base py-4">
            <Metric title="Page Views" value={data.pageViews} />
            <Metric title="Page Visits" value={data.pageVisits} />
            <Metric title="Unique Visits" value={data.uniqueVisits} />
            <Metric title="Registered Users" value={data.users} />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-evenly items-center gap-4 text-[#DFF7E5] px-4 py-16 absolute md:hidden">
          <div className="flex flex-col items-center">
            <div className="font-bold text-4xl flex">
              <div>Sid</div>
              <div className="text-pri">Track</div>
            </div>
            <div className="text-xs tracking-widest">Track your wealth.</div>
          </div>

          <div className="w-fit grid grid-cols-1 text-base ">
            <motion.button
              onClick={() => setOpen(!open)}
              className="w-fit h-fit text-sm py-2 px-4 text-pri ring-1 ring-pri rounded-xl mx-auto"
              whileTap={{ color: "#000000", backgroundColor: "#02e054" }}
            >
              Metrics
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-2 overflow-hidden mt-8"
                >
                  <Metric title="Page Views" value={data.pageViews} />
                  <Metric title="Page Visits" value={data.pageVisits} />
                  <Metric title="Unique Visits" value={data.uniqueVisits} />
                  <Metric title="Registered Users" value={data.users} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={jwt}
            alt="JWT Authentication"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">Advanced JWT</div>
          <p className="text-base px-4 md:px-0">
            My website uses cutting-edge security protocols with advanced JWT
            authentication—designed to meet banking-level standards. By
            combining short-lived access tokens for immediate, secure
            verification with longer-lasting refresh tokens for seamless session
            renewal, we ensure that your data is protected at all times. This
            dual-token system not only provides rapid, hassle-free access but
            also minimizes exposure risks, giving you the confidence that every
            transaction is safeguarded by state-of-the-art security measures.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row-reverse justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img2}
            alt="Portfolio"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">Portfolio Tracker</div>
          <p className="text-base px-4 md:px-0">
            Experience a sleek, cutting-edge portfolio dashboard that delivers
            real-time insights at a glance. The interactive donut chart
            highlights your asset distribution and performance, while detailed
            tables break down day gains, total gains, and overall worth. With
            convenient transaction logs, profit-and-loss tracking, and instant
            buy/sell functionality, this user-centric design empowers you to
            make confident, data-driven investment decisions—ensuring a smooth
            and sophisticated trading experience.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img7}
            alt="Cashflow Tracker"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">Cashflow Tracker</div>
          <p className="text-base px-4 md:px-0">
            Experience effortless financial tracking with my dynamic income and
            expense charts—giving you a clear snapshot of where your money comes
            from and where it’s going. Easily log transactions by selecting
            categories, entering amounts, and adding notes, while the date range
            feature helps you monitor spending patterns over time. This
            intuitive design empowers you to stay on top of your finances and
            make smarter budgeting decisions at a glance.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row-reverse justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img5}
            alt="Calculator"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">
            Investment Calculator
          </div>
          <p className="text-base px-4 md:px-0">
            Discover the power of informed investing with my comprehensive Fixed
            Deposit and SIP Calculator. Simply enter your deposit amounts,
            interest rates, inflation rates, and compounding frequencies to
            instantly visualize how your investments grow over time. By
            comparing both FD and SIP side-by-side in an easy-to-read chart, you
            can make data-driven decisions on the best way to secure and enhance
            your financial future.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img3}
            alt="Networth Progression"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">Networth Tracker</div>
          <p className="text-base px-4 md:px-0">
            Monitor your path to financial success with my Net Worth Progression
            feature. Simply input your wealth updates and watch your net worth
            grow on a dynamic chart. This intuitive visualization keeps you
            motivated and accountable, helping you stay on track to achieve your
            financial goals over time.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row-reverse justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img6}
            alt="Transaction Log"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">Transaction Log</div>
          <p className="text-base px-4 md:px-0">
            Track your buying and selling history with my comprehensive
            Transaction Log. Filter transactions by date range to quickly review
            each trade’s stock, price, quantity, and overall worth. If no
            records appear, simply head to the portfolio section to initiate new
            trades and maintain a clear, detailed overview of your investment
            activity.
          </p>
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center bg-back px-4 py-16">
        <div className="w-full md:w-fit md:h-[60vh] rounded-3xl overflow-hidden mb-8 md:mb-0">
          <img
            src={img5}
            alt="Profit and Loss"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8 text-[#DFF7E5] text-center">
          <div className="font-bold text-6xl text-pri">
            Profit and Loss Tracker
          </div>
          <p className="text-base px-4 md:px-0">
            Stay on top of your portfolio’s performance with my Profit and Loss
            dashboard. Visualize daily net totals in an interactive chart and
            filter by date range for a clearer picture of your overall gains and
            losses. Below, a detailed log highlights each transaction—complete
            with stock name, quantity, and profit/loss—ensuring you have the
            insights needed to make informed investment decisions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
