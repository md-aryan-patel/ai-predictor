const {
  getSMA,
  getDEMA,
  getRSI,
  getCryptocurrencyQuotes,
  getFearAndGreedIndex,
} = require("./api/cryptoData");
const { delay, data } = require("./helper");
const { analyzeCryptoData } = require("./openai");

const delayTime = 1000;

const getDataFromApi = async (symbol) => {
  const smaResp = await getSMA(symbol);
  await delay(delayTime);
  const rsiResp = await getRSI(symbol);
  await delay(delayTime);
  const demaResp = await getDEMA(symbol);
  await delay(delayTime);
  const getccquotes = await getCryptocurrencyQuotes([symbol]);
  const resp = getccquotes[symbol];

  const volumeIn24hr = resp[0].quote.USD.volume_24h;
  const marketCap = resp[0].quote.USD.market_cap;
  const activeAddresses = 1234567890;
  const fearGreedIndex = getFearAndGreedIndex();

  const data = {
    symbol,
    sma: smaResp.value,
    rsi: rsiResp.value,
    dema: demaResp.value,
    volume: volumeIn24hr,
    marketCap,
    activeAddresses,
    fearGreedIndex,
  };
  return data;
};

const main = async () => {
  const data = await getDataFromApi("CAKE");
  console.log(data);
  const analysedData = await analyzeCryptoData(data);
  console.log(analysedData.choices[0].message);
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
