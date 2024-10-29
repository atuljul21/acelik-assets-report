const utils = require("../static/utils");

async function getToken() {
  try {
    const response = await utils.axios({
      method: "post",
      url: utils.APR_CREDENTIALS.API_URL,
      headers: {
        "Content-Type": "application/json",
        "client-id": utils.APR_CREDENTIALS.client_id,
        Authorization: `Basic ${utils.APR_CREDENTIALS.Auth_Token}`,
      },
    });
    return response.data; // With axios, response.json() is not needed, as axios automatically parses the JSON response
  } catch (error) {
    console.error("Error while getting token:", error);
    throw error; // Re-throw the error to handle it later
  }
}


module.exports = getToken;
