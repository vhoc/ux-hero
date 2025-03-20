"use server";

import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { calculateMonthOfQuarter } from "@/utils/misc";
import { getCurrentPeriod } from "@/app/actions/periods";
import {
  type IPeriod,
  type IHeartsRestored,
} from "types";

export const setPeriodHealth = async (health_amount: number, health_column: string, period_id: number) => {

  try {

    const supabase = await createClient()

    const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
      .from('periods')
      .update({ [health_column]: health_amount })
      .eq('id', period_id)
      .select()

    if (error) {
      console.error('Error setting the period health: ', error)
      return error
    }

    if (data) {
      return data
    } else {
      console.log('Error setting the period health')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}

export const setHeartsRestored = async (month: number, value: boolean) => {
  try {
    const supabase = await createClient();
      const { error }: { data: IHeartsRestored[] | null, error: PostgrestError | null } = await supabase
        .from('hearts_restored')
        .update({ hearts_restored: value })
        .eq('month', month)
        .select();
  
      if (error) {
        console.error('Error updating hearts restoration state: ', error)
      }
  
  } catch (error) {
    console.log('No hearts restiration event found: ', error)
  }

}

export const checkIfHearsWereRestored = async (date: Date) => {

  const MAX_INCIDENTS = Number(process.env.MAX_INCIDENTS)

  // Get month of the date
  const monthNumber = date.getMonth() + 1;

  const todayISO = date.toISOString().split('T')[0]!;

  // Get current period in its current state
  const currentPeriod = await getCurrentPeriod(todayISO)

  // Get the month of the current period (1st, 2nd or 3rd).
  const currentMonthOfPeriod = calculateMonthOfQuarter(date)

  // Get the health column name that matches the current month of the period
  const health_column_name = `health_${currentMonthOfPeriod}` as keyof IPeriod

  if ( currentPeriod && currentMonthOfPeriod ) {

    try {
      const supabase = await createClient();
      const { data, error }: { data: IHeartsRestored | null, error: PostgrestError | null } = await supabase
        .from('hearts_restored')
        .select('*')
        .eq('month', monthNumber)
        .single();
  
      if (error) {
        console.error('Error fetching hearts restoration event: ', error)
      }
  
      if (data) {
        if (!data.hearts_restored) {
          // Restore the health of the current period if it hasn't been restored yet.
          await setPeriodHealth(MAX_INCIDENTS, health_column_name, currentPeriod.id)
          await setHeartsRestored(monthNumber, true)
        }
  
        return data
      } else {
        console.log('No hearts restiration event found')
        return null
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return null;
    }

  }

  

}

export const restoreHealth = async (date: Date) => {

  const MAX_INCIDENTS = Number(process.env.MAX_INCIDENTS)

  const todayISO = date.toISOString().split('T')[0]!;

  // Get current period in its current state
  const currentPeriod = await getCurrentPeriod(todayISO)

  // Get the month of the current period (1st, 2nd or 3rd).
  const currentMonthOfPeriod = calculateMonthOfQuarter(date)

  // Get the health column name that matches the current month of the period
  const health_column_name = `health_${currentMonthOfPeriod}` as keyof IPeriod

  await setPeriodHealth(MAX_INCIDENTS, health_column_name, currentPeriod!.id)


}