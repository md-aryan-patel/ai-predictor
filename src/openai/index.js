const { OpenAI } = require("openai");
const { prompts, returnPromptWithData } = require("../helper");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

const analyzeCryptoData = async (data) => {
  const prompt = returnPromptWithData(data);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: prompt }],
  });

  return { prompt, response: response.choices[0].message.content };
};

module.exports = { analyzeCryptoData };
