import PlayerStatus from "./PlayerStatus"
import clsx from "clsx"
import { type IPeriod } from "types"
import Period from "./Period"
import styles from "./HUD.module.css"

interface HUDProps {
  player_name?: string
  coins: number
  period: IPeriod
  className?: string
}

const HUD = ({ player_name = "Unknown", coins = 0, period, className }: HUDProps) => {

  return (
    <div className={styles.slideIn}>
      <div
        className={clsx(`
        w-full 
        flex gap-x-[70px] gap-y-4 flex-col lg:flex-row pt-10
        `, className
      )}
      >

        <PlayerStatus player_name={player_name} coins={coins} className="flex-1" />
        
        <Period period={period} className="flex-1" />

      </div>
    </div>
  )

}

export default HUD