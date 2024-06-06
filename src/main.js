const {
  getSMA,
  getDEMA,
  getRSI,
  getCryptocurrencyQuotes,
} = require("./api/data");

const main = async () => {
  const symbol = "ETH";
  const smaResp = await getSMA("BTC");
  const rsiResp = await getRSI("BTC");
  const demaResp = await getDEMA("BTC");
  const getccquotes = await getCryptocurrencyQuotes([symbol]);
  const resp = getccquotes[symbol];

  const volumeIn24hr = resp[0].quote.USD.volume_24h;
  const marketCap = resp[0].quote.USD.market_cap;

  console.log({ symbol, smaResp, rsiResp, demaResp, volumeIn24hr, marketCap });
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
