const utils = require("../static/utils");

async function fetchRecordData(token, recordId) {
    try {
      console.log("coming here");
      const resp = await utils.axios.get(
        utils.APR_CREDENTIALS.getRecord + recordId,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "API-VERSION": utils.APR_CREDENTIALS.Api_version,
            Authorization: `Bearer ${token}`,
            "select-record":"masterfilelatestversion,fields",
            "select-file":"fileversion",
            "select-fileversion":"additionalfiles"          },
        }
      );
      // console.log("response data",resp.data);
      return resp.data;
    } catch (error) {
      utils.logger.info("Error in Get Campaign ==============", error);
      console.log(new Date() + "||", "001:: Error in Update", error);
    }
  }

  module.exports = fetchRecordData;