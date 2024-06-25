const axios = require("axios");
const { genericResponse, delay } = require("../helper");
const { saveDaataToFile } = require("../readers/");
const { analyzeCryptoData } = require("../openai");

const delayTime = 1000;
require("dotenv").config();

const taapiApi = axios.create({
  baseURL: "https://api.taapi.io",
});

const cmcApi = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v2",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_KEY,
  },
});

const getSMA = async (tokenSymbol) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/sma", {
      params: {
        secret: process.env.TAAPI_KEY,
        exchange: "binance",
        symbol: symbol,
        interval: "1h",
      },
    });

    return response.data;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getRSI = async (tokenSymbol) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/rsi", {
      params: {
        secret: process.env.TAAPI_KEY,
        exchange: "binance",
        symbol: symbol,
        interval: "1h",
      },
    });

    return response.data;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getDEMA = async (tokenSymbol) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/dema", {
      params: {
        secret: process.env.TAAPI_KEY,
        exchange: "binance",
        symbol: symbol,
        interval: "1h",
      },
    });

    return response.data;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getCryptocurrencyQuotes = async (symbols) => {
  try {
    const response = await cmcApi.get("/cryptocurrency/quotes/latest", {
      params: {
        symbol: symbols.join(","),
        convert: "USD",
      },
    });

    return response.data.data;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getFearAndGreedIndex = async () => {
  try {
    const response = await axios.get("https://api.alternative.me/fng/");

    return response.data.data[0].value;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getPriceAppirciationInPercentage = async (
  symbol,
  interval = "1h",
  backtrack = 24
) => {
  const oneHrPrice = await fetchCoinPriceWithInterval(symbol, interval);
  const oneDayPrice = await fetchCoinPriceWithInterval(
    symbol,
    interval,
    backtrack
  );

  const priceDifference = oneHrPrice - oneDayPrice;
  const trend = priceDifference > 0 ? "up" : "down";
  const percentage = (priceDifference / oneDayPrice) * 100;
  return {
    trend,
    percentage,
  };
};

const fetchCoinPriceWithInterval = async (
  tokenSymbol,
  interval,
  backtrack = 0
) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/price", {
      params: {
        secret: process.env.TAAPI_KEY,
        exchange: "binance",
        symbol: symbol,
        interval: interval,
        backtrack: backtrack,
      },
    });

    return response.data.value;
  } catch (error) {
    return genericResponse("error", error);
  }
};

const getHourlyData = async (symbol) => {
  let data = await getDataFromApi(symbol);
  const analysedData = await analyzeCryptoData(data);
  data["analysedData"] = analysedData.choices[0].message.content;
  await saveDaataToFile(data);
};

// cron.schedule("0 * * * *", () => {
//   myHourlyFunction();
// });

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
  const fearGreedIndex = await getFearAndGreedIndex();
  const priceAppriciation = await getPriceAppirciationInPercentage(symbol);

  const data = {
    symbol,
    sma: smaResp.value,
    rsi: rsiResp.value,
    dema: demaResp.value,
    volume: volumeIn24hr,
    marketCap,
    activeAddresses,
    fearGreedIndex,
    priceAppriciation,
  };
  return data;
};

module.exports = {
  getHourlyData,
};
