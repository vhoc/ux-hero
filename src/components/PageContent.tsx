"use client"

import { useState, useEffect } from "react";
import HUD from "./HUD/HUD";
import MainCounter from "./MainCounter";
import AchievementsDisplay from "./AchievementsDisplay";
import { type IPeriod, type IAward, type ICriticalError, type IIncident, type ISingleMonthPeriod, type TAwardId } from "types";
import { supabase } from "@/utils/supabase/client";
import { getDaysSinceLastCriticalError } from "@/utils/time-calculations";
import { type User } from "@supabase/supabase-js";
import { calculateMonthOfQuarter } from "@/utils/misc"
import { setPeriodAward } from "@/app/actions/periods";
import { getCurrentPeriod } from "@/app/actions/periods";
import { calculateAwardPot } from "@/utils/misc";

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

  // Select the health value from the period that matches the month of today's date.
  // const currentMonthPeriod = getCurrentMonthPeriod(today)
  
  const monthOfQuarter = calculateMonthOfQuarter(today)
  const healthKey = `health_${monthOfQuarter}` as keyof IPeriod

  // const [periods, setPeriods] = useState<IPeriod[]>(initialPeriods)
  // const [currentPeriod, setCurrentPeriod] = useState<IPeriod | null>(initialCurrentPeriod)
  const [period, setPeriod] = useState<IPeriod | null>(null)
  // const [currentHealth, setCurrentHealth] = useState<number>(Number(initialCurrentPeriod[healthKey]))
  const [criticalErrors, setCriticalErrors] = useState<ICriticalError[]>(initialCriticalErrors)
  const [incidents, setIncidents] = useState<IIncident[]>(initialIncidents ?? [])
  const [earnedAmount, setEarnedAmount] = useState<number>(0)

  // Set initial current period
  useEffect(() => {
    const todayISO: string = today.toISOString().split('T')[0]!;
    getCurrentPeriod(todayISO)
      .then((period) => {
        if (period) {
          setPeriod(period)
        }
      })
      .catch((error) => {
        console.error('Error fetching current period: ', error)
      })
  }, [today])

  //Live update / Real time updates for the periods
  // useEffect(() => {
  //   const channel = supabase.channel('periods').on('postgres_changes', {
  //     event: '*', schema: 'public', table: 'periods'
  //   }, (payload) => {
  //     const updateType = payload.eventType
  //     const updatedPeriod: IPeriod = payload.new as IPeriod

  //     if (updateType === 'UPDATE') {
  //       // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the criticalError item of the same id in the state.
  //       setPeriods(prevPeriods => {
  //         return prevPeriods.map(period => {
  //           if (period.id === updatedPeriod.id) {
  //             // setCurrentPeriod(updatedPeriod)
  //             return updatedPeriod
  //           }
  //           // setCurrentPeriod(period)
  //           return period
  //         })
  //       })
  //     }

  //   }).subscribe()

  //   return () => {
  //     void supabase.removeChannel(channel)
  //   }

  // }, [supabase])

  // Live update / Real time updates for the critical errors
  useEffect(() => {
    const channel = supabase.channel('critical_errors').on('postgres_changes', {
      event: '*', schema: 'public', table: 'critical_errors'
    }, (payload) => {

      const updateType = payload.eventType
      const updatedCriticalError: ICriticalError = payload.new as ICriticalError

      if (updateType === 'INSERT' && period) {
        if (updatedCriticalError.date >= period.start_date && updatedCriticalError.date <= period.end_date) {
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

      if (updateType === 'UPDATE' && period) {
        // if payload.new.date is between currentPeriod.start_date and currentPeriod.end_date, replace the criticalError item of the same id in the state.
        if (updatedCriticalError.date >= period.start_date && updatedCriticalError.date <= period.end_date) {
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
  // useEffect(() => {
  //   if (initialCurrentPeriod) {
  //     const result = getDaysSinceLastCriticalError(criticalErrors, initialCurrentPeriod.start_date, today)

  //     // console.log('result ',result)
  //     setDaysSinceLastCriticalError(result ?? 0)
  //   }

  // }, [criticalErrors,initialCurrentPeriod, today])

  // Live update / Real time updates for the current period
  useEffect(() => {
    const channel = supabase.channel('current_period').on('postgres_changes', {
      event: '*', schema: 'public', table: 'periods', filter: `id=eq.${initialCurrentPeriod.id}`
    }, (payload) => {
      const updateType = payload.eventType
      const updatedPeriod: IPeriod = payload.new as IPeriod

      if (updateType === 'UPDATE') {
        setPeriod(updatedPeriod)
        // setCurrentHealth(Number(updatedPeriod[healthKey]))
      }

    }).subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase, initialCurrentPeriod.id])

  // Calculate the earned amount
  useEffect(() => {
    if (period && awards) {
      const awardPot = calculateAwardPot(awards, period)
      setEarnedAmount(awardPot)
    }
  }, [awards, period])



  if (initialCurrentPeriod && period && currentMonthPeriod && awards && awards.length >= 1) {
    return (
      <>

        <div className="flex flex-col gap-y-16 w-full md:flex-1 h-full z-10">
          <HUD
            today={today}
            player_name="UXNTEAM"
            earned_amount={earnedAmount}
            currentMonthPeriod={currentMonthPeriod}
            awards={awards}
            incidents={incidents}
            userData={userData}
            period_name={period.name}
            currentHealth={period[healthKey] as number}
            achieved_awards={[
              period.achieved_1 as TAwardId ?? null,
              period.achieved_2 as TAwardId ?? null,
              period.achieved_3 as TAwardId ?? null,
            ]}
          />

          <div className="flex flex-col gap-y-10 md:justify-center items-center w-full h-full xl:px-16 xl:flex-row xl:items-start">

            <MainCounter
              days={period.days_without_criticals}
              userData={userData}
              today={today}
              periodId={period.id}
              incidents_amount={incidents.length}
            />

            <AchievementsDisplay
              awards={awards}
              daysSinceLastCriticalError={period.days_without_criticals}
              minorIssues={incidents}
              currentHealth={period[healthKey] as number}
              today={today}
              period_end_date={period.end_date}
            />

          </div>
        </div>


      </>
    )
  }

  return <div>No data</div>



}

export default PageContent