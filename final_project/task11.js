const axios = require("./axios");

(async function getBooksByISBN(isbn) {
  try {
    const res = await axios.get(`/isbn/${isbn}`);
    console.log("Books", res.data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("GET books request completed");
  }
})(1);
