import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'

/**
 * 
 * @param {number} month 
 * @returns 
 */
export const getMonthTotalDays = (month) => {
  const date = new Date(new Date().getFullYear(), month, 0);
  return date.getDate();
}

/**
 * @param {Date} current_date
 * @param {Array<{month: number, days: number}>} trigger_months
 * @returns {Object}
 */
export const current_and_next_month = (current_date, trigger_months) => {
  console.log('current_and_next_month/current_date: ', current_date)
  console.log('current_and_next_month/trigger_months: ', JSON.stringify(trigger_months, 2, null))
  

  // Get the current month and its total days
  const current_month = current_date.getMonth() + 1 // KEEP IN MIND THAT MONTHS ARE 0-INDEXED IN JS
  const current_month_name = new Date(new Date().getFullYear(), current_month, 0).toLocaleString('es-ES', { month: 'long' });
  console.log('current_and_next_month/current_month_name: ', current_month_name)
  console.log('current_and_next_month/current_month: ', current_month)
  // Get the total days of the current month
  const current_month_days = getMonthTotalDays(current_month)
  console.log('current_and_next_month/current_month_days: ', current_month_days)


  // Two months ago
  const two_months_ago = current_month - 2;
  const two_months_ago_name = new Date(new Date().getFullYear(), two_months_ago, 0).toLocaleString('es-ES', { month: 'long' });
  console.log('current_and_next_month/two_months_ago_name: ', two_months_ago_name)
  const two_months_ago_days = getMonthTotalDays(two_months_ago);
  console.log('current_and_next_month/two_months_ago: ', two_months_ago)
  console.log('current_and_next_month/two_months_ago_days: ', two_months_ago_days)

  const previous_month = current_month - 1;
  // Show previos_month name
  const previous_month_name = new Date(new Date().getFullYear(), previous_month, 0).toLocaleString('es-ES', { month: 'long' });
  console.log('current_and_next_month/previous_month_name: ', previous_month_name)
  const previous_month_days = getMonthTotalDays(previous_month);
  console.log('current_and_next_month/previous_month: ', previous_month)
  console.log('current_and_next_month/previous_month_days: ', previous_month_days)

  const next_month = current_month + 1;
  const next_month_name = new Date(new Date().getFullYear(), next_month, 0).toLocaleString('es-ES', { month: 'long' });
  console.log('current_and_next_month/next_month_name: ', next_month_name)
  const next_month_days = getMonthTotalDays(next_month);
  console.log('current_and_next_month/next_month: ', next_month)
  console.log('current_and_next_month/next_month_days: ', next_month_days)

  return {
    two_months_ago,
    two_months_ago_days,
    previous_month,
    previous_month_days,
    current_month,
    current_month_days,
    next_month,
    next_month_days
  }
}

/**
 * @typedef {import('types').IPeriod} IPeriod
 * @param {Date} date // optional parameter to get the current period of a specific date
 */
export const getCurrentPeriod = async (date) => {

  const today = date ? date : new Date();
  const todayISO = today.toISOString();
  console.log('today', today)

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
 * EVALUATES AND GRANTS THE AWARD OF THE FIRST MONTH OF THE CURRENT PERIOD
 * 
 * @param {Date} current_date
 * @description Grants the award of the first month of the period if the conditions are met.
 * Only the first award (ID: 1) is possible to be granted in the first month of the period.
 */
export const evaluateAndGrantFirstAward = async (current_date) => {
  console.log('current_date', current_date)

  // This means the function should ONLY run at the start of the 2nd month of the period
  // because it sets the award for the first month of the period.
  const trigger_months = [
    {
      month: 1,// February
      days: 28
    },
    {
      month: 4,// May
      days: 31
    },
    {
      month: 7,// August
      days: 31
    },
    {
      month: 10,// November
      days: 30
    }
  ]

  const current_period = await getCurrentPeriod(current_date)// Remove current_date prop in production
  console.log('current_period', current_period)

  // If Month in current_date is in triggerMonths...
  if (trigger_months.some(month => month.month === current_date.getMonth())) {
    console.log('Current month is in trigger_months')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Get the total days of the current and next month
    const { previous_month_days, current_month_days } = current_and_next_month(current_date, trigger_months)
    
    console.log('current_period?.achieved_1', current_period?.achieved_1)
    console.log('current_period?.days_without_criticals', current_period?.days_without_criticals)
    console.log('previous_month_days', previous_month_days)
    console.log('current_month_days', current_month_days)
    console.log('previous_month_days + current_month_days', previous_month_days + current_month_days)

    /**
     * CONDITIONS TO GRANT THE FIRST AWARD (ONLY AWARD ID: 1 IS POSSIBLE TO BE GRANTED):
     *  1. Current period's first award has not been granted yet.
     *  2. 'Days without critical errors' is equal or greater than the current month's total days.
     *  3. 'Days without critical errors' is less than the next month's total days.
     */
    console.log('CONDITIONAL: ', {
      "current_period?.achieved_1 === null": current_period?.achieved_1 === null,
      "current_period?.days_without_criticals >= previous_month_days": current_period?.days_without_criticals >= previous_month_days,
      "current_period?.days_without_criticals < previous_month_days + current_month_days": current_period?.days_without_criticals < previous_month_days + current_month_days
    })
    if (
      current_period?.achieved_1 === null && 
      // Should evaluate previous' month days, not the current's
      current_period?.days_without_criticals >= previous_month_days && 
      current_period?.days_without_criticals < previous_month_days + current_month_days
    ) {
      console.log('GRANTING THE FIRST AWARD IN THE FIRST MONTH OF THE PERIOD')
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
  else {
    console.log('Current month is not in trigger_months')
  }

}

/**
 * EVALUATES AND GRANTS THE AWARD OF THE SECOND MONTH OF THE CURRENT PERIOD
 * 
 * @param {Date} current_date
 * @description Grants the award of the second month of the period if the conditions are met.
 * It can either be the Award ID: 2 or the Award ID: 1.
 */
export const evaluateAndGrantSecondAward = async (current_date) => {
  console.log('current_date', current_date)

  // This means the function should ONLY run at the start of the 3rd month of the period
  // because it sets the award for the second month of the period.
  const trigger_months = [
    {
      month: 2,// March
      days: 31
    },
    {
      month: 5,// June
      days: 30
    },
    {
      month: 8,// September
      days: 30
    },
    {
      month: 11,// December
      days: 31
    }
  ]

  const current_period = await getCurrentPeriod(current_date)
  console.log('current_period', current_period)

  // If Month in current_date is in triggerMonths...
  if (trigger_months.some(month => month.month === current_date.getMonth())) {
    console.log('Current month is in trigger_months')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Get the total days of the previous, current and next month
    const { two_months_ago_days, previous_month_days, current_month_days, next_month_days } = current_and_next_month(current_date, trigger_months)

    console.log('current_period?.achieved_1: ', current_period?.achieved_1)
    console.log('current_period?.achieved_2: ', current_period?.achieved_2)
    console.log('current_period?.days_without_criticals: ', current_period?.days_without_criticals)
    console.log('two_months_ago_days: ', two_months_ago_days)
    console.log('previous_month_days: ', previous_month_days)
    console.log('current_month_days: ', current_month_days)
    console.log('next_month_days: ', next_month_days)
    console.log('two_months_ago_days + previous_month_days + current_month_days: ', two_months_ago_days + previous_month_days + current_month_days)
    console.log('previous_month_days + current_month_days: ', previous_month_days + current_month_days)
    console.log('two_months_ago_days + previous_month_days: ', two_months_ago_days + previous_month_days)

    // Define which award is to be granted depending on the previous award achieved
    // and the days without critical errors accumulated.
    let awardToGrant = null;

    /**
     * CONDITIONS FOR AWARD ID: 2
     * - Previous award achieved: 1
     * - Days without criticals is greater than or equal to the previous month's + current month's total days
     * - Days without criticals is less than the sum of the second previous month's + previous month's total days and the current one's
     */
    if (
      current_period?.achieved_1 === 1 &&
      current_period?.days_without_criticals >= previous_month_days + current_month_days &&
      current_period?.days_without_criticals < two_months_ago_days + previous_month_days + current_month_days
    ) {
      
      awardToGrant = 2;
    }
    /**
     * CONDITIONS FOR AWARD ID: 1
     * - Days without criticals is greater than or equal to the second previous month's total days
     * - Days without criticals is less than the sum of the second previous month's total days and the previous one's
     */
    else if (
      // current_period?.achieved_1 === 1 &&
      current_period?.days_without_criticals >= two_months_ago_days &&
      current_period?.days_without_criticals < two_months_ago_days + previous_month_days
    ) {
      
      awardToGrant = 1;
    }

    console.log('awardToGrant: ', awardToGrant)


    /**
     * CONDITIONS TO GRANT THE AWARD (AWARD ID: 1 OR 2):
     * 1. Current period's second award has not been granted yet.
     * 2. 'Days without critical errors' is equal or greater than the previous month's total days.
     * 3. 'Days without critical errors' is less than the current month's total days.
     */
    if (
      awardToGrant !== null &&
      current_period?.achieved_2 === null
      // current_period?.days_without_criticals >= previous_month_days &&
      // current_period?.days_without_criticals < previous_month_days + current_month_days
    ) {
      console.log(`GRANTING THE AWARD #${awardToGrant} IN THE SECOND MONTH OF THE PERIOD`)
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('periods')
        .update({ achieved_2: awardToGrant })
        .eq('id', current_period.id)
        .select();

        if (error) {
          console.error(`[${new Date().toISOString()}] :: `, 'Error updating period\'s achieved_2: ', error)
        }

        if (data) {
          console.log(`[${new Date().toISOString()}] :: `, `Successfully granted the period\'s second award. Award ID: ${awardToGrant}`)
        }

    } else {
      console.log(`[${new Date().toISOString()}] :: `, `No conditions were met to grant the period\'s second award. Award ID: ${awardToGrant}`)
    }
    
  }  else {
    console.log('Current month is not in trigger_months')
  }

}

/**
 * EVALUATES AND GRANTS THE AWARD OF THE THIRD MONTH OF THE CURRENT PERIOD
 * 
 * @param {Date} current_date 
 * @description Grants the award of the third month of the period if the conditions are met.
 * It can either be the Award ID: 3, Award ID: 2, or Award ID: 1.
 */
export const evaluateAndGrantThirdAward = async (current_date) => {
  console.log('current_date', current_date)

  // In the last month of the period we can no longer use the trigger_months
  // since the period update needs to take place while in the same current period.

  // Instead, this function needs to run on the last day of the month at 5:30 PM GMT -6:00

  // const trigger_months = [
  //   {
  //     month: 3,// April
  //     days: 30
  //   },
  //   {
  //     month: 6,// July
  //     days: 31
  //   },
  //   {
  //     month: 9,// October
  //     days: 31
  //   },
  //   {
  //     month: 0,// January
  //     days: 31
  //   }
  // ]

  // The trigger month is located in the next period after the period we need to update
  // To compensate we need to get the previous period.
  const period = await getCurrentPeriod(current_date)
  console.log('period', period)

  // if (trigger_months.some(month => month.month === current_date.getMonth())) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Get the total days of the previous, current and next month
  const { two_months_ago_days, previous_month_days, current_month_days, next_month_days } = current_and_next_month(current_date)

  
  console.log('two_months_ago_days: ', two_months_ago_days)
  console.log('previous_month_days: ', previous_month_days)
  console.log('current_month_days: ', current_month_days)
  console.log('next_month_days: ', next_month_days)
  console.log('------------------------------------')
  console.log('period?.achieved_1: ', period?.achieved_1)
  console.log('period?.achieved_2: ', period?.achieved_2)
  console.log('period?.achieved_3: ', period?.achieved_3)
  console.log('period?.days_without_criticals: ', period?.days_without_criticals)
  console.log('------------------------------------')
  console.log('CONDITIONS FOR AWARD ID #3: ')  
  console.log('two_months_ago_days + previous_month_days + current_month_days: ', two_months_ago_days + previous_month_days + current_month_days)
  console.log('two_months_ago_days + previous_month_days + current_month_days + next_month_days: ', two_months_ago_days + previous_month_days + current_month_days + next_month_days)
  console.log('------------------------------------')
  console.log('CONDITIONS FOR AWARD ID #2: ')
  console.log('two_months_ago_days + previous_month_days: ', two_months_ago_days + previous_month_days)
  console.log('two_months_ago_days + previous_month_days + current_month_days: ', two_months_ago_days + previous_month_days + current_month_days)
  console.log('------------------------------------')
  console.log('CONDITIONS FOR AWARD ID #1: ')
  console.log('two_months_ago_days: ', two_months_ago_days)
  console.log('two_months_ago_days + previous_month_days: ', two_months_ago_days + previous_month_days)

  // Define which award is to be granted depending on the previous award achieved
  // and the days without critical errors accumulated.
  let awardToGrant = null;

  /**
    * CONDITIONS FOR AWARD ID: 3
    * - Previous award achieved: 2
    * - Days without criticals is greater than or equal to the second previous month's + previous month's + current month's total days
    * - Days without criticals is less than the sum of the second previous month's total days + previous month's + the current one's + next month's
    */
  if (
    period?.achieved_2 === 2 &&
    period?.days_without_criticals >= two_months_ago_days + previous_month_days + current_month_days &&// TO BE TESTED
    period?.days_without_criticals < two_months_ago_days + previous_month_days + current_month_days + next_month_days// TO BE TESTED
  ) {
    awardToGrant = 3;
  }

  /**
    * CONDITIONS FOR AWARD ID: 2
    * - Days without criticals is greater...
    */
  else if (
    period?.days_without_criticals >= two_months_ago_days + previous_month_days &&//TO BE TESTED
    period?.days_without_criticals < two_months_ago_days + previous_month_days + current_month_days//TO BE TESTED
  ) {
    awardToGrant = 2;
  }

  /**
    * CONDITIONS FOR AWARD ID: 1
    * 
    */
  else if (
    period?.days_without_criticals >= two_months_ago_days &&
    period?.days_without_criticals < two_months_ago_days + previous_month_days
  ) {
    awardToGrant = 1;
  }

  console.log('awardToGrant: ', awardToGrant)

  /**
  * CONDITIONS TO GRANT THE AWARD (ID: 3, 2, OR 1)
  */
  if (
  awardToGrant !== null &&
  period?.achieved_3 === null
  ) {
  console.log(`GRANTING THE AWARD #${awardToGrant} IN THE THIRD MONTH OF THE PERIOD`)
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('periods')
      .update({ achieved_3: awardToGrant })
      .eq('id', period.id)
      .select();

      if (error) {
        console.error(`[${new Date().toISOString()}] :: `, 'Error updating period\'s achieved_3: ', error)
      }

      if (data) {
        console.log(`[${new Date().toISOString()}] :: `, `Successfully granted the period\'s third award. Award ID: ${awardToGrant}`)
      }
  } else {
  console.log(`[${new Date().toISOString()}] :: `, `No conditions were met to grant the period\'s third award. Award ID: ${awardToGrant}`)
  }


}