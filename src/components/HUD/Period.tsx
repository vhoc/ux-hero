import clsx from "clsx"

interface PeriodProps {
  period_name: string
  className?: string
}

const Period = ({ period_name, className }: PeriodProps) => {

  return (
    <div className={clsx(
      "flex flex-col justify-end border-solid gap-x-4 min-w-72 max-w-[365px]",
      className
    )}>

      <div className="flex justify-between">
        <span className="text-xs md:text-sm">PERIOD</span>
      </div>

      <div className="flex justify-between">
        <span className="text-xl md:text-2xl uppercase">{period_name ?? "No period"}</span>
      </div>

    </div>
  )
}

export default Period