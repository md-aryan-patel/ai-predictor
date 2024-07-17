const { OpenAI } = require("openai");
const { returnPromptWithData } = require("../helper");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

const analyzeCryptoData = async (data) => {
  // const prompt = returnPromptWithData(data);

  const prompt = `{
  symbol: 'CAKE',
  sma: 1.7843333333333335,
  rsi: 53.914229430527236,
  dema: 1.7974000549504991,
  volume: 25657824.36195749,
  percentageChange1hr: -0.62091726,
  percentageChange24hr: 3.15090321,
  percentageChange7d: -14.03884663,
  marketCap: 484341203.0476364,
  activeAddresses: 1234567890,
  fearGreedIndex: '27',
  priceAppriciation: { trend: 'up', percentage: 2.6225769669327272 },
  news: '',
  fdv: 812106274.26
} The provided data is based on current/live market based on the data provided can you give me the   
similar tokens name and values from current/live market, state the date of from which you have aggregated the similar tokens data`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
  });

  return { prompt, response: response.choices[0].message.content };
};

module.exports = { analyzeCryptoData };
