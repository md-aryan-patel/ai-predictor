const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

const analyzeCryptoData = async (data) => {
  const prompt = `
Given the following data for a cryptocurrency: ${data.symbol}, analyze whether to buy or sell the token, based on the outcome promopt, is it right time to sell, hold, or right time to buy:

Technical Data:
- 24-hr SMA: ${data.sma}
- 24-hr EMA: ${data.dema}
- RSI: ${data.rsi}
- Volume: ${data.volume} 

Fundamental Data:
- Market Cap: ${data.marketCap}
- Active Addresses: ${data.activeAddresses}

Sentiment Data:
- Fear and Greed Index: ${data.fearGreedIndex}

Last 24hr price movement:
- price difference(in %): ${data.priceAppriciation.percentage}
- trend: ${data.priceAppriciation.trend}

Based on the above data, is the cryptocurrency movement likely to be bullish or bearish and also tell is likely to buy or not? Provide a brief explanation.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: prompt }],
  });

  return response;
};

module.exports = { analyzeCryptoData };
