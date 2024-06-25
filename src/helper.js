let json2xls = require("json2xls");
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
  const prompts = [
    `Analyze ${data.symbol} cryptocurrency: Buy, sell, or hold? Consider SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market cap (${data.marketCap}), active addresses (${data.activeAddresses}), Fear/Greed Index (${data.fearGreedIndex}), and 24hr price change (${data.priceAppriciation.percentage}%, ${data.priceAppriciation.trend}). Explain your recommendation.`,

    `Evaluate ${data.symbol} token: Is it time to buy, sell, or hold? Examine technical indicators (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Volume: ${data.volume}), fundamentals (Market Cap: ${data.marketCap}, Active Addresses: ${data.activeAddresses}), sentiment (Fear/Greed: ${data.fearGreedIndex}), and recent performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your decision.`,

    `${data.symbol} investment analysis: Buy, sell, or maintain position? Review SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading volume (${data.volume}), market capitalization (${data.marketCap}), network activity (${data.activeAddresses}), market sentiment (${data.fearGreedIndex}), and 24-hour trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide rationale for your recommendation.`,

    `Assess ${data.symbol} crypto: Time to acquire, dispose, or retain? Consider technical data (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental metrics (MCap: ${data.marketCap}, Active Users: ${data.activeAddresses}), market mood (F&G Index: ${data.fearGreedIndex}), and recent movement (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your stance.`,

    `${data.symbol} token strategy: Purchase, sell off, or keep? Analyze SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market value (${data.marketCap}), user base (${data.activeAddresses}), investor sentiment (${data.fearGreedIndex}), and 24hr change (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your advice.`,

    `Evaluate ${data.symbol} cryptocurrency position: Enter, exit, or maintain? Review technical indicators (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental data (MCap: ${data.marketCap}, Active Addresses: ${data.activeAddresses}), market psychology (F&G: ${data.fearGreedIndex}), and recent trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your recommendation.`,

    `${data.symbol} market action: Buy in, sell out, or hold position? Consider SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading activity (${data.volume}), total value (${data.marketCap}), network usage (${data.activeAddresses}), market sentiment (${data.fearGreedIndex}), and 24hr performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide reasoning for your suggestion.`,

    `Analyze ${data.symbol} token: Time to invest, divest, or stay put? Examine SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market size (${data.marketCap}), active users (${data.activeAddresses}), investor mood (${data.fearGreedIndex}), and recent price action (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your stance.`,

    `${data.symbol} crypto assessment: Accumulate, liquidate, or maintain? Review technical data (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental metrics (MCap: ${data.marketCap}, Network Activity: ${data.activeAddresses}), market psychology (F&G Index: ${data.fearGreedIndex}), and 24hr trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your recommendation.`,

    `Evaluate ${data.symbol} position: Enter market, exit market, or hold ground? Analyze SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading volume (${data.volume}), total valuation (${data.marketCap}), user engagement (${data.activeAddresses}), market sentiment (${data.fearGreedIndex}), and daily change (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide rationale for your advice.`,

    `${data.symbol} investment strategy: Buy, sell, or maintain? Consider technical indicators (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental data (Market Cap: ${data.marketCap}, Active Addresses: ${data.activeAddresses}), investor sentiment (F&G: ${data.fearGreedIndex}), and 24hr performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your recommendation.`,

    `Assess ${data.symbol} crypto: Time to acquire, dispose, or hold? Examine SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market value (${data.marketCap}), network activity (${data.activeAddresses}), market mood (${data.fearGreedIndex}), and recent trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your position.`,

    `${data.symbol} token analysis: Buy in, sell out, or stand pat? Review technical data (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental metrics (MCap: ${data.marketCap}, Active Users: ${data.activeAddresses}), investor psychology (F&G Index: ${data.fearGreedIndex}), and 24hr movement (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide reasoning for your advice.`,

    `Evaluate ${data.symbol} cryptocurrency: Invest, divest, or maintain status quo? Analyze SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading activity (${data.volume}), market size (${data.marketCap}), user base (${data.activeAddresses}), market sentiment (${data.fearGreedIndex}), and daily performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your recommendation.`,

    `${data.symbol} market strategy: Enter, exit, or hold position? Consider technical indicators (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental data (Total Value: ${data.marketCap}, Network Usage: ${data.activeAddresses}), investor mood (F&G: ${data.fearGreedIndex}), and 24hr trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your stance.`,

    `Assess ${data.symbol} token: Time to buy, sell, or maintain? Examine SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market cap (${data.marketCap}), active addresses (${data.activeAddresses}), market psychology (${data.fearGreedIndex}), and recent price action (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide rationale for your advice.`,

    `${data.symbol} crypto evaluation: Accumulate, liquidate, or hold steady? Review technical metrics (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental data (MCap: ${data.marketCap}, User Activity: ${data.activeAddresses}), investor sentiment (F&G Index: ${data.fearGreedIndex}), and 24hr performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your recommendation.`,

    `Analyze ${data.symbol} position: Time to invest, divest, or maintain? Consider SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading volume (${data.volume}), total valuation (${data.marketCap}), network engagement (${data.activeAddresses}), market mood (${data.fearGreedIndex}), and daily trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your advice.`,

    `${data.symbol} investment analysis: Buy, sell, or hold ground? Examine technical indicators (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental metrics (Market Value: ${data.marketCap}, Active Users: ${data.activeAddresses}), market psychology (F&G: ${data.fearGreedIndex}), and 24hr movement (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide reasoning for your stance.`,

    `Evaluate ${data.symbol} crypto: Time to enter, exit, or maintain position? Analyze SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), volume (${data.volume}), market size (${data.marketCap}), network activity (${data.activeAddresses}), investor sentiment (${data.fearGreedIndex}), and recent performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your recommendation.`,

    `${data.symbol} token strategy: Acquire, dispose, or retain? Review technical data (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental indicators (MCap: ${data.marketCap}, Active Addresses: ${data.activeAddresses}), market mood (F&G Index: ${data.fearGreedIndex}), and 24hr trend (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Explain your position.`,

    `Assess ${data.symbol} cryptocurrency: Buy in, sell out, or stay put? Consider SMA (${data.sma}), EMA (${data.dema}), RSI (${data.rsi}), trading activity (${data.volume}), total value (${data.marketCap}), user engagement (${data.activeAddresses}), investor psychology (${data.fearGreedIndex}), and daily change (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Provide rationale for your advice.`,

    `${data.symbol} market assessment: Invest, divest, or maintain status quo? Examine technical metrics (SMA: ${data.sma}, EMA: ${data.dema}, RSI: ${data.rsi}, Vol: ${data.volume}), fundamental data (Market Cap: ${data.marketCap}, Network Usage: ${data.activeAddresses}), market sentiment (F&G: ${data.fearGreedIndex}), and 24hr performance (${data.priceAppriciation.percentage}% ${data.priceAppriciation.trend}). Justify your recommendation.`,
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  const promptWithValues = prompt.replace(
    /{{(.*?)}}/g,
    (match, p1) => data[p1]
  );
  return promptWithValues;
};

module.exports = { genericResponse, delay, downloadXlsx, returnPromptWithData };
