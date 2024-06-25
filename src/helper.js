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

module.exports = { genericResponse, delay, downloadXlsx };
