// const utils = require("../static/utils");
// const path = require("path");
// const xlsx = utils.XLSX;
// const fetchRecord = require('./fetchRecordData');
// const Auth = require("../Auth/AuthToken");

// const filePath = './AdditionalFiles_Report-1.xlsx';

// async function updateVXNumberInExcel() {
//     try {
//         const workbook = xlsx.readFile(filePath);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(sheet);

//         let totalProcessed = 0;  // Counter for total processed records
//         let totalUpdated = 0;     // Counter for updated VXNumber records

//         for (const row of data) {
//             if (row.VXNumber === null || row.VXNumber === 'null') {
//                 const recordId = row["Record Id"];
//                 const authToken = await Auth();
//                 const token = authToken.accessToken;
//                 const record = await fetchRecord(token, recordId);
//                 const targetField = record._embedded?.fields?.items?.find(
//                     (item) => item.id === "dddacd6a928f442c8101affe00e69ef3"
//                 );

//                 totalProcessed++;  // Increment total processed counter

//                 if (targetField) {
//                     const newVXNumber = targetField.localizedValues[0]?.value || "null";
//                     if (newVXNumber.startsWith("VX")) {
//                         row.VXNumber = newVXNumber;  // Update the VXNumber in the row data
//                         totalUpdated++;  // Increment updated counter
//                         console.log(`Updated row for record ${recordId} with VXNumber: ${newVXNumber}. Total updated: ${totalUpdated}`);
//                     } else {
//                         row.VXNumber = "null"; // If it doesn't start with "VX", set it to "null"
//                         console.log(`Record ${recordId} found but VXNumber does not start with "VX". Total processed: ${totalProcessed}`);
//                     }
//                 } else {
//                     row.VXNumber = "null"; // If target field doesn't exist
//                     console.log(`Record ${recordId} not found. Total processed: ${totalProcessed}`);
//                 }
//             }
//         }

//         const updatedSheet = xlsx.utils.json_to_sheet(data);
//         workbook.Sheets[sheetName] = updatedSheet;

//         xlsx.writeFile(workbook, filePath);
//         console.log("Excel file updated successfully!");

//         // Log final counts after processing all records
//         console.log(`Final count - Total records processed: ${totalProcessed}`);
//         console.log(`Final count - Total records updated with valid VXNumber: ${totalUpdated}`);

//     } catch (error) {
//         console.error("Error updating VXNumber in Excel:", error);
//     }
// }

// module.exports = updateVXNumberInExcel;


// const utils = require("../static/utils");
// const xlsx = utils.XLSX;
// const fetchRecord = require("./fetchRecordData");
// const Auth = require("../Auth/AuthToken");

// const filePath = "./AdditionalFiles_Report-2.xlsx";

// async function updateVXNumberInExcel() {
//   try {
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     let totalProcessed = 0; // Counter for total processed records
//     let totalUpdated = 0; // Counter for updated VXNumber records

//     // Debug: Check the range of the sheet
//     const range = xlsx.utils.decode_range(sheet["!ref"]);
//     console.log(`Sheet Range: ${sheet["!ref"]}`);

//     // Log the structure of the sheet to see how the data is stored
//     const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
//     console.log("Sheet Data Preview:", data.slice(0, 10)); // Log the first 10 rows for inspection

//     // Find the column numbers for Record Id and VXNumber based on the headers
//     const headers = data[0];
//     const recordIdIndex = headers.indexOf("Record Id");
//     const vxNumberIndex = headers.indexOf("VXNumber");

//     if (recordIdIndex === -1 || vxNumberIndex === -1) {
//       throw new Error(
//         'Could not find required headers: "Record Id" or "VXNumber" in the sheet.'
//       );
//     }

//     console.log(
//       `Record Id Column Index: ${recordIdIndex}, VXNumber Column Index: ${vxNumberIndex}`
//     );

//     // Iterate over each row in the sheet, starting from row 2 (to skip the header)
//     for (let rowNum = 1; rowNum < data.length; rowNum++) {
//       const row = data[rowNum];

//       const recordId = row[recordIdIndex];
//       let vxNumber = row[vxNumberIndex];

//       // Log the row data for debugging
//       console.log(
//         `Processing Row ${
//           rowNum + 1
//         }: Record Id = ${recordId}, VXNumber = ${vxNumber}`
//       );

//       if (vxNumber === null || vxNumber === "null") {
//         if (recordId) {
//           const authToken = await Auth();
//           const token = authToken.accessToken;
//           const record = await fetchRecord(token, recordId);
//           const targetField = record._embedded?.fields?.items?.find(
//             (item) => item.id === "dddacd6a928f442c8101affe00e69ef3"
//           );

//           totalProcessed++; // Increment total processed counter

//           let newVXNumber = "null"; // Default value if VXNumber not found
//           if (targetField) {
//             newVXNumber = targetField.localizedValues[0]?.value || "null";
//             if (newVXNumber.startsWith("VX")) {
//               totalUpdated++; // Increment updated counter
//               console.log(
//                 `Updated row for record ${recordId} with VXNumber: ${newVXNumber}. Total updated: ${totalUpdated}`
//               );
//             } else {
//               console.log(
//                 `Record ${recordId} found but VXNumber does not start with "VX". Total processed: ${totalProcessed}`
//               );
//             }
//           } else {
//             console.log(
//               `Record ${recordId} not found. Total processed: ${totalProcessed}`
//             );
//           }

//           // Update the VXNumber cell in the current row
//           row[vxNumberIndex] = newVXNumber;

//           // Convert the updated data back to sheet format and write to the file
//           const updatedSheet = xlsx.utils.aoa_to_sheet(data);
//           workbook.Sheets[sheetName] = updatedSheet;

//           // Write the updated file back to disk
//           xlsx.writeFile(workbook, filePath);
//           console.log(`Row ${rowNum + 1} updated in Excel file.`);
//         }
//       }
//     }

//     // Log final counts after processing all records
//     console.log(`Final count - Total records processed: ${totalProcessed}`);
//     console.log(
//       `Final count - Total records updated with valid VXNumber: ${totalUpdated}`
//     );
//   } catch (error) {
//     console.error("Error updating VXNumber in Excel:", error);
//   }
// }

// module.exports = updateVXNumberInExcel;

const utils = require("../static/utils");
const xlsx = utils.XLSX;
const fetchRecord = require("./fetchRecordData");
const Auth = require("../Auth/AuthToken");

const filePath = "./AdditionalFiles_Report-1.xlsx";

async function updateVXNumberInExcel() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let totalProcessed = 0; // Counter for total processed records
    let totalUpdated = 0; // Counter for updated VXNumber records

    // Debug: Check the range of the sheet
    const range = xlsx.utils.decode_range(sheet["!ref"]);
    console.log(`Sheet Range: ${sheet["!ref"]}`);

    // Log the structure of the sheet to see how the data is stored
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log("Sheet Data Preview:", data.slice(0, 10)); // Log the first 10 rows for inspection

    // Find the column numbers for Record Id and VXNumber based on the headers
    const headers = data[0];
    const recordIdIndex = headers.indexOf("Record Id");
    const vxNumberIndex = headers.indexOf("VXNumber");

    if (recordIdIndex === -1 || vxNumberIndex === -1) {
      throw new Error(
        'Could not find required headers: "Record Id" or "VXNumber" in the sheet.'
      );
    }

    console.log(
      `Record Id Column Index: ${recordIdIndex}, VXNumber Column Index: ${vxNumberIndex}`
    );

    // Iterate over each row in the sheet, starting from row 2 (to skip the header)
    for (let rowNum = 1; rowNum < data.length; rowNum++) {
      const row = data[rowNum];

      const recordId = row[recordIdIndex];
      let vxNumber = row[vxNumberIndex];

      // Log the row data for debugging
      console.log(
        `Processing Row ${
          rowNum + 1
        }: Record Id = ${recordId}, VXNumber = ${vxNumber}`
      );

      if (vxNumber === null || vxNumber === "null") {
        if (recordId) {
          const authToken = await Auth();
          const token = authToken.accessToken;
          const record = await fetchRecord(token, recordId);
          const targetField = record._embedded?.fields?.items?.find(
            (item) => item.id === "dddacd6a928f442c8101affe00e69ef3"
          );

          totalProcessed++; // Increment total processed counter

          let newVXNumber = "null"; // Default value if VXNumber not found
          if (targetField) {
            newVXNumber = targetField.localizedValues[0]?.value || "null";
            if (newVXNumber.startsWith("VX-")) {
              // If the VXNumber starts with "VX-", update it
              totalUpdated++; // Increment updated counter
              row[vxNumberIndex] = newVXNumber; // Update the VXNumber
              console.log(
                `Updated row for record ${recordId} with VXNumber: ${newVXNumber}. Total updated: ${totalUpdated}`
              );
            } else {
              // If it doesn't start with "VX-", print null
              console.log(
                `Record ${recordId} found but VXNumber does not start with "VX-". Setting to "null".`
              );
              row[vxNumberIndex] = "null"; // Set VXNumber to "null"
            }
          } else {
            console.log(
              `Record ${recordId} not found. Setting VXNumber to "null".`
            );
            row[vxNumberIndex] = "null"; // Set VXNumber to "null"
          }

          // Convert the updated data back to sheet format and write to the file
          const updatedSheet = xlsx.utils.aoa_to_sheet(data);
          workbook.Sheets[sheetName] = updatedSheet;

          // Write the updated file back to disk
          xlsx.writeFile(workbook, filePath);
          console.log(`Row ${rowNum + 1} updated in Excel file.`);
        }
      }
    }

    // Log final counts after processing all records
    console.log(`Final count - Total records processed: ${totalProcessed}`);
    console.log(
      `Final count - Total records updated with valid VXNumber: ${totalUpdated}`
    );
  } catch (error) {
    console.error("Error updating VXNumber in Excel:", error);
  }
}

module.exports = updateVXNumberInExcel;
