"use client"
import { type IAward } from "types";
import Image from "next/image"
import clsx from "clsx";
import { calculateBonusStatus } from "@/utils/misc";
import { useState, useEffect } from "react";
import styles from "./AchievementCard.module.css";

interface AchievementCardProps {
  award: IAward;
  name: string
  state: "locked" | "upcoming" | "unlocked"
  currentHealth: number
  isNowPlaying?: boolean
  daysSinceLastCriticalError: number
  award_days_required: number
  start_period_date: Date
  // lost?: boolean
}

const AchievementCard = ({ award, name, state = "unlocked", currentHealth, isNowPlaying = false }: AchievementCardProps) => {

  // Console log all the prop values
  // console.log("AchievementCard props: ", { award, name, state, currentHealth, isNowPlaying, daysSinceLastCriticalError })

  const MAX_INCIDENTS = Number(process.env.MAX_INCIDENTS)
  const bonus_status = calculateBonusStatus(currentHealth)
  const [bonusStatus, setBonusStatus] = useState<string>(bonus_status)
  const [halfBonusWarning, setHalfBonusWarning] = useState<boolean>(false)
  const [noBonusWarning, setNoBonusWarning] = useState<boolean>(false)

  useEffect(() => {
    const newStatus = calculateBonusStatus(currentHealth)
    setBonusStatus(newStatus)
  }, [currentHealth])

  // Half a bonus warning
  useEffect(() => {
    if (currentHealth === (MAX_INCIDENTS / 2) + 1 ) {
      setHalfBonusWarning(true)
    } else {
      setHalfBonusWarning(false)
    }
  }, [currentHealth, MAX_INCIDENTS])

  // No bonus warning
  useEffect(() => {
    if (currentHealth === 1) {
      setNoBonusWarning(true)
    } else {
      setNoBonusWarning(false)
    }
  }, [currentHealth, MAX_INCIDENTS])

  return (
    <div className={clsx(
      state === "unlocked" ? styles.slideIn : "",
      state === "upcoming" ? styles.slideIn2 : "",
      state === "locked" ? styles.slideIn3 : "",
    )}>
      <div
        className={clsx(`
          flex bg-white opacity-100 border-4 border-solid border-black
          pr-[30px] pl-4 py-4 
          md:pr-[60px] md:pl-10 md:py-8
          gap-[19px] items-center
          ${ state === "unlocked" && bonusStatus !== "lost" ?  `${styles.animatePulseScale}` : state === "unlocked" && bonusStatus === "lost" ? "opacity-40 scale-75 origin-top-right grayscale" : "" }
          ${ state === "upcoming" ? "opacity-60 scale-90 origin-top-right grayscale" : "" }
          ${ state === "locked" ? "opacity-40 scale-75 origin-top-right grayscale" : "" }
        `)}
        style={{
          boxShadow: `10px 10px 0px ${ state === "unlocked" ? "#6ddaa1" :  "#000000" }`,
        }}
      >
        <div
          className={clsx(
            bonusStatus === "half" ?
            "w-[44px] min-w-[44px] h-[40px] relative"
            :
            "w-[74px] min-w-[74px] h-[70px] relative"
            )}>
          <Image
            src={ (isNowPlaying && halfBonusWarning || noBonusWarning) ? award.icon_warning! : award.icon! }
            alt="Reward star"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className={ bonusStatus === "lost" ? "grayscale" : ""}
          />
        </div>

        <div className="flex flex-col">
          <span className={clsx("capitalize text-xs md:text-lg text-black", bonusStatus === "lost" ? "text-gray-500" : "")}>
            {
              isNowPlaying && noBonusWarning ?
                `LAST CHANCE!`
              :
              isNowPlaying &&halfBonusWarning ?// Risk warning for half award
                  `FULL REWARD AT RISK!`
                :
                 isNowPlaying &&bonusStatus === "half" ?
                    `Keep going!`
                  :
                    `${ name }!`
            }
            {/* {`${ name }!${ bonus_status === "lost" ? " (Lost)" : "" }`} */}
          </span>

          <p className={clsx("text-black text-[10px] md:text-base", bonusStatus === "lost" ? "text-gray-500" : "")}>
            {
              bonusStatus === "lost" ? 
              `This award is no longer available for this month due to the accumulation of ${MAX_INCIDENTS} minor issues.`
              :
              // `${award.days_required - daysSinceLastCriticalError} days to achieve ${award.description}!`
                isNowPlaying && noBonusWarning ? `You have half a heart left to keep the $${award.value / 2 } reward!` :
                  isNowPlaying && halfBonusWarning ? `Reward currently valued in $${award.value} until next incident!` :
                // `${!isNowPlaying ? `${award_days_required - daysSinceLastCriticalError} days to go.` : ''} Reward currently valued in $${bonusStatus === "half" ? award.value / 2 : award.value}!`
                `Reward currently valued in $${bonusStatus === "half" ? award.value / 2 : award.value}!`
            }
          </p>
        </div>

      </div>
    </div>
  )

}

export default AchievementCard;