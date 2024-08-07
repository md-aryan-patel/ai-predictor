const fs = require("fs");

const readDataFromFile = async () => {
  const data = fs.readFileSync("data.json", "utf8");
  return JSON.parse(data);
};

const saveDaataToFile = async (data) => {
  let d = await readDataFromFile();
  d.push(data);
  fs.writeFile("data.json", JSON.stringify(d), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const saveDataToResponse = async (data) => {
  fs.writeFile("response.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const saveDataToCryptoResp = async (data) => {
  fs.writeFile("crypto_data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const saveXslx = async (xls) => {
  fs.writeFileSync("data.xlsx", xls, "binary");
};

module.exports = {
  saveDaataToFile,
  readDataFromFile,
  saveXslx,
  saveDataToResponse,
  saveDataToCryptoResp,
};
