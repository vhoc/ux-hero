"use client"

import { useState, useEffect } from "react";
import HUD from "./HUD/HUD";
import MainCounter from "./MainCounter";
import AchievementsDisplay from "./AchievementsDisplay";
import { type IPeriod, type IAward, type ICriticalError, type IMinorIssue } from "types";
import { supabase } from "@/utils/supabase/client";
import { getDaysSinceLastCriticalError } from "@/utils/time-calculations";
import { type User } from "@supabase/supabase-js";

interface PageContentProps {
  awards: IAward[]
  currentPeriod: IPeriod
  initialCriticalErrors: ICriticalError[]
  userData?: User | null
  initialMinorIssues?: IMinorIssue[]
}



const PageContent = ({ awards = [], currentPeriod, initialCriticalErrors, userData, initialMinorIssues }: PageContentProps) => {

  const [criticalErrors, setCriticalErrors] = useState<ICriticalError[]>(initialCriticalErrors)
  const [minorIssues, setMinorIssues] = useState<IMinorIssue[]>(initialMinorIssues ?? [])
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

  // Live update / Real time updates for minor issues
  useEffect(() => {
    const channelMinorIssues = supabase.channel('minor_issues').on('postgres_changes', {
      event: '*', schema: 'public', table: 'minor_issues'
    }, (payload) => {
      
      const updateType = payload.eventType
      const updatedMinorIssue: IMinorIssue = payload.new as IMinorIssue

      if (updateType === 'INSERT') {
        if (updatedMinorIssue.date >= currentPeriod.start_date && updatedMinorIssue.date <= currentPeriod.end_date) {
          setMinorIssues(prevMinorIssues => {
            return [...prevMinorIssues, updatedMinorIssue]
          })
        }
      }

      if (updateType === 'DELETE') {
        setMinorIssues(prevMinorIssues => {
          const deletedMinorIssue = payload.old as IMinorIssue
          return prevMinorIssues.filter(minorIssue => minorIssue.id !== deletedMinorIssue.id)
        })
      }

      if (updateType === 'UPDATE') {
        // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the minorIssue item of the same id in the state.
        if (updatedMinorIssue.date >= currentPeriod.start_date && updatedMinorIssue.date <= currentPeriod.end_date) {
          setMinorIssues(prevMinorIssues => {
            return prevMinorIssues.map(minorIssue => {
              if (minorIssue.id === updatedMinorIssue.id) {
                return updatedMinorIssue
              }
              return minorIssue
            })
          })
        }
      }

      
    }).subscribe()

    return () => {
      void supabase.removeChannel(channelMinorIssues)
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
      
        <div className="flex flex-col gap-y-16 w-full md:flex-1 h-full z-10">
          <HUD
            player_name="UXNTEAM"
            daysSinceLastCriticalError={daysSinceLastCriticalError}
            period={currentPeriod}
            awards={awards}
            minor_issues={minorIssues}
            userData={userData}
          />
  
          <div className="flex flex-col gap-y-10 md:justify-center items-center w-full h-full xl:flex-row xl:items-start">
  
            <MainCounter days={daysSinceLastCriticalError} userData={userData} />

            <AchievementsDisplay awards={awards} daysSinceLastCriticalError={daysSinceLastCriticalError} />
            
          </div>
        </div>
  
      
      </>
    )
  }

  return <div>No data</div>

  

}

export default PageContent