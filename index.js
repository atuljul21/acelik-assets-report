const express = require("express");
const Auth = require("./Auth/AuthToken");
const utils = require("./static/utils");
const fs = require("fs").promises;
const app = express();
app.use(express.json());
const createExcelSheet = require("./methods/createExcel");
const fetchAllRecordIds = require("./methods/fetchAllRecordsData");
const runGetAdditionalFileTitle = async () => {
  try {
    const authToken = await Auth();
    const token = authToken.accessToken;
      await createExcelSheet();


      // const allRecordIds = await fetchAllRecordIds(token);
      // await fs.writeFile('recordIds.json', JSON.stringify(allRecordIds, null, 2));
      //   console.log("All record IDs have been saved to recordIds.json");
  } catch (error) {
      console.error("Error fetching additional file title:", error);
  }
};

runGetAdditionalFileTitle();

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
