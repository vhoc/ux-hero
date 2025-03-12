"use server";

import { type PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import {
  type IAward,
  type IAwardsCheckList,
} from "types";


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

export const awardsArrayToMap = async (awards: IAward[]): Promise<Map<number, IAward>> => {
  return awards.reduce((map, award) => {
    map.set(award.id, award);
    return map;
  }, new Map(awards.sort((a, b) => a.days_required - b.days_required).map(award => [award.id, award])));
}

export const getAwardsCheckList = async (daysWithoutCriticalError: number, awards: IAward[]): Promise<IAwardsCheckList | null> => {

  if (awards && awards.length >= 1) {

    let now_playing: IAward = awards[0]!
    const next: Array<IAward | null> = []

    if (awards.length > 0 && daysWithoutCriticalError < awards[0]!.days_required) {
      now_playing = awards[0]!
      next.push(...awards.slice(1))
    } else if (awards.length > 1 && daysWithoutCriticalError >= awards[0]!.days_required && daysWithoutCriticalError < awards[1]!.days_required) {
      now_playing = awards[1]!
      next.push(...awards.slice(2))
    } else if (awards.length > 2 && daysWithoutCriticalError >= awards[1]!.days_required) {
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