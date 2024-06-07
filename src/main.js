const {
  getSMA,
  getDEMA,
  getRSI,
  getCryptocurrencyQuotes,
} = require("./api/data");
const { delay, data } = require("./helper");
const { analyzeCryptoData } = require("./openai");

const delayTime = 10000;

const getDataFromApi = async () => {
  const symbol = "ETH";
  const smaResp = await getSMA("BTC");
  await delay(delayTime);
  const rsiResp = await getRSI("BTC");
  await delay(delayTime);
  const demaResp = await getDEMA("BTC");
  await delay(delayTime);
  const getccquotes = await getCryptocurrencyQuotes([symbol]);
  const resp = getccquotes[symbol];

  const volumeIn24hr = resp[0].quote.USD.volume_24h;
  const marketCap = resp[0].quote.USD.market_cap;

  console.log({ symbol, smaResp, rsiResp, demaResp, volumeIn24hr, marketCap });
};

const main = async () => {
  const analysedData = await analyzeCryptoData(data);
  console.log(await analysedData.choices[0].message);
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
