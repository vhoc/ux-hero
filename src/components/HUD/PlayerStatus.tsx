import CoinCounter from "./CoinCounter/CoinCounter"
import clsx from "clsx"

interface PlayerStatusProps {
  player_name?: string
  coins: number
  className?: string
}

const PlayerStatus = ({ player_name = "Unknown", coins = 0, className }: PlayerStatusProps) => {
  return (
    <div className={clsx(
      "flex flex-col justify-end gap-x-4 min-w-60 max-w-[365px]",
      className
    )}>

      <div className="flex justify-between">
        <span className="text-sm">PLAYER</span>
      </div>

      <div className="flex justify-between gap-x-4">
        <span className="text-2xl">{player_name}</span>
        <CoinCounter coins={coins} />
      </div>

    </div>
  )
}

export default PlayerStatus