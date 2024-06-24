const axios = require("axios");
const { genericResponse } = require("../helper");
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

const getPVI = async (tokenSymbol) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/pvi", {
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
const getNVI = async (tokenSymbol) => {
  const symbol = tokenSymbol + "/USDT";
  try {
    const response = await taapiApi.get("/nvi", {
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

module.exports = {
  getSMA,
  getRSI,
  getDEMA,
  getNVI,
  getPVI,
  getCryptocurrencyQuotes,
  getFearAndGreedIndex,
  getPriceAppirciationInPercentage,
};
