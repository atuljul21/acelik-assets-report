// const utils = require("../static/utils");
// const XLSX = utils.XLSX;
// const getAdditionalFileTitle = require('./getAdditionalFileTitle');
// const fs = require("fs").promises;
// const path = require("path");

// async function createExcelSheet() {
//     try {
//         const data = await fs.readFile(path.join(__dirname, '../recordIds.json'), 'utf8');
//         const recordIds = JSON.parse(data);

//         const workbook = XLSX.utils.book_new();
//         const sheetData = [["Record Id", "Additional Files"]];

//         let processedCount = 0;

//         for (let recordId of recordIds) {
//             const result = await getAdditionalFileTitle(recordId);
//             sheetData.push([result.recordId, result.fileNames]);

//             processedCount++;
//             console.log(`Processed Record ID: ${recordId} (Total processed: ${processedCount})`);
//         }

//         const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Additional Files");

//         const fileName = 'AdditionalFiles_Report.xlsx';
//         XLSX.writeFile(workbook, fileName);
//         console.log(`Excel file created: ${fileName}`);
//     } catch (error) {
//         console.error("Error creating Excel sheet:", error);
//     }
// }

const utils = require("../static/utils");
const Auth = require("../Auth/AuthToken");
const fetchRecord = require("./fetchRecordData");
const fs = require("fs").promises;
const path = require("path");
const XLSX = utils.XLSX;
const getAdditionalFileTitle = require("./getAdditionalFileTitle");
const MAX_CELL_LENGTH = 32767; // Excel cell character limit
const START_CHUNK = 5; // Starting from the 5th chunk

async function createExcelSheet() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../recordIds.json"),
      "utf8"
    );
    const recordIds = JSON.parse(data);

    const chunkSize = 5000;
    const totalChunks = Math.ceil(recordIds.length / chunkSize);

    // Start processing from the 5th chunk
    for (let i = START_CHUNK - 1; i < totalChunks; i++) {
      // Create a new workbook for each chunk
      const workbook = XLSX.utils.book_new();
      const sheetData = [["Record Id", "VXNumber", "Additional Files"]]; // Header row

      let start = i * chunkSize;
      let end = Math.min(start + chunkSize, recordIds.length);

      let processedCount = 0;

      // Process each chunk separately
      for (let j = start; j < end; j++) {
        const recordId = recordIds[j];
        const result = await getAdditionalFileTitle(recordId);

        let fileNames = result.fileNames;
        let VXNumber = result.VXNumber || "null";
        // Check if fileNames exceed the maximum cell length
        if (fileNames.length > MAX_CELL_LENGTH) {
          console.warn(
            `File names for Record ID ${recordId} exceed Excel's cell character limit. Truncating...`
          );
          fileNames = fileNames.slice(0, MAX_CELL_LENGTH - 3) + "..."; // Truncate and add ellipsis
        }

        sheetData.push([result.recordId, VXNumber, fileNames]);

        processedCount++;
        console.log(
          `Processed Record ID: ${recordId} (Total processed in chunk ${i + 1
          }: ${processedCount})`
        );
      }

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Additional Files`);

      const fileName = `AdditionalFiles_Report-${i + 1}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      console.log(`Excel file created: ${fileName}`);
    }
  } catch (error) {
    console.error("Error creating Excel sheet:", error);
  }
}

module.exports = createExcelSheet;

// const utils = require("../static/utils");
// const Auth = require("../Auth/AuthToken");
// const fetchRecord = require("./fetchRecordData");
// const fs = require("fs").promises;
// const path = require("path");
// const XLSX = utils.XLSX;
// const getAdditionalFileTitle = require("./getAdditionalFileTitle");
// const MAX_CELL_LENGTH = 32767; // Excel cell character limit
// const START_CHUNK = 1; // Start from the first chunk for testing

// async function createExcelSheet() {
//   try {
//     const data = await fs.readFile(
//       path.join(__dirname, "../recordIds2.json"),
//       "utf8"
//     );
//     const recordIds = JSON.parse(data);

//     const chunkSize = 5; // Smaller chunk size for testing
//     const totalChunks = Math.ceil(recordIds.length / chunkSize);

//     // Process starting from the first chunk for testing
//     for (let i = START_CHUNK - 1; i < totalChunks; i++) {
//       const workbook = XLSX.utils.book_new();
//       const sheetData = [["Record Id", "VXNumber", "Additional Files"]]; // Header row

//       let start = i * chunkSize;
//       let end = Math.min(start + chunkSize, recordIds.length);

//       let processedCount = 0;

//       for (let j = start; j < end; j++) {
//         const recordId = recordIds[j];
//         const result = await getAdditionalFileTitle(recordId);

//         let fileNames = result.fileNames;
//         let VXNumber = result.VXNumber;
//         if (fileNames.length > MAX_CELL_LENGTH) {
//           console.warn(
//             `File names for Record ID ${recordId} exceed Excel's cell character limit. Truncating...`
//           );
//           fileNames = fileNames.slice(0, MAX_CELL_LENGTH - 3) + "...";
//         }

//         sheetData.push([result.recordId, VXNumber, fileNames]);

//         processedCount++;
//         console.log(
//           `Processed Record ID: ${recordId} (Total processed in chunk ${i + 1
//           }: ${processedCount})`
//         );
//       }

//       const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
//       XLSX.utils.book_append_sheet(workbook, worksheet, `Additional Files`);

//       const fileName = `AdditionalFiles_Report-${i + 1}.xlsx`;
//       XLSX.writeFile(workbook, fileName);
//       console.log(`Excel file created: ${fileName}`);
//     }
//   } catch (error) {
//     console.error("Error creating Excel sheet:", error);
//   }
// }

// module.exports = createExcelSheet;

