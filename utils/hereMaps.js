const ExpressError = require("../utils/ErrorHandler");
const baseUrl = `https://geocode.search.hereapi.com/v1`;
const apiKey = `nQ_PRuMHHuc_6GQdFKT6b8w7F4hU9ijXb7VtxfDIjb4`;

module.exports.geocode = async (address) => {
  const url = `${baseUrl}/geocode?q=${address}&limit=1&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    throw new ExpressError(error, 500);
  }
};
