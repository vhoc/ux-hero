"use server";

import { getElapsedDaysOfPeriod } from "@/app/actions/periods";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestError } from "@supabase/supabase-js";
import { daysDiff } from "@/utils/time-calculations";
import {
  type ICriticalError,
  type IPeriod,
} from "types";


export const getCriticalErrors = async (period: IPeriod): Promise<ICriticalError[] | null> => {

  try {
    const supabase = await createClient();
    const { data, error }: { data: ICriticalError[] | null, error: PostgrestError | null } = await supabase
      .from('critical_errors')
      .select('*')
      .gte('date', period.start_date)// Only get critical errors that are within the current period
      .lte('date', period.end_date);

    if (error) {
      console.error('Error fetching critical errors: ', error)
    }

    if (data) {
      // console.log('Critical errors: ', data)
      return data
    } else {
      console.log('No critical errors found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}

export const addCriticalError = async (description: string, today: Date) => {
  // const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  try {
    const supabase = await createClient();
    const { data, error }: { data: ICriticalError[] | null, error: PostgrestError | null } = await supabase
      .from('critical_errors')
      .insert([
        { description: description, date: todayISO }
      ])
      .select();

    if (error) {
      console.error('Error adding critical error: ', error)
      return error
    }

    if (data) {
      return data
    } else {
      console.log('Error adding critical error')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }
}

export const getElapsedDaysSinceLastCriticalError = async (critical_errors: ICriticalError[], period_start_date: string, todayISO: string): Promise<number | null> => {

  // If no critical errors, just return the days elapsed in the current period
  if (!critical_errors || critical_errors.length < 1) {
    const elapsedDays = await getElapsedDaysOfPeriod(period_start_date)
    return elapsedDays
  }

  try {
    if (critical_errors && critical_errors.length >= 1) {
      let mostRecentItem = critical_errors[0]!
      let mostRecentDate = new Date(critical_errors[0]!.date)

      for (let i = 1; i < critical_errors.length; i++) {
        const currentDate = new Date(critical_errors[i]!.date)
        if (currentDate > mostRecentDate) {
          mostRecentDate = currentDate;
          mostRecentItem = critical_errors[i]!;
        }
      }

      const daysSinceLastCriticalError = daysDiff(mostRecentItem.date, todayISO)
      return daysSinceLastCriticalError
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null
  }

  return null

}