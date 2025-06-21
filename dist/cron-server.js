import cron from "node-cron";
import { addOneDayToDaysSinceLastCriticalError } from "../../app/actions/periods";
let isScheduled_daily_counter_cron = false;
// DAILY: Adds 1 day to the "days since last critical error" counter.
if (!isScheduled_daily_counter_cron) {
    cron.schedule("1 * * * * *", async () => {
        await addOneDayToDaysSinceLastCriticalError();
    });
    isScheduled_daily_counter_cron = true;
}
