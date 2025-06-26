/* eslint-disable */
// @ts-nocheck

import "dotenv/config";
// Use explicit file extensions in the import statements in this file.

import cron from "node-cron";
import {
  addOneDayToDaysSinceLastCriticalError,
  evaluateAndGrantFirstAward,
  evaluateAndGrantSecondAward,
  evaluateAndGrantThirdAward
} from "./cron-lib.js";


let isScheduled_daily_counter_cron = false;
let isScheduled_every_month_start = false;
let isScheduled_march_31_630pm = false;
let isScheduled_june_30_630pm = false;
let isScheduled_september_30_630pm = false;
let isScheduled_december_30_630pm = false;


// DAILY: Adds 1 day to the "days since last critical error" counter.
if (!isScheduled_daily_counter_cron) {
  console.log(`[${new Date().toISOString()}] :: `, "Scheduling daily task")

  cron.schedule("0 0 * * *", async () => {
    console.log(`[${new Date().toISOString()}] :: `, "Adding 1 day without critical errors to the current period...")
    await addOneDayToDaysSinceLastCriticalError()
  }, {
    timezone: "America/Mexico_City"
  });  

  isScheduled_daily_counter_cron = true;

}

// START OF EVERY MONTH
// The third award needs to be evaluated in the same month/period
// so separate cron jobs are required for it.
if (!isScheduled_every_month_start) {

  console.log(`[${new Date().toISOString()}] :: `, "Scheduling monthly task")

  cron.schedule("0 1 0 1 * *", async () => {
    console.log(`[${new Date().toISOString()}] :: Start of the month event.`);
    await evaluateAndGrantFirstAward()
    await evaluateAndGrantSecondAward()
  }, {
    timezone: "America/Mexico_City"
  });

  isScheduled_every_month_start = true;

}

// MARCH 31 at 6:30:00 PM
if (!isScheduled_march_31_630pm) {

  console.log(`[${new Date().toISOString()}] :: `, "Scheduling task of March 31st, 6:30 PM")

  cron.schedule("0 30 18 31 3 *", async () => {
    console.log(`[${new Date().toISOString()}] :: March 31, 6:30 PM event triggered: 3rd award evaluation.`);
    await evaluateAndGrantThirdAward()
  }, {
    timezone: "America/Mexico_City"
  });

  isScheduled_march_31_630pm = true;
}

// JUNE 30 at 6:30:00 PM
if (!isScheduled_june_30_630pm) {

  console.log(`[${new Date().toISOString()}] :: `, "Scheduling task of June 30th, 6:30 PM")

  cron.schedule("0 30 18 30 6 *", async () => {
    console.log(`[${new Date().toISOString()}] :: June 30, 6:30 PM event triggered: 3rd award evaluation.`);
    await evaluateAndGrantThirdAward()
  }, {
    timezone: "America/Mexico_City"
  });

  isScheduled_june_30_630pm = true;
}

// SEPTEMBER 30 at 6:30:00 PM
if (!isScheduled_september_30_630pm) {

  console.log(`[${new Date().toISOString()}] :: `, "Scheduling task of September 30th, 6:30 PM")

  cron.schedule("0 30 18 30 9 *", async () => {
    console.log(`[${new Date().toISOString()}] :: September 30, 6:30 PM event triggered: 3rd award evaluation.`);
    await evaluateAndGrantThirdAward()
  }, {
    timezone: "America/Mexico_City"
  });

  isScheduled_september_30_630pm = true;
}

// DECEMBER 31 at 6:30:00 PM
if (!isScheduled_december_30_630pm) {

  console.log(`[${new Date().toISOString()}] :: `, "Scheduling task of December 30th, 6:30 PM")

  cron.schedule("0 30 18 31 12 *", async () => {
    console.log(`[${new Date().toISOString()}] :: December 31, 6:30 PM event triggered: 3rd award evaluation.`);
    await evaluateAndGrantThirdAward()
  }, {
    timezone: "America/Mexico_City"
  });

  isScheduled_december_30_630pm = true;
}