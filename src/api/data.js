const axois = require("axios");
require("dotenv").config();

const cmcApi = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_KEY,
  },
});

const getAssetData = async () => {
  try {
    const response = await cmcApi.get("/v2/cryptocurrency/quotes/latest", {
      params: {
        slug: "bitcoin",
        skip_cache: true,
      },
    });

    const { data } = response;
    // Handle the API response data
    console.log(data.data.quote.bitcoin.price);
  } catch (error) {
    console.error(error);
  }
};

getAssetData();
