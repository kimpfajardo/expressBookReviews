const axios = require("./axios");

(async function getBooks() {
  try {
    const res = await axios.get("/");
    console.log("Books", res.data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("GET books request completed");
  }
})();
