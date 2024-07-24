let json2xls = require("json2xls");
const { saveXslx, saveDataToCryptoResp } = require("./readers");
const writeJsonl = require("json-to-jsonl");
const path = require("path");
const genericResponse = (type, msg) => {
  return { Type: type, Message: msg };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const downloadXlsx = async (data) => {
  let xls = json2xls(data);
  saveXslx(xls);
};

const returnPromptWithData = (data) => {
  let prompt;
  const promptTemplate = `Analyze ${data.symbol} cryptocurrency (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}),
      percentageChange1hr (${data.percentageChange1hr}), percentageChange24hr (${data.perpercentageChange24hr}), percentageChange7d (${data.percentageChange7d}) market cap (${data.marketCap}), active addresses (${data.activeAddresses}), FDV (${data.fdv}) Fear/Greed Index (${data.fearGreedIndex}), and 24hr price change (${data.priceAppriciation.percentage}%, ${data.priceAppriciation.trend}). now pick out the similar tokens from the tokes that your model is trained, give minimum 5 tokens and give the response in json format.`;
  prompt = promptTemplate.replace(/{{(.*?)}}/g, (match, p1) => data[p1]);
  return prompt;
};

const convertJsonToJsonl = async (data) => {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Input JSON must be an array of objects");
    }

    const jsonlLines = data.map((item) => {
      const formattedItem = {
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency analysis assistant.",
          },
          {
            role: "user",
            content:
              `Analyze cryptocurrency ${
                item.symbol || "Unknown"
              } with metrics: ` +
              `SMA ${(item.sma || 0).toFixed(2)}, ` +
              `RSI ${(item.rsi || 0).toFixed(2)}, ` +
              `DEMA ${(item.dema || 0).toFixed(2)}, ` +
              `Volume ${(item.volume || 0).toFixed(2)}, ` +
              `1h ${(item.percentageChange1hr || 0).toFixed(2)}%, ` +
              `24h ${(item.percentageChange24hr || 0).toFixed(2)}%, ` +
              `7d ${(item.percentageChange7d || 0).toFixed(2)}%, ` +
              `Market Cap $${(item.marketCap || 0).toFixed(2)}, ` +
              `Active Addresses ${item.activeAddresses || "N/A"}, ` +
              `Fear & Greed Index ${item.fearGreedIndex || "N/A"}, ` +
              `Price Trend ${item.priceAppriciation?.trend || "N/A"}, ` +
              `Price Change ${(item.priceAppriciation?.percentage || 0).toFixed(
                2
              )}%`,
          },
          {
            role: "assistant",
            content: `Based on the provided metrics for ${
              item.symbol || "Unknown"
            }:
1. Short-term trend (1h): ${
              (item.percentageChange1hr || 0) > 0 ? "positive" : "negative"
            } (${Math.abs(item.percentageChange1hr || 0).toFixed(2)}% change)
2. Medium-term trend (24h): ${
              (item.percentageChange24hr || 0) > 0 ? "positive" : "negative"
            } (${Math.abs(item.percentageChange24hr || 0).toFixed(2)}% change)
3. Long-term trend (7d): ${
              (item.percentageChange7d || 0) > 0 ? "positive" : "negative"
            } (${Math.abs(item.percentageChange7d || 0).toFixed(2)}% change)
4. Market sentiment (Fear & Greed Index): ${
              parseInt(item.fearGreedIndex || "50") < 50 ? "fear" : "greed"
            } (${item.fearGreedIndex || "N/A"})
5. Price trend: ${item.priceAppriciation?.trend || "N/A"} (${Math.abs(
              item.priceAppriciation?.percentage || 0
            ).toFixed(2)}% change)
6. Market position: Market cap $${(item.marketCap || 0).toFixed(2)}, ${
              item.activeAddresses || "N/A"
            } active addresses
7. Technical indicators: RSI ${(item.rsi || 0).toFixed(2)} (${
              (item.rsi || 0) < 30
                ? "oversold"
                : (item.rsi || 0) > 70
                ? "overbought"
                : "neutral"
            })

Overall outlook: ${
              (item.percentageChange24hr || 0) > 0
                ? "cautiously optimistic"
                : "somewhat bearish"
            }, monitor long-term trend closely.`,
          },
        ],
      };
      return formattedItem;
    });

    await saveDataToCryptoResp(jsonlLines);

    console.log("Successfully converted and saved JSONL data");
  } catch (error) {
    console.error("Error converting JSON to JSONL:", error.message);
    throw error;
  }
};

module.exports = {
  genericResponse,
  delay,
  downloadXlsx,
  returnPromptWithData,
  convertJsonToJsonl,
};
