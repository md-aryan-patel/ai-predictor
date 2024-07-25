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

const resturnPromptWithMultipleData = (d, mainTokenData) => {
  let prompt =
    "This is the subject Token data " +
    JSON.stringify(mainTokenData) +
    " and below is the data of the similar token\n";
  for (let i = 0; i < d.length; i++) {
    let p;
    let data = d[i];
    const promptTemplate = `Analyze ${data.symbol} cryptocurrency (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}),
  percentageChange1hr (${data.percentageChange1hr}), percentageChange24hr (${data.perpercentageChange24hr}), percentageChange7d (${data.percentageChange7d}) market cap (${data.marketCap}), active addresses (${data.activeAddresses}), FDV (${data.fdv}) Fear/Greed Index (${data.fearGreedIndex}), price Appriciation (${data.priceAppriciation.percentage}%, ${data.priceAppriciation.trend}).`;
    p = promptTemplate.replace(/{{(.*?)}}/g, (match, p1) => data[p1]);
    prompt += p + "\n";
  }
  const q = `based on this Calculate Authenticity Percentage:
        ◦ Based on the comparison, determine the percentage of the subject token's price appreciation that can be considered authentic.
        ◦ If the subject token appreciated by 100%, and similar tokens and the market appreciated by an average of 20%, calculate the authenticity as 20% of the 100% appreciation, which is 20%.
        
        Recommend Sell Pressure:
        ◦ Based on the analysis, recommend whether adding sell pressure to the market is advisable at the moment.
        ◦ Provide a percentage of how much sell pressure can be applied based on the authentic appreciation determined.
      
        Generate Report:
        ◦ Provide a detailed report with the findings, including charts and graphs to visualize the data.
        ◦ Highlight the percentage of authentic appreciation versus artificial pumping, market trends, and recommendations for sell pressure.

        Example Calculation:

        For example: Token A appreciated by 100% in the last 24 hours.

        Similar tokens with the same market cap appreciated by an average of 20%.
        The overall market trend showed an average appreciation of 20%.
        The Cap Rate and FDV indicate a reasonable rate of return and potential dilution impact.
        Authenticity Percentage:
        Authentic Appreciation = Average Similar Token Appreciation + Overall Market Appreciation

        Authentic Appreciation = Average Similar Token Appreciation + Overall Market Appreciation

        Authentic Appreciation = 20%+20%
        Authentic Appreciation = 20%

        Calculating the Percentage of Authentic Appreciation:
        Percentage of Authentic Appreciation= (20% / 100%)*100

        Percentage of Authentic Appreciation = 20%

        Therefore, 20% of the 100% appreciation is considered authentic.

above is just the example of how to calculate the authentic appreciation for a token and similar tokens, derive the formulae Take price appriciation percentage of a perticular token from price Appriciation and calculate the. authentic appreciation for the token and similar tokens.
calculate the percentage of authentic appreciation also show calculation steps for all the tokens provided.
`;
  prompt += q;
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
  resturnPromptWithMultipleData,
};
