"use client"

import { useState, useEffect } from "react";
import HUD from "./HUD/HUD";
import MainCounter from "./MainCounter";
import AwardStars from "./AwardStars";
import AchievementsDisplay from "./AchievementsDisplay";
import { type IPeriod, type IAward, type ICriticalError } from "types";
import { supabase } from "@/utils/supabase/client";
import { getDaysSinceLastCriticalError } from "@/utils/time-calculations";

interface PageContentProps {
  awards: IAward[]
  currentPeriod: IPeriod
  initialCriticalErrors: ICriticalError[]
}



const PageContent = ({ awards = [], currentPeriod, initialCriticalErrors }: PageContentProps) => {

  const [criticalErrors, setCriticalErrors] = useState<ICriticalError[]>(initialCriticalErrors)
  const [daysSinceLastCriticalError, setDaysSinceLastCriticalError] = useState<number>(0)

  // Live update / Real time updates for the critical errors
  useEffect(() => {
    const channel = supabase.channel('critical_errors').on('postgres_changes', {
      event: '*', schema: 'public', table: 'critical_errors'
    }, (payload) => {
      
      const updateType = payload.eventType
      const updatedCriticalError: ICriticalError = payload.new as ICriticalError

      if (updateType === 'INSERT') {
        if (updatedCriticalError.date >= currentPeriod.start_date && updatedCriticalError.date <= currentPeriod.end_date) {
          setCriticalErrors(prevCriticalErrors => {
            return [...prevCriticalErrors, updatedCriticalError]
          })
        }
      }

      if (updateType === 'DELETE') {
        setCriticalErrors(prevCriticalErrors => {
          const deletedCriticalError = payload.old as ICriticalError
          return prevCriticalErrors.filter(criticalError => criticalError.id !== deletedCriticalError.id)
        })
      }

      if (updateType === 'UPDATE') {
        // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the criticalError item of the same id in the state.
        if (updatedCriticalError.date >= currentPeriod.start_date && updatedCriticalError.date <= currentPeriod.end_date) {
          setCriticalErrors(prevCriticalErrors => {
            return prevCriticalErrors.map(criticalError => {
              if (criticalError.id === updatedCriticalError.id) {
                return updatedCriticalError
              }
              return criticalError
            })
          })
        }
      }

      
    }).subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }

  }, [supabase])

  // Calculate the days since the last critical error in the current period
  useEffect(() => {
    const result = getDaysSinceLastCriticalError(criticalErrors, currentPeriod.start_date, new Date().toISOString().split('T')[0]!)
    setDaysSinceLastCriticalError(result ?? 0)
  }, [criticalErrors, currentPeriod])
 

  if ( currentPeriod && awards && awards.length >= 1 ) {
    return (
      <>
      
        {/* LEFT PANE */}
        <div className="flex flex-col gap-y-16 w-full md:flex-1 h-full z-10">
          <HUD
            player_name="UXNTEAM"
            coins={daysSinceLastCriticalError}
            period={currentPeriod}
          />
  
          {/* TWO COLUMNS: AWARDS, BIG COUNTER */}
          <div className="flex flex-col gap-y-10 justify-center items-center w-full h-full xl:flex-row xl:items-start">
  
            <MainCounter days={daysSinceLastCriticalError} />
            
          </div>
        </div>
  
        {/* RIGHT PANE */}
        <div className="flex flex-col w-full md:flex-1 h-full pt-[73px] z-10 items-center md:items-end">
  
          <AwardStars awards={awards} daysSinceLastCriticalError={daysSinceLastCriticalError} />
  
          <AchievementsDisplay awards={awards} daysSinceLastCriticalError={daysSinceLastCriticalError} />
  
        </div>
      
      </>
    )
  }

  return <div>No data</div>

  

}

export default PageContent