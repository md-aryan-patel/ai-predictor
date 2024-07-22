const { OpenAI } = require("openai");
const { returnPromptWithData } = require("../helper");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.SECREAT_KEY,
});

async function trainModel() {
  try {
    const filePath = path.join(__dirname, "../../data.json");

    // Upload the training file
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

    // Monitor the fine-tuning progress
    let status = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);
    console.log("Status:", status.status);

    // Wait for the fine-tuning to complete
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
      console.error("Fine-tuning failed.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const analyzeCryptoData = async (data) => {
  // const prompt = returnPromptWithData(data);
  // const results = [];
  const trainedModel = await trainModel();
  console.log(res);
};

(async () => {
  const data = await trainModel();
  console.log(data);
})().catch((err) => {
  console.log(err);
});

module.exports = { analyzeCryptoData };
