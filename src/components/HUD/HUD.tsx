import PlayerStatus from "./PlayerStatus"
import clsx from "clsx"
import { type IPeriod, type IAward, type IMinorIssue } from "types"
import Period from "./Period"
import styles from "./HUD.module.css"
import AwardStars from "../AwardStars/AwardStars"
import Hearts from "./Hearts/Hearts"
import { type User } from "@supabase/supabase-js"

interface HUDProps {
  player_name?: string
  daysSinceLastCriticalError: number
  period: IPeriod
  currentMonthPeriod: IPeriod
  className?: string
  awards: IAward[]
  minor_issues?: IMinorIssue[]
  userData?: User | null
}

const HUD = ({ player_name = "Unknown", daysSinceLastCriticalError = 0, period, currentMonthPeriod, className, awards, minor_issues, userData }: HUDProps) => {

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
            coins={daysSinceLastCriticalError}
            className="flex-1"
          />

          <Period period={period} className="flex-1" />
        </div>

        <div className="flex gap-x-[70px] gap-y-8 flex-col-reverse lg:flex-row flex-wrap justify-end">
          <Hearts
            minor_issues={minor_issues}
            userData={userData}
            currentMonthPeriod={currentMonthPeriod}
          />

          <AwardStars awards={awards} daysSinceLastCriticalError={daysSinceLastCriticalError} />
        </div>

      </div>
    </div>
  )

}

export default HUD