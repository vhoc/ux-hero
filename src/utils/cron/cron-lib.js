import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'

/**
 * @typedef {import('types').IPeriod} IPeriod
 */

export const getCurrentPeriod = async () => {

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL or Key is not defined in the environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    /** @type {import('@supabase/supabase-js').PostgrestSingleResponse<IPeriod>} */
    const { data, error } = await supabase
      .from('periods')
      .select('*')
      .lte('start_date', todayISO)
      .gte('end_date', todayISO)
      .limit(1)
      .single();

    if (error) {
      console.error(`[${new Date().toISOString()}] :: `, 'Error fetching period: ', error)
    }

    if (data) {
      // console.log(`[${new Date().toISOString()}] :: `, 'Current period found: ', data)
      return data
    } else {
      console.log(`[${new Date().toISOString()}] :: `, 'No period found')
      return null
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] :: `, 'An unexpected error occurred:', error);
    return null;
  }
}

export const addOneDayToDaysSinceLastCriticalError = async () => {

  try {

    const currentPeriod = await getCurrentPeriod()

    if (currentPeriod?.days_without_criticals) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL or Key is not defined in the environment variables.");
      }

      const newDaysWithoutCriticals = currentPeriod.days_without_criticals + 1;
      console.log(`[${new Date().toISOString()}] ::`, 'New days without critical errors: ', newDaysWithoutCriticals)

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error }  = await supabase
        .from('periods')
        .update({ days_without_criticals: newDaysWithoutCriticals })
        .eq('id', currentPeriod.id)
        .select();
  
      if (error) {
        console.error(`[${new Date().toISOString()}] :: `, 'Error updating period\'s days since last critical error: ', error)
      }
  
      if (data) {
        console.log(`[${new Date().toISOString()}] :: `, 'Successfully added 1 day to the period\'s days since last critical error updated')
      }
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] :: `, 'An unexpected error occurred:', error);
  }
}

/**
 * @param {Date} current_date
 */
export const evaluateAndGrantFirstAward = async (current_date) => {
  const trigger_months = [
    {
      month: 0,// January
      days: 31
    },
    {
      month: 3,// April
      days: 30
    },
    {
      month: 6,// July
      days: 31
    },
    {
      month: 9,// October
      days: 31
    }
  ]
  const current_period = await getCurrentPeriod()

  // If Month in current_date is in triggerMonths...
  if (trigger_months.some(month => month.month === current_date.getMonth())) {// Update this conditional to use the months array instead of triggerMonths

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const current_month = current_date.getMonth()
    const current_month_days = trigger_months.find(month => month.month === current_month).days

    const next_month = current_month + 1
    const next_month_days = trigger_months.find(month => month.month === next_month).days

    /**
     * CONDITIONS TO GRANT THE FIRST AWARD:
     *  1. Current period's first award has not been granted yet.
     *  2. 'Days without critical errors' is equal or greater than the current month's total days.
     *  3. 'Days without critical errors' is less than the next month's total days.
     */
    if (current_period?.achieved_1 === null && current_period?.days_without_criticals >= current_month_days && current_period?.days_without_criticals < current_month_days + next_month_days) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('periods')
        .update({ achieved_1: 1 })
        .eq('id', current_period.id)
        .select();

      if (error) {
        console.error(`[${new Date().toISOString()}] :: `, 'Error updating period\'s achieved_1: ', error)
      }

      if (data) {
        console.log(`[${new Date().toISOString()}] :: `, 'Successfully granted the period\'s first award. Award ID: 1')
      }

    } else {
      console.log(`[${new Date().toISOString()}] :: `, 'No conditions were met to grant the period\'s first award. Award ID: 1')
    }
  }

}