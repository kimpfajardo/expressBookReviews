const axios = require("./axios");

(async function getBooksByAuthor(_author) {
  try {
    const author = encodeURIComponent(`${_author}`.toLowerCase());
    const res = await axios.get(`/author/${author}`);
    console.log(`Books authored by ${_author}`, res.data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("GET books by author request completed");
  }
})("Chinua Achebe");
