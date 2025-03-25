import CoinCounter from "./CoinCounter/CoinCounter"
import clsx from "clsx"

interface PlayerStatusProps {
  player_name?: string
  className?: string
  earned_amount: number
}

const PlayerStatus = ({ player_name = "Unknown", className, earned_amount = 0 }: PlayerStatusProps) => {

  // const awardPot = calculateAwardPot(daysSinceLastCriticalError, awards, period)
  
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
        <CoinCounter coins={earned_amount} />
      </div>

    </div>
  )
}

export default PlayerStatus