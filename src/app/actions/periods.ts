"use server"
import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { getCriticalErrors } from "./critical_errors";
import { getDaysSinceLastCriticalError } from "@/utils/time-calculations";
import {
  type IPeriod,
  type ISingleMonthPeriod,
} from "types";

export const getCurrentPeriod = async (todayISO: string): Promise<IPeriod | null> => {

  // const today = new Date();
  // const todayISO = today.toISOString().split('T')[0];

  try {
    const supabase = await createClient();
    const { data, error }: { data: IPeriod | null, error: PostgrestError | null } = await supabase
      .from('periods')
      .select('*')
      .lte('start_date', todayISO)
      .gte('end_date', todayISO)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching period: ', error)
    }

    if (data) {
      return data
    } else {
      console.log('No period found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}

export const getAllPeriods = async (): Promise<IPeriod[] | null> => {
  try {
    const supabase = await createClient();
    const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
      .from('periods')
      .select('*')
      .order('id')
      // .gte('start_date', `${year}-01-01`)
      // .lte('end_date', `${year}-12-31`);

    if (error) {
      console.error('Error fetching periods: ', error)
    }

    if (data) {
      return data
    } else {
      console.log('No periods found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }
}

export const getCurrentMonthPeriod = async (now: Date): Promise<ISingleMonthPeriod> => {
  // const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const thisMonthNumber = now.getMonth() + 1
  // console.log('now.getMonth(): ', now.getMonth() + 1)

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return {
    // Set the number of the month relative to the current period/quarter as the result id
    id: thisMonthNumber === 1 || thisMonthNumber === 4 || thisMonthNumber === 7 || thisMonthNumber === 10 ? 1 :
      thisMonthNumber === 2 || thisMonthNumber === 5 || thisMonthNumber === 8 || thisMonthNumber === 11 ? 2 :
        thisMonthNumber === 3 || thisMonthNumber === 6 || thisMonthNumber === 9 || thisMonthNumber === 12 ? 3 : 0
    ,
    name: "Current month",
    start_date: formatDate(startDate),
    end_date: formatDate(endDate)
  };
}

export const getElapsedDaysOfPeriod = async (start_date: string) => {

  const today = new Date();

  // Get days of difference between today and start_date
  const daysElapsed = Math.floor((today.getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));

  return daysElapsed;

}

export const setPeriodAward = async (date: Date, period_id: number, monthOfQuarter: number): Promise<void> => {

  // console.log('setPeriodAward props')
  // console.log(JSON.stringify({ date, period_id, monthOfQuarter }, null, 2))

  const todayISO: string = date.toISOString().split('T')[0]!;
  const currentPeriod = await getCurrentPeriod(todayISO)
  const criticalErrors = await getCriticalErrors(currentPeriod!)
  const daysSinceLastCriticalError = getDaysSinceLastCriticalError(criticalErrors!, currentPeriod!.start_date, date)

  if (daysSinceLastCriticalError !== null) {

    console.log('setPeriodAward/daysSinceLastCriticalError: ', daysSinceLastCriticalError)

    // 1. Check if the current month is the first, second or third month of the quarter
    const pastMonthOfQuarter = monthOfQuarter - 1
    const columnToUpdate = `achieved_${monthOfQuarter}` as keyof IPeriod
    
    const awardId = daysSinceLastCriticalError >= 30 && daysSinceLastCriticalError < 60 ? 1 :
      daysSinceLastCriticalError >= 60 && daysSinceLastCriticalError < 90 ? 2 :
        daysSinceLastCriticalError >= 90 ? 3 : null
    
    console.log('setPeriodAward/awardId: ', awardId)

    // console.log('setPeriodAward values')
    // console.log(JSON.stringify({ monthOfQuarter, columnToUpdate, awardId }, null, 2))

    // 2. Check if the 'achieved_x' column is null, if it is, update it to which award id?
    try {
      const supabase = await createClient();
      const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
        .from('periods')
        .select('*')
        .eq('id', period_id)
        .single();

      if (error) {
        console.error('Error fetching periods: ', error)
      }

      if (data) {
        console.log('data[columnToUpdate as keyof typeof data]: ', data[columnToUpdate as keyof typeof data])
        // Check if the 'achieved_x' column is null, if it is, update it to which award id?
        // if (data[columnToUpdate as keyof typeof data] === null && awardId && awardId > 0) {      
        await updateMonthAchievedAward(period_id, pastMonthOfQuarter, awardId)

      } else {
        console.log('No periods found')
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }

  }

}

export const updateMonthAchievedAward = async (period_id: number, month_of_quarter: number, award_id: number | null): Promise<void> => {
  console.log('updateMonthAchievedAward props')
  console.log(JSON.stringify({ period_id, month_of_quarter, award_id }, null, 2))

  try {
    const supabase = await createClient();
    const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
      .from('periods')
      .update({ [`achieved_${month_of_quarter}`]: award_id })
      .eq('id', period_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating period: ', error)
    }

    if (data) {
      // console.log('data: ', data)
    } else {
      console.log('No period updated')
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

export const addOneDayToDaysSinceLastCriticalError = async (): Promise<void> => {

  try {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0]!;

    const currentPeriod = await getCurrentPeriod(todayISO)

    if (currentPeriod?.days_without_criticals) {
      const supabase = await createClient();
      const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
        .from('periods')
        .update({ days_without_criticals: currentPeriod.days_without_criticals + 1 })
        .eq('id', currentPeriod.id)
        .select()
        .single();
  
      if (error) {
        console.error('Error updating period\'s days since last critical error: ', error)
      }
  
      if (data) {
        console.log('Added 1 day to the period\'s days since last critical error updated')
      }
    }
    
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}