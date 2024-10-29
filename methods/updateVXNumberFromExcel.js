const utils = require("../static/utils");
const path = require("path");
const xlsx = utils.XLSX;
const fetchRecord = require('./fetchRecordData');
const Auth = require("../Auth/AuthToken");

const filePath = './AdditionalFiles_Report-1.xlsx';

async function updateVXNumberInExcel() {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const authToken = await Auth();
        const token = authToken.accessToken;

        let totalProcessed = 0;  // Counter for total processed records
        let totalUpdated = 0;     // Counter for updated VXNumber records

        for (const row of data) {
            if (row.VXNumber === null || row.VXNumber === 'null') {
                const recordId = row["Record Id"];

                const record = await fetchRecord(token, recordId);
                const targetField = record._embedded?.fields?.items?.find(
                    (item) => item.id === "dddacd6a928f442c8101affe00e69ef3"
                );

                totalProcessed++;  // Increment total processed counter

                if (targetField) {
                    const newVXNumber = targetField.localizedValues[0]?.value || "null";
                    if (newVXNumber.startsWith("VX")) {
                        row.VXNumber = newVXNumber;  // Update the VXNumber in the row data
                        totalUpdated++;  // Increment updated counter
                        console.log(`Updated row for record ${recordId} with VXNumber: ${newVXNumber}. Total updated: ${totalUpdated}`);
                    } else {
                        row.VXNumber = "null"; // If it doesn't start with "VX", set it to "null"
                        console.log(`Record ${recordId} found but VXNumber does not start with "VX". Total processed: ${totalProcessed}`);
                    }
                } else {
                    row.VXNumber = "null"; // If target field doesn't exist
                    console.log(`Record ${recordId} not found. Total processed: ${totalProcessed}`);
                }
            }
        }

        const updatedSheet = xlsx.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = updatedSheet;

        xlsx.writeFile(workbook, filePath);
        console.log("Excel file updated successfully!");

        // Log final counts after processing all records
        console.log(`Final count - Total records processed: ${totalProcessed}`);
        console.log(`Final count - Total records updated with valid VXNumber: ${totalUpdated}`);

    } catch (error) {
        console.error("Error updating VXNumber in Excel:", error);
    }
}

module.exports = updateVXNumberInExcel;
