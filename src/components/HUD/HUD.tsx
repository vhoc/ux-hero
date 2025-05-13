"use client"
import PlayerStatus from "./PlayerStatus"
import clsx from "clsx"
import { type IPeriod, type IAward, type IIncident, type ISingleMonthPeriod, type TAwardId } from "types"
import Period from "./Period"
import styles from "./HUD.module.css"
import AwardStars from "../AwardStars/AwardStars"
import Hearts from "./Hearts/Hearts"
import { type User } from "@supabase/supabase-js"
import Image from "next/image"
import imgWarning from "@/../public/img/ui/warning.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props"

interface HUDProps {
  today: Date
  player_name?: string
  currentMonthPeriod: ISingleMonthPeriod
  className?: string
  awards: IAward[]
  incidents?: IIncident[]
  userData?: User | null
  period_name: string
  currentHealth: number
  achieved_awards: Array<TAwardId | null>
  earned_amount: number
  incidents_amount: number
}

const HUD = ({ today, player_name = "Unknown", currentMonthPeriod, className, awards, userData, period_name, currentHealth, achieved_awards, earned_amount, incidents_amount = 0 }: HUDProps) => {

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
        <div className="flex gap-x-[70px] gap-y-4 flex-col">
          <div className="flex gap-x-[70px] gap-y-4 flex-col md:flex-row">
            <PlayerStatus
              player_name={player_name}
              className="flex-1"
              earned_amount={earned_amount}
            />

            <Period period_name={period_name} className="flex-1" />
          </div>

          {
            incidents_amount >= 1 ?
              <div className="w-full flex items-center gap-4 justify-start">
                <Image src={imgWarning as StaticImport} alt="Warning" width={20} height={22} />
                <div className="flex gap-2 items-center">
                  <span>{incidents_amount}</span>
                  <span>INCIDENTS</span>
                </div>
              </div>
              : null
          }
        </div>

        <div className="flex gap-x-[70px] gap-y-8 flex-col-reverse lg:flex-row flex-wrap justify-end">
          <Hearts
            health={currentHealth}
            today={today}
            userData={userData}
            currentMonthPeriod={currentMonthPeriod}
          />

          <AwardStars
            awards={awards}
            achieved_awards={achieved_awards}
          />
        </div>

      </div>
    </div>
  )

}

export default HUD