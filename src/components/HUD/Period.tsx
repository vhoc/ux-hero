import clsx from "clsx"

interface PeriodProps {
  period: 1 | 2 | 3 | 4
  className?: string
}

const Period = ({ period = 1, className }: PeriodProps) => {

  const periodTable = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th"
  }

  return (
    <div className={clsx(
      "flex flex-col justify-end border-solid gap-x-4 min-w-72 max-w-[365px]",
      className
    )}>

      <div className="flex justify-between">
        <span className="text-sm">PERIOD</span>
      </div>

      <div className="flex justify-between">
        <span className="text-2xl">{`${periodTable[period]} QUARTER`}</span>
      </div>

    </div>
  )
}

export default Period