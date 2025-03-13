import PlayerStatus from "./PlayerStatus"
import clsx from "clsx"
import { type IPeriod, type IAward, type IIncident, type ISingleMonthPeriod } from "types"
import Period from "./Period"
import styles from "./HUD.module.css"
import AwardStars from "../AwardStars/AwardStars"
import Hearts from "./Hearts/Hearts"
import { type User } from "@supabase/supabase-js"
import { calculateMonthOfQuarter } from "@/utils/misc"

interface HUDProps {
  today: Date
  player_name?: string
  daysSinceLastCriticalError: number
  period: IPeriod
  currentMonthPeriod: ISingleMonthPeriod
  className?: string
  awards: IAward[]
  incidents?: IIncident[]
  userData?: User | null
}

const HUD = ({ today, player_name = "Unknown", daysSinceLastCriticalError = 0, period, currentMonthPeriod, className, awards, userData }: HUDProps) => {

  // Select the health value from the period that matches the month of today's date.
  const monthOfQuarter = calculateMonthOfQuarter(today)
  const healthKey = `health_${monthOfQuarter}` as keyof IPeriod
  const currentHealth = Number(period[healthKey])
  const achieved_awards = [
    period.achieved_1 ?? null,
    period.achieved_2 ?? null,
    period.achieved_3 ?? null,
  ]

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