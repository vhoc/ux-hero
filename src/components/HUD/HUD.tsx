"use client"
import PlayerStatus from "./PlayerStatus"
import clsx from "clsx"
import { type IPeriod, type IAward, type IIncident, type ISingleMonthPeriod, type TAwardId } from "types"
import Period from "./Period"
import styles from "./HUD.module.css"
import AwardStars from "../AwardStars/AwardStars"
import Hearts from "./Hearts/Hearts"
import { type User } from "@supabase/supabase-js"

interface HUDProps {
  today: Date
  player_name?: string
  daysSinceLastCriticalError: number
  initialCurrentPeriod: IPeriod
  currentMonthPeriod: ISingleMonthPeriod
  className?: string
  awards: IAward[]
  incidents?: IIncident[]
  userData?: User | null
  period: IPeriod
  currentHealth: number
  achieved_awards: Array<TAwardId | null>
}

const HUD = ({ today, player_name = "Unknown", daysSinceLastCriticalError = 0, initialCurrentPeriod, currentMonthPeriod, className, awards, userData, period, currentHealth, achieved_awards }: HUDProps) => {

  return (
    <div className={styles.slideIn}>
      <div
        className={clsx(`
        w-full 
        flex gap-x-[70px] gap-y-10 flex-col lg:flex-row items-center lg:justify-between lg:items-start pt-10
        px-4 lg:px-8 xl:px-16
        `, className
        )}
      >
        <div className="flex gap-x-[70px] gap-y-4 flex-col md:flex-row">
          <PlayerStatus
            player_name={player_name}
            daysSinceLastCriticalError={daysSinceLastCriticalError}
            className="flex-1"
            awards={awards}
            period={period}
          />

          <Period period={period} className="flex-1" />
        </div>

        <div className="flex gap-x-[70px] gap-y-8 flex-col-reverse lg:flex-row flex-wrap justify-end">
          <Hearts
            health={currentHealth}
            today={today}
            userData={userData}
            currentMonthPeriod={currentMonthPeriod}
          />

          <AwardStars
            awards={awards}
            achieved_awards={achieved_awards}
          />
        </div>

      </div>
    </div>
  )

}

export default HUD