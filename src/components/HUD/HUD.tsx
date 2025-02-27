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
  className?: string
  awards: IAward[]
  minor_issues?: IMinorIssue[]
  userData?: User | null
}

const HUD = ({ player_name = "Unknown", daysSinceLastCriticalError = 0, period, className, awards, minor_issues, userData }: HUDProps) => {

  return (
    <div className={styles.slideIn}>
      <div
        className={clsx(`
        w-full 
        flex gap-x-[70px] gap-y-4 flex-col lg:flex-row items-center lg:justify-between pt-10
        `, className
        )}
      >
        <div className="flex gap-x-[70px] gap-y-4 flex-col lg:flex-row">
          <PlayerStatus
            player_name={player_name}
            coins={daysSinceLastCriticalError}
            className="flex-1"
          />

          <Period period={period} className="flex-1" />
        </div>

        <div className="flex gap-x-[70px] gap-y-8 flex-col lg:flex-row flex-wrap justify-end">
          <Hearts
            minor_issues={minor_issues}
            userData={userData}
          />

          <AwardStars awards={awards} daysSinceLastCriticalError={daysSinceLastCriticalError} />
        </div>

      </div>
    </div>
  )

}

export default HUD