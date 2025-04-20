const axios = require("./axios");

(async function getBooksByTitle(_title) {
  try {
    const title = encodeURIComponent(`${_title}`.toLowerCase());
    const res = await axios.get(`/title/${title}`);
    console.log(`Books with title: "${_title}"`, res.data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("GET book by title request completed");
  }
})("Things Fall Apart");
