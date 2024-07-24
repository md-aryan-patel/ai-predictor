const { OpenAI } = require("openai");
const { returnPromptWithData } = require("../helper");
const fs = require("fs");
const path = require("path");
const { get } = require("http");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

const getFintuneJobState = async () => {
  let fineTune = await openai.fineTuning.jobs.retrieve(
    "file-zhupFI273lIpoR9d9P1oGWGX"
  );
  console.log(fineTune);
};

const getFinetunejobs = async () => {
  let page = await openai.fineTuning.jobs.list({ limit: 10 });
  console.log(page);
};

async function trainModel() {
  try {
    const filePath = path.join(__dirname, "../../crypto_data.jsonl");
    console.log(filePath);
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "fine-tune",
    });
    console.log("File uploaded successfully. File ID:", file.id);

    const fineTuningJob = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: "gpt-3.5-turbo",
    });

    console.log("Fine-tuning job created. Job ID:", fineTuningJob.id);

    let status = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);
    console.log("Status:", status.status);

    while (status.status !== "succeeded" && status.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
      status = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);
      console.log("Status:", status.status);
    }

    if (status.status === "succeeded") {
      console.log(
        "Fine-tuning completed. Model name:",
        status.fine_tuned_model
      );
      return status.fine_tuned_model;
    } else {
      console.error("Fine-tuning failed.\n", status.error);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const analyzeCryptoData = async (data) => {
  const prompt = returnPromptWithData(data);
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "ft:gpt-3.5-turbo-0125:personal::9oA5648D",
  });
  return completion.choices[0];
};

// getFintuneJobState();
// getFinetunejobs();

module.exports = { analyzeCryptoData, getFintuneJobState };
