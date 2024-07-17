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
  data["reponse"] = analysedData.response;
  data["prompt"] = analysedData.prompt;
  await saveDaataToFile(data);
};

const fetchLatestNews = async (token) => {
  token = token + " token, cryptocurrency";
  try {
    const response = await axios.get("https://newsdata.io/api/1/latest", {
      params: {
        apikey: process.env.NEW_API,
        q: token,
        language: "en",
      },
    });

    return response.data.results;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching news:", error);
    throw error;
  }
};

async function getTokenByMarketCap(rank) {
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
  const params = {
    start: rank,
    limit: 1,
    convert: "USD",
  };

  try {
    const response = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_KEY,
      },
      params: params,
    });

    if (response.data.data && response.data.data.length > 0) {
      const sym = response.data.data[0].symbol;
      return sym;
    } else {
      throw new Error("No data returned for the given rank");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

const getDataFromApi = async (symbol) => {
  const smaResp = await getSMA(symbol);
  await delay(delayTime);
  const rsiResp = await getRSI(symbol);
  await delay(delayTime);
  const demaResp = await getDEMA(symbol);
  await delay(delayTime);
  const getccquotes = await getCryptocurrencyQuotes([symbol]);
  await delay(delayTime);
  const resp = getccquotes[symbol];
  const quote = resp[0].quote.USD;

  console.log(" Got basic data");

  const volumeIn24hr = quote.volume_24h;
  const percentageChange1hr = quote.percent_change_1h;
  const percentageChange24hr = quote.percent_change_24h;
  const percentageChange7d = quote.percent_change_7d;
  const marketCap = quote.market_cap;
  const fdv = quote.fully_diluted_market_cap;
  const activeAddresses = 1234567890;
  const fearGreedIndex = await getFearAndGreedIndex();
  await delay(delayTime);
  console.log(" Got FGI");
  const priceAppriciation = await getPriceAppirciationInPercentage(symbol);
  await delay(delayTime);
  console.log(" Got price appriciation");
  /*
  const result = await fetchLatestNews(symbol);
  let news = "";
  if (result.length > 0) {
    news = result[0].description;
  }
 */
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

const main = async () => {
  let rank = 8748;
  while (true) {
    let resData;
    try {
      let symbol;
      try {
        await delay(delayTime);
        symbol = await getTokenByMarketCap(rank);
      } catch (err) {
        console.log(err);
        continue;
      }
      if (symbol === null) continue;
      console.log(`Got Token symbol ${symbol}`);
      resData = await getDataFromApi(symbol);
      resData["rank"] = rank + 1;
      console.log("Got data from symbol");
    } catch (err) {
      console.log(err);
      rank++;
      continue;
    }
    saveDaataToFile(resData);
    rank++;
  }
};

const temp = async () => {
  const res = await getTokenByMarketCap(12);
  console.log(res);
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});

module.exports = {
  getHourlyData,
};
