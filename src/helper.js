const genericResponse = (type, msg) => {
  return { Type: type, Message: msg };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const data = {
  technical: {
    sma: 71006.8946666666,
    rsi: 60.358892949257324,
    dema: 71095.06887239758,
    volume: 13361119418.41706,
  },
  fundamental: {
    marketCap: 458912304591.04926,
    activeAddresses: 1234567890,
    transactionVolume: 1234567890,
    regulatoryNews: "Neutral, nothing much",
  },
  sentiment: {
    fearGreedIndex: 65,
  },
};

module.exports = { genericResponse, delay, data };
