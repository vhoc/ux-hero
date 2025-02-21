import clsx from "clsx"
import { type IPeriod } from "types"

interface PeriodProps {
  period: IPeriod
  className?: string
}

const Period = ({ period, className }: PeriodProps) => {

  return (
    <div className={clsx(
      "flex flex-col justify-end border-solid gap-x-4 min-w-72 max-w-[365px]",
      className
    )}>

      <div className="flex justify-between">
        <span className="text-sm">PERIOD</span>
      </div>

      <div className="flex justify-between">
        <span className="text-2xl uppercase">{period.name ?? "No period"}</span>
      </div>

    </div>
  )
}

export default Period