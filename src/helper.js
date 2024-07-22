let json2xls = require("json2xls");
const tokenData = require("../data.json");
const { saveXslx } = require("./readers");

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
      percentageChange1hr (${data.percentageChange1hr}), percentageChange24hr (${data.perpercentageChange24hr}), percentageChange7d (${data.percentageChange7d}) market cap (${data.marketCap}), active addresses (${data.activeAddresses}), FDV (${data.fdv}) Fear/Greed Index (${data.fearGreedIndex}), and 24hr price change (${data.priceAppriciation.percentage}%, ${data.priceAppriciation.trend}). now pick out the similar tokens from the tokes that you have token data `;
  prompt = promptTemplate.replace(/{{(.*?)}}/g, (match, p1) => data[p1]);
  return prompt;
};

module.exports = { genericResponse, delay, downloadXlsx, returnPromptWithData };
