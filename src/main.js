const { getHourlyData } = require("./api/cryptoData");
const cron = require("node-cron");
const { downloadXlsx } = require("./helper");
const { readDataFromFile } = require("./readers");
require("dotenv").config();

const main = async () => {
  const args = process.argv.slice(2);
  let symbol = args[0] ? args[0] : process.env.DEFAULT_TOKEN;
  console.log(`Your aggreegate symbol is ${symbol}`);
  startScheduledJob(symbol);
};

const startScheduledJob = async (symbol) => {
  // chron syntex for one hour: "0 0 * * *"
  cron.schedule("* * * * *", async () => {
    console.log("___aggregating hourly data___");
    await getHourlyData(symbol);
    const data = await readDataFromFile();
    await downloadXlsx(data);
  });
};

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
