import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Holdings = ({ data, setActiveIndex }) => {
  return (
    <Accordion type="single" collapsible className="rounded-xl">
      <div className="grid grid-cols-[1fr,1fr,1fr,1fr,0.2fr] text-center md:grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,0.2fr,0.2fr] justify-items-center place-items-center text-xs md:text-sm py-4 md:px-2 bg-pri text-back font-semibold rounded-lg uppercase ">
        <div>Stock</div>
        <div className="text-center">Current Price</div>
        <div className="hidden md:block">Quantity</div>
        <div>Day Gain</div>
        <div>Total Gain</div>
        <div className="hidden md:block">Invested</div>
        <div className="hidden md:block">Worth</div>
      </div>
      {data?.length > 0 ? (
        data.map((tx, index) => (
          <AccordionItem
            key={tx._id}
            value={String(tx._id)}
            className="text-txt w-full"
          >
            <AccordionTrigger className="py-3">
              <div
                className="grid grid-cols-[1.2fr,1fr,1fr,1.2fr] text-center md:grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,0.2fr] w-full rounded-xl justify-items-center place-items-center text-xs md:text-base "
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div>{tx._id}</div>
                <div>
                  ₹{Math.abs(tx.stocks[0]?.currentPrice ?? 0).toFixed(2)}
                </div>
                <div className="hidden md:block">
                  {tx.stocks.reduce((total, stock) => total + stock.qty, 0)}
                </div>
                <div
                  className={` ${
                    tx.stocks.reduce(
                      (total, stock) =>
                        total +
                        (stock.currentPrice - stock.previousClosePrice) *
                          stock.qty,
                      0
                    ) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  } `}
                >
                  {tx.stocks.reduce(
                    (total, stock) =>
                      total +
                      (stock.currentPrice - stock.previousClosePrice) *
                        stock.qty,
                    0
                  ) > 0
                    ? "+"
                    : "-"}
                  ₹
                  {Math.abs(
                    tx.stocks.reduce(
                      (total, stock) =>
                        total +
                        (stock.currentPrice - stock.previousClosePrice) *
                          stock.qty,
                      0
                    )
                  ).toFixed(2)}
                </div>
                <div
                  className={` ${
                    tx.stocks.reduce((total, stock) => total + stock.gain, 0) >
                    0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {tx.stocks.reduce((total, stock) => total + stock.gain, 0) > 0
                    ? "+"
                    : "-"}
                  ₹
                  {Math.abs(
                    tx.stocks.reduce((total, stock) => total + stock.gain, 0)
                  ).toFixed(2)}
                </div>
                <div className="hidden md:block">
                  ₹
                  {Math.abs(
                    tx.stocks.reduce(
                      (total, stock) => total + stock.investment,
                      0
                    )
                  ).toFixed(2)}
                </div>
                <div
                  className={` ${
                    tx.stocks.reduce((total, stock) => total + stock.gain, 0) >
                    0
                      ? "text-green-600"
                      : "text-red-600"
                  } hidden md:block`}
                >
                  ₹
                  {Math.abs(
                    tx.stocks.reduce((total, stock) => total + stock.worth, 0)
                  ).toFixed(2)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border border-border">
              <div className="grid grid-cols-[1fr,1fr,1fr,1fr] text-center  md:grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,0.2fr] w-full  justify-items-center place-items-center uppercase text-xs bg-border py-1">
                <div className="hidden md:block">Purchase date</div>
                <div>Purchase price</div>
                <div>Quantity</div>
                <div>Day Gain</div>
                <div>Gain</div>
                <div className="hidden md:block">Investment</div>
                <div className="hidden md:block">Worth</div>
              </div>
              {tx.stocks.map((stock, index) => (
                <div
                  key={`${stock}${index}`}
                  className="grid grid-cols-[1fr,1fr,1fr,1fr] md:grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,0.2fr] text-center w-full  justify-items-center place-items-center uppercase text-xs py-2  border-border"
                >
                  <div className="hidden md:block">
                    {new Date(stock.purchaseDate).toLocaleDateString("en-IN")}
                  </div>
                  <div>₹{Math.abs(stock.purchasePrice).toFixed(2)}</div>
                  <div>{stock.qty}</div>
                  <div
                    className={`${
                      stock.currentPrice - stock.previousClosePrice > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stock.currentPrice - stock.previousClosePrice > 0
                      ? "+"
                      : "-"}{" "}
                    ₹
                    {Math.abs(
                      (stock.currentPrice - stock.previousClosePrice) *
                        stock.qty
                    ).toFixed(2)}
                  </div>
                  <div
                    className={`${
                      stock.gain > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock.gain > 0 ? "+" : "-"} ₹
                    {Math.abs(stock.gain).toFixed(2)}
                  </div>
                  <div className="hidden md:block">
                    ₹{Math.abs(stock.investment).toFixed(2)}
                  </div>
                  <div
                    className={`${
                      stock.gain > 0 ? "text-green-600" : "text-red-600"
                    } hidden md:block`}
                  >
                    ₹{Math.abs(stock.worth).toFixed(2)}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <div className="w-full h-full grid place-content-center text-txt py-4">
          No transactions found.
        </div>
      )}
    </Accordion>
  );
};

export default Holdings;
