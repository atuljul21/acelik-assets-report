// const utils = require("../static/utils");

// async function fetchAllRecordsData(token, page, pageSize = 1000) {
//     try {
//         console.log(`Fetching records from page ${page}...`);

//         const resp = await utils.axios.get(utils.APR_CREDENTIALS.getRecords, {
//             headers: {
//                 Accept: "*/*",
//                 "Content-Type": "application/json",
//                 "API-VERSION": utils.APR_CREDENTIALS.Api_version,
//                 Authorization: `Bearer ${token}`,
//                 "pageSize": pageSize,
//                 "page": page
//             }
//         });

//         if (resp.data.items && resp.data.items.length > 0) {
//             return resp.data.items;
//         } else {
//             console.log("No records found.");
//             return [];
//         }
//     } catch (error) {
//         utils.logger.info("Error in Fetch All Records ==============", error);
//         console.log(new Date() + "||", "001:: Error in Fetch All Records", error);
//         return [];
//     }
// }

// async function fetchAllRecordIds(token) {
//     const allIds = new Set();
//     let page = 1;
//     let records;
//     let totalProcessed = 0;

//     const maxPages = 29;

//     do {
//         try {
//             if (page > maxPages) {
//                 console.log(`Reached the maximum page limit of ${maxPages}. Stopping fetch.`);
//                 break;
//             }

//             records = await fetchAllRecordsData(token, page);
//             totalProcessed += records.length;

//             if (records.length > 0) {
//                 records.forEach(record => allIds.add(record.id));
//                 console.log(`Processed page ${page}: ${records.length} records`);
//             }

//             page++;
//         } catch (error) {
//             console.error(`Error fetching records from page ${page}:`, error.message);
//             break;
//         }
//     } while (records && records.length > 0);

//     console.log(`Total records processed: ${totalProcessed}`);
//     console.log(`Total unique record IDs fetched: ${allIds.size}`);
//     return Array.from(allIds);
// }

// module.exports = fetchAllRecordIds;


const utils = require("../static/utils");

// Constants for configuration
const DEFAULT_PAGE_SIZE = 1000;
const MAX_PAGES = 29;

// Helper function to create headers
function createHeaders(token) {
  return {
    Accept: "*/*",
    "Content-Type": "application/json",
    "API-VERSION": utils.APR_CREDENTIALS.Api_version,
    Authorization: `Bearer ${token}`,
  };
}

async function fetchAllRecordsData(token, page, pageSize = DEFAULT_PAGE_SIZE) {
  try {
    console.log(`Fetching records from page ${page}...`);

    const response = await utils.axios.get(utils.APR_CREDENTIALS.getRecords, {
      headers: createHeaders(token),
      params: { pageSize, page }, // Using params for cleaner URL construction
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items;
    } else {
      console.log("No records found on page", page);
      return [];
    }
  } catch (error) {
    utils.logger.info("Error in Fetch All Records:", error);
    console.error(
      `${new Date()} || 001:: Error in Fetch All Records:`,
      error.message
    );
    return [];
  }
}

async function fetchAllRecordIds(token) {
  const allIds = new Set();
  let page = 1;
  let totalProcessed = 0;

  while (page <= MAX_PAGES) {
    const records = await fetchAllRecordsData(token, page);

    if (records.length === 0) {
      console.log(
        `No more records to process. Stopping fetch at page ${page}.`
      );
      break;
    }

    records.forEach((record) => allIds.add(record.id));
    totalProcessed += records.length;

    console.log(`Processed page ${page}: ${records.length} records`);
    page++;
  }

  console.log(`Total records processed: ${totalProcessed}`);
  console.log(`Total unique record IDs fetched: ${allIds.size}`);
  return Array.from(allIds);
}

module.exports = fetchAllRecordIds;

