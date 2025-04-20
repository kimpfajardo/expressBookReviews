const _axios = require("axios");

const axiosInstance = _axios.create({
  baseURL: "http://localhost:8000",
});

module.exports = axiosInstance;
