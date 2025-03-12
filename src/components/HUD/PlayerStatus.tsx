import { type IAward, type IPeriod } from "types"
import CoinCounter from "./CoinCounter/CoinCounter"
import clsx from "clsx"
import { calculateAwardPot } from "@/utils/misc"

interface PlayerStatusProps {
  player_name?: string
  daysSinceLastCriticalError: number
  className?: string
  awards: IAward[]
  period: IPeriod
}

const PlayerStatus = ({ player_name = "Unknown", daysSinceLastCriticalError = 0, className, awards = [], period }: PlayerStatusProps) => {

  const awardPot = calculateAwardPot(daysSinceLastCriticalError, awards, period)
  
  return (
    <div className={clsx(
      "flex flex-col justify-end gap-x-4 min-w-60 max-w-[365px]",
      className
    )}>

      <div className="flex justify-between">
        <span className="text-xs md:text-sm">PLAYER</span>
      </div>

      <div className="flex justify-between gap-x-4">
        <span className="text-xl md:text-2xl">{player_name}</span>
        <CoinCounter coins={awardPot} />
      </div>

    </div>
  )
}

export default PlayerStatus