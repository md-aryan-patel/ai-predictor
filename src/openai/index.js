const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

const analyzeCryptoData = async (data) => {
  const prompt = `
Given the following data for a cryptocurrency, analyze whether the movement is likely to be bullish or bearish:

Technical Data:
- 24-hr SMA: ${data.technical.sma}
- 24-hr EMA: ${data.technical.dema}
- RSI: ${data.technical.rsi}
- Volume: ${data.technical.volume} 

Fundamental Data:
- Market Cap: ${data.fundamental.marketCap}
- Active Addresses: ${data.fundamental.activeAddresses}
- Transaction Volume: ${data.fundamental.transactionVolume}
- Recent Regulatory News: ${data.fundamental.regulatoryNews}

Sentiment Data:
- Social Media Sentiment: ${data.sentiment.socialMedia}
- News and Media Coverage: ${data.sentiment.newsCoverage}
- Fear and Greed Index: ${data.sentiment.fearGreedIndex}

Based on the above data, is the cryptocurrency movement likely to be bullish or bearish? Provide a brief explanation.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: prompt }],
  });

  return response;
};

module.exports = { analyzeCryptoData };
