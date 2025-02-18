import PlayerStatus from "./PlayerStatus"
import Period from "./Period"
import clsx from "clsx"

interface HUDProps {
  player_name?: string
  coins: number
  period: 1 | 2 | 3 | 4
  className?: string
}

const HUD = ({ player_name = "Unknown", coins = 0, period = 1, className }: HUDProps) => {

  return (
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
  )

}

export default HUD