"use client"

import { useState, useEffect } from "react";
import HUD from "./HUD/HUD";
import MainCounter from "./MainCounter";
import AchievementsDisplay from "./AchievementsDisplay";
import { type IPeriod, type IAward, type ICriticalError, type IIncident, type ISingleMonthPeriod } from "types";
import { supabase } from "@/utils/supabase/client";
import { getDaysSinceLastCriticalError } from "@/utils/time-calculations";
import { type User } from "@supabase/supabase-js";
import { calculateCurrentPeriod } from "@/utils/misc";

interface PageContentProps {
  today: Date
  awards: IAward[]
  initialCurrentPeriod: IPeriod
  currentMonthPeriod: ISingleMonthPeriod
  initialCriticalErrors: ICriticalError[]
  initialPeriods: IPeriod[]
  userData?: User | null
  initialIncidents?: IIncident[]
}



const PageContent = ({ today, awards = [], initialCurrentPeriod, currentMonthPeriod, initialCriticalErrors, initialPeriods, userData, initialIncidents }: PageContentProps) => {

  const [periods, setPeriods] = useState<IPeriod[]>(initialPeriods)
  const [currentPeriod, setCurrentPeriod] = useState<IPeriod | null>(initialCurrentPeriod)
  const [criticalErrors, setCriticalErrors] = useState<ICriticalError[]>(initialCriticalErrors)
  const [incidents, setIncidents] = useState<IIncident[]>(initialIncidents ?? [])
  const [daysSinceLastCriticalError, setDaysSinceLastCriticalError] = useState<number>(0)

  // Calculate the current period according to today's date
  // useEffect(() => {
  //   const calculatedCurrentPeriod = calculateCurrentPeriod(today, periods)
  //   console.log('calculatedCurrentPeriod: ', calculatedCurrentPeriod)
  //   if (calculatedCurrentPeriod) {
  //     setCurrentPeriod(calculatedCurrentPeriod)
  //   }
  // }, [supabase, periods, today])

  // Live update / Real time updates for the current period
  useEffect(() => {
    const channel = supabase.channel('periods').on('postgres_changes', {
      event: '*', schema: 'public', table: 'periods', filter: `id=eq.${initialCurrentPeriod?.id}`
    }, (payload) => {
      const updateType = payload.eventType
      const updatedPeriod: IPeriod = payload.new as IPeriod

      if (updateType === 'UPDATE') {
        setCurrentPeriod(updatedPeriod)
      }

    }).subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase])

  //Live update / Real time updates for the periods
  useEffect(() => {
    const channel = supabase.channel('periods').on('postgres_changes', {
      event: '*', schema: 'public', table: 'periods'
    }, (payload) => {
      const updateType = payload.eventType
      const updatedPeriod: IPeriod = payload.new as IPeriod

      if (updateType === 'UPDATE') {
        // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the criticalError item of the same id in the state.
        setPeriods(prevPeriods => {
          return prevPeriods.map(period => {
            if (period.id === updatedPeriod.id) {
              // setCurrentPeriod(updatedPeriod)
              return updatedPeriod
            }
            // setCurrentPeriod(period)
            return period
          })
        })
      }

    }).subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }

  }, [supabase])

  // Live update / Real time updates for the critical errors
  useEffect(() => {
    const channel = supabase.channel('critical_errors').on('postgres_changes', {
      event: '*', schema: 'public', table: 'critical_errors'
    }, (payload) => {

      const updateType = payload.eventType
      const updatedCriticalError: ICriticalError = payload.new as ICriticalError

      if (updateType === 'INSERT' && currentPeriod) {
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

      if (updateType === 'UPDATE' && currentPeriod) {
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
    const channelIncidents = supabase.channel('incidents').on('postgres_changes', {
      event: '*', schema: 'public', table: 'incidents'
    }, (payload) => {

      const updateType = payload.eventType
      const updatedIncident: IIncident = payload.new as IIncident

      if (updateType === 'INSERT') {
        if (updatedIncident.date >= currentMonthPeriod.start_date && updatedIncident.date <= currentMonthPeriod.end_date) {
          setIncidents(prevIncidents => {
            return [...prevIncidents, updatedIncident]
          })
        }
      }

      if (updateType === 'DELETE') {
        setIncidents(prevIncidents => {
          const deletedIncident = payload.old as IIncident
          return prevIncidents.filter(incident => incident.id !== deletedIncident.id)
        })
      }

      if (updateType === 'UPDATE') {
        // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the minorIssue item of the same id in the state.
        if (updatedIncident.date >= currentMonthPeriod.start_date && updatedIncident.date <= currentMonthPeriod.end_date) {
          setIncidents(prevIncidents => {
            return prevIncidents.map(incident => {
              if (incident.id === updatedIncident.id) {
                return updatedIncident
              }
              return incident
            })
          })
        }
      }


    }).subscribe()

    return () => {
      void supabase.removeChannel(channelIncidents)
    }

  }, [supabase])

  // Calculate the days since the last critical error in the current period
  useEffect(() => {
    if (currentPeriod) {
      const result = getDaysSinceLastCriticalError(criticalErrors, currentPeriod.start_date, today)

      // console.log('result ',result)
      setDaysSinceLastCriticalError(result ?? 0)
    }

  }, [criticalErrors, currentPeriod, today])


  if (currentPeriod && awards && awards.length >= 1) {
    return (
      <>

        <div className="flex flex-col gap-y-16 w-full md:flex-1 h-full z-10">
          <HUD
            today={today}
            player_name="UXNTEAM"
            daysSinceLastCriticalError={daysSinceLastCriticalError}
            // periods={periods}
            period={currentPeriod}
            currentMonthPeriod={currentMonthPeriod}
            awards={awards}
            incidents={incidents}
            userData={userData}
          />

          <div className="flex flex-col gap-y-10 md:justify-center items-center w-full h-full xl:px-16 xl:flex-row xl:items-start">

            <MainCounter days={daysSinceLastCriticalError} userData={userData} />

            <AchievementsDisplay
              awards={awards}
              daysSinceLastCriticalError={daysSinceLastCriticalError}
              minorIssues={incidents}
            />

          </div>
        </div>


      </>
    )
  }

  return <div>No data</div>



}

export default PageContent