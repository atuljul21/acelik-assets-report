// const utils = require("../static/utils");
// const Auth = require("../Auth/AuthToken");
// const fetchRecord = require("./fetchRecordData");

// async function getAdditionalFileTitle(recordId) {
//     const authToken = await Auth();
//     const token = authToken.accessToken;
//     const record = await fetchRecord(token, recordId);
//     let result = {
//         recordId: record.id,
//         fileNames: "No additional files found"
//     };

//     if (
//         record._embedded &&
//         record._embedded.masterfilelatestversion &&
//         record._embedded.masterfilelatestversion._embedded &&
//         record._embedded.masterfilelatestversion._embedded.additionalfiles &&
//         record._embedded.masterfilelatestversion._embedded.additionalfiles.items
//     ) {
//         const additionalFiles = record._embedded.masterfilelatestversion._embedded.additionalfiles.items;

//         const fileNames = additionalFiles
//             .filter(file => file.type === "AdditionalFile")
//             .map(file => file.fileName);

//         result.fileNames = fileNames.join(", ");
//     }

//     return result;
// }

// module.exports = getAdditionalFileTitle;

const utils = require("../static/utils");
const Auth = require("../Auth/AuthToken");
const fetchRecord = require("./fetchRecordData");

async function getAdditionalFileTitle(recordId) {
  try {
    // Step 1: Get the authentication token
    const authToken = await Auth();
    const token = authToken.accessToken;

    // Step 2: Fetch record data
    const record = await fetchRecord(token, recordId);
    // Step 3: Default response if no additional files are found
    let result = {
      recordId: record.id,
      fileNames: "No additional files found",
      VXNumber: null
    };

    const vxField = record._embedded?.fields?.items?.find(
      (item) => item.id === "7d4e61e0251f47368c67b0ba012a7ff6"
    );
    if (vxField && vxField.localizedValues) {
      result.VXNumber = vxField.localizedValues[0].value || null;
    }

    // Step 4: Check for the existence of the additional files in the record
    const additionalFiles =
      record._embedded?.masterfilelatestversion?._embedded?.additionalfiles?.items;
    if (additionalFiles) {
      const fileNames = additionalFiles
        .filter((file) => file.type === "AdditionalFile")
        .map((file) => file.fileName);

      result.fileNames = fileNames.length > 0 ? fileNames.join(", ") : "No additional files found";
    }

    return result;
  } catch (error) {
    // Log and handle Axios errors or any other errors that occur
    console.error(
      `Error fetching additional file title for Record ID: ${recordId}`
    );
    console.error("Error details:", error.message);

    // Return a result indicating failure or missing information
    return {
      recordId,
      fileNames: `Error retrieving files - ${error.response?.status || "Unknown status"
        }: ${error.message}`,
      VXNumber: "VX Number retrieval failed"
    };
  }
}

module.exports = getAdditionalFileTitle;

