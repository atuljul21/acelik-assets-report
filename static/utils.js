const fs = require("fs");
const path = require("path");
const axios = require("axios");
const winston = require("winston");
const XLSX = require("xlsx");
const APR_CREDENTIALS = JSON.parse(fs.readFileSync("aprimo-configration-prod.json"));
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "ad-line-app-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "ad-line-app-notice.log",
      level: "warn",
    }),
    new winston.transports.File({ filename: "ad-line-app-combined.log" }),
  ],
});

module.exports = {
  fs,
  path,
  axios,
  XLSX,
  APR_CREDENTIALS,
  logger
};
