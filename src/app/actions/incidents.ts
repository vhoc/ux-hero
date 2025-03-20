"use server";

import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { calculateMonthOfQuarter } from "@/utils/misc";
import { getCurrentPeriod } from "@/app/actions/periods";
import { setPeriodHealth } from "@/app/actions/health";
import { addCriticalError } from "@/app/actions/critical_errors";
import {
  type IPeriod,
  type IIncident,
  type ISingleMonthPeriod,
} from "types";

export const addIncident = async (date: Date, description: string) => {
  const todayISO = date.toISOString().split('T')[0]!;
  const INCIDENT_DAMAGE = Number(process.env.INCIDENT_DAMAGE)
  const MAX_INCIDENTS = Number(process.env.MAX_INCIDENTS)

  // Get current period in its current state
  const currentPeriod = await getCurrentPeriod(todayISO)

  // Get the month of the current period (1st, 2nd or 3rd).
  const currentMonthOfPeriod = calculateMonthOfQuarter(date)

  // Get the health column name that matches the current month of the period
  const health_column_name = `health_${currentMonthOfPeriod}` as keyof IPeriod

  try {
    const supabase = await createClient();

    // Calculate the new health value to update it in the database.
    if (currentPeriod) {
      const currentHealth = Number(currentPeriod[health_column_name])

      const newHealth = currentHealth < 1 ? 0 : currentHealth - INCIDENT_DAMAGE// Negative number prevention safe.

      // Negative number prevention safe on the result of the calculation.
      // For instance, if currentHealth is 1 and you do 2 damage, it will be 0 instead of -1.
      if (newHealth < 0) {
        await setPeriodHealth(0, health_column_name, currentPeriod.id)
      } else {
        await setPeriodHealth(newHealth, health_column_name, currentPeriod.id)
      }

      // If currentHealth is 1, add a Critial Error.
      if (currentHealth === 1) {
        await addCriticalError("Accumulation of incidents. No hearts left.", date) // Losing all health due to accumulation of incidents equals one critical error.
        await setPeriodHealth(MAX_INCIDENTS, health_column_name, currentPeriod.id) // Restore health.
      }

    }

    /**
     * Add the incident to the database with an optional description.
     * This now has been detached from the health meter level calculation,
     * it now only serves to keep records.
     */
    const { data, error }: { data: IIncident[] | null, error: PostgrestError | null } = await supabase
      .from('incidents')
      .insert([
        { description: description, date: todayISO }
      ])
      .select();

    if (error) {
      console.error('Error adding incident: ', error)
      return error
    }

    if (data) {
      return data
    } else {
      console.log('Error adding incident')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }
}

export const getIncidents = async (period: ISingleMonthPeriod): Promise<IIncident[] | null> => {
  try {
    const supabase = await createClient();
    const { data, error }: { data: IIncident[] | null, error: PostgrestError | null } = await supabase
      .from('incidents')
      .select('*')
      .gte('date', period.start_date)
      .lte('date', period.end_date)

    if (error) {
      console.error('Error fetching incidents: ', error)
    }

    if (data) {
      // console.log('Minor issues: ', data)
      return data
    } else {
      console.log('No incidents found found')
      return null
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null;
  }

}