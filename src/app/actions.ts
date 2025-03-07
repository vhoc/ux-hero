"use server";

import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import {
  type IPeriod,
  type ICriticalError,
  type IAward,
  type IAwardsCheckList,
  type IMinorIssue,
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

export const getCurrentMonthPeriod = async (now: Date): Promise<IPeriod> => {
  // const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return {
    id: 0,
    created_at: "",
    name: "Current month",
    start_date: formatDate(startDate),
    end_date: formatDate(endDate)
  };
}

export const daysDiff = async (start_date_string: string, end_date_string: string) => {

  const startDateParts = start_date_string.split('-')
  const startDate = new Date(
    parseInt(startDateParts[0]!, 10),// Year
    parseInt(startDateParts[1]!, 10) - 1,// Month (0-indexed)
    parseInt(startDateParts[2]!, 10)// Day
  )

  const endDateParts = end_date_string.replace('/', '-').split('-');
  const endDate = new Date(
    parseInt(endDateParts[0]!, 10), // Year
    parseInt(endDateParts[1]!, 10) - 1, // Month (0-indexed)
    parseInt(endDateParts[2]!, 10)  // Day
  );

  const timeDifference = endDate.getTime() - startDate.getTime()

  const daysDifference = timeDifference / (1000 * 3600 * 24)

  return daysDifference

}

export const getElapsedDaysOfPeriod = async (start_date: string) => {

  const today = new Date();

  // Get days of difference between today and start_date
  const daysElapsed = Math.floor((today.getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));

  return daysElapsed;

}

export const getCriticalErrors = async ( period: IPeriod ): Promise<ICriticalError[] | null> => {

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

export const addCriticalError = async (description: string) => {
  const today = new Date();
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

export const addMinorIssue = async (description: string) => {
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  try {
    const supabase = await createClient();
    const { data, error }: { data: IMinorIssue[] | null, error: PostgrestError | null } = await supabase
      .from('minor_issues')
      .insert([
        { description: description, date: todayISO }
      ])
      .select();

    if (error) {
      console.error('Error adding minor issue: ', error)
      return error
    }

    if (data) {
      return data
    } else {
      console.log('Error adding minor issue')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }
}

export const getElapsedDaysSinceLastCriticalError = async ( critical_errors: ICriticalError[], period_start_date: string, todayISO: string ): Promise<number | null> => {

  // If no critical errors, just return the days elapsed in the current period
  if ( !critical_errors || critical_errors.length < 1 ) {
    const elapsedDays = await getElapsedDaysOfPeriod(period_start_date)
    return elapsedDays
  }

  try {
    if (critical_errors && critical_errors.length >= 1) {
      let mostRecentItem = critical_errors[0]!
      let mostRecentDate = new Date(critical_errors[0]!.date)

      for(let i = 1; i < critical_errors.length; i++) {
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

export const getAwards = async (): Promise<IAward[] | null> => {

  try {
    const supabase = await createClient();
    const { data, error }: { data: IAward[] | null, error: PostgrestError | null } = await supabase
      .from('awards')
      .select('*');

    if (error) {
      console.error('Error fetching awards: ', error)
    }

    if (data) {
      return data
    } else {
      console.log('No awards found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}

export const awardsArrayToMap = async (awards: IAward[]): Promise<Map<number, IAward>> =>  {
  return awards.reduce((map, award) => {
    map.set(award.id, award);
    return map;
  }, new Map(awards.sort((a, b) => a.days_required - b.days_required).map(award => [award.id, award])));
}

export const getAwardsCheckList = async (daysWithoutCriticalError: number, awards: IAward[]): Promise<IAwardsCheckList | null> => {

  if ( awards && awards.length >= 1 ) {

    let now_playing: IAward = awards[0]!
    const next: Array<IAward | null> = []
  
    if ( awards.length > 0 && daysWithoutCriticalError < awards[0]!.days_required ) {
      now_playing = awards[0]!
      next.push(...awards.slice(1))
    } else if ( awards.length > 1 && daysWithoutCriticalError >= awards[0]!.days_required && daysWithoutCriticalError < awards[1]!.days_required ) {
      now_playing = awards[1]!
      next.push(...awards.slice(2))
    } else if ( awards.length > 2 && daysWithoutCriticalError >= awards[1]!.days_required) {
      now_playing = awards[2]!
    } else {
      now_playing = awards[awards.length - 1]!
    }

    return {
      now_playing: now_playing,
      next: next,
    }
  }

  return null

}

export const getMinorIssues = async ( period: IPeriod ): Promise<IMinorIssue[] | null> => {
  try {
    const supabase = await createClient();
    const { data, error }: { data: IMinorIssue[] | null, error: PostgrestError | null } = await supabase
      .from('minor_issues')
      .select('*')
      .gte('date', period.start_date)
      .lte('date', period.end_date)

    if (error) {
      console.error('Error fetching minor issues: ', error)
    }

    if (data) {
      // console.log('Minor issues: ', data)
      return data
    } else {
      console.log('No minor issues found found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}

export const signOut = async () => {
  const supabase = await createClient()
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error('Error signing out: ', signOutError)
  }
}

