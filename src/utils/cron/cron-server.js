import "dotenv/config";
//@ts-nocheck
// Use explicit file extensions in the import statements in this file.

import cron from "node-cron";
import { addOneDayToDaysSinceLastCriticalError } from "./cron-lib.js";


let isScheduled_daily_counter_cron = false;


// DAILY: Adds 1 day to the "days since last critical error" counter.
if (!isScheduled_daily_counter_cron) {

  cron.schedule("0 * * * *", async () => {
    console.log(`[${new Date().toISOString()}] :: `, "Adding 1 day without critical errors to the current period...")
    await addOneDayToDaysSinceLastCriticalError()
  });  

  isScheduled_daily_counter_cron = true;

}



