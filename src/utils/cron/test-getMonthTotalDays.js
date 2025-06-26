import { getMonthTotalDays } from './cron-lib.js';

for (let month = 1; month <= 12; month++) {
  console.log(`Month ${month}: ${getMonthTotalDays(month)} days`);
} 