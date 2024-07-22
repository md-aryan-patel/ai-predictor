const { OpenAI } = require("openai");
const fs = require("fs");

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

async function getResultFromModel(prompt) {
  try {
    const completion = await openai.completions.create({
      model: "gpt-4o",
      prompt: prompt,
      max_tokens: 50,
    });

    console.log("Model response:", completion.choices[0].text);
    return completion.choices[0].text;
  } catch (error) {
    console.error("Error getting result:", error);
    return null;
  }
}
