#!/usr/bin/env node
/* eslint-disable */
// @ts-nocheck

import "dotenv/config";
import { addOneDayToDaysSinceLastCriticalError } from "./cron-lib.js";

async function testDailyCron() {
  console.log(`[${new Date().toISOString()}] :: TESTING - Starting manual daily cron test...`);
  
  try {
    await addOneDayToDaysSinceLastCriticalError();
    console.log(`[${new Date().toISOString()}] :: TESTING - Daily cron test completed successfully!`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] :: TESTING - Error during daily cron test:`, error);
  }
}

// Run the test
testDailyCron();