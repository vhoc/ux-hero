"use server"
import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
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

export const getAllPeriods = async (year: number): Promise<IPeriod[] | null> => {
  try {
    const supabase = await createClient();
    const { data, error }: { data: IPeriod[] | null, error: PostgrestError | null } = await supabase
      .from('periods')
      .select('*')
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`);

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

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return {
    id: 0,
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