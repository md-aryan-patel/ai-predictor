const { getHourlyData } = require("./api/cryptoData");
const cron = require("node-cron");
const { downloadXlsx, convertJsonToJsonl } = require("./helper");
const { readDataFromFile } = require("./readers");
const tokenData = require("../data.json");
const { analyzeCryptoData } = require("./openai");
const path = require("path");
const writeJsonl = require("json-to-jsonl");
require("dotenv").config();

const main = async () => {
  const args = process.argv.slice(2);
  let symbol = args[0] ? args[0] : process.env.DEFAULT_TOKEN;
  console.log(`Your aggreegate symbol is ${symbol}`);
  // startScheduledJob(symbol);
  await getSimilarTokenData(symbol);
};

const startScheduledJob = async (symbol) => {
  // chron syntex for one hour: "0 * * * *"
  let count = 0;
  const maxHour = 24;
  const task = cron.schedule("* * * * *", async () => {
    count++;
    console.log("___aggregating hourly data___");
    await getHourlyData(symbol);
    const data = await readDataFromFile();
    await downloadXlsx(data);

    if (count >= maxHour) {
      console.log("___task completed after 24hr___");
      task.stop();
      process.exit();
    }
  });
};

const createPrompt = async () => {
  await convertJsonToJsonl(tokenData);
};

const writeToJsonl = async () => {
  const relativePath = path.join(__dirname, "../crypto_data.json");
  console.log(relativePath);
  writeJsonl(relativePath);
};

const getSimilarTokenData = async (symbol) => {
  // convertJsonToJsonl(tokenData);
  // await writeToJsonl();
  console.log("Getting similar tokens");
  const data = await getHourlyData(symbol);
  const resp = await analyzeCryptoData(data);
  console.log(resp);
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
