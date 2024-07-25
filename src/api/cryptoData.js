const axios = require("axios");
const { genericResponse, delay } = require("../helper");
const { saveDaataToFile, saveDataToResponse } = require("../readers/");
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
let fearAndGreedIndex = null;
const getFearAndGreedIndex = async () => {
  if (fearAndGreedIndex === null) {
    try {
      const response = await axios.get("https://api.alternative.me/fng/");

      fearAndGreedIndex = response.data.data[0].value;
    } catch (error) {
      return genericResponse("error", error);
    }
  }
  return fearAndGreedIndex;
};

const getPriceAppirciationInPercentage = async (
  symbol,
  interval = "1h",
  backtrack = 24
) => {
  await delay(delayTime * 3);
  const oneHrPrice = await fetchCoinPriceWithInterval(symbol, interval);
  await delay(delayTime * 3);
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

const getDataFromApi = async (symbol) => {
  await delay(delayTime * 3);
  const smaResp = await getSMA(symbol);
  await delay(delayTime);
  const rsiResp = await getRSI(symbol);
  await delay(delayTime);
  const demaResp = await getDEMA(symbol);
  await delay(delayTime);
  const getccquotes = await getCryptocurrencyQuotes([symbol]);
  await delay(delayTime);
  const resp = getccquotes[symbol];
  console.log(`Symbol: ${symbol}`);
  if (resp.length === 0) {
    return null;
  }
  const quote = resp[0].quote.USD;

  const volumeIn24hr = quote.volume_24h;
  const percentageChange1hr = quote.percent_change_1h;
  const percentageChange24hr = quote.percent_change_24h;
  const percentageChange7d = quote.percent_change_7d;
  const marketCap = quote.market_cap;
  const fdv = quote.fully_diluted_market_cap;
  const activeAddresses = 1234567890;
  const fearGreedIndex = await getFearAndGreedIndex();
  await delay(delayTime);
  const priceAppriciation = await getPriceAppirciationInPercentage(symbol);
  await delay(delayTime);

  const respData = {
    symbol,
    sma: smaResp.value,
    rsi: rsiResp.value,
    dema: demaResp.value,
    volume: volumeIn24hr,
    percentageChange1hr,
    percentageChange24hr,
    percentageChange7d,
    marketCap,
    activeAddresses,
    fearGreedIndex,
    priceAppriciation,
    fdv,
  };
  return respData;
};

const getHourlyData = async (symbol) => {
  let data = await getDataFromApi(symbol);
  const analysedData = await analyzeCryptoData(data);
  data["reponse"] = analysedData.response;
  data["prompt"] = analysedData.prompt;
  console.log("Got data...");
  // await saveDataToResponse(data);
  return data;
};

module.exports = {
  getHourlyData,
  getDataFromApi,
};
